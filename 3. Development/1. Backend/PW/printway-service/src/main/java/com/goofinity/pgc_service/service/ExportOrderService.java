package com.goofinity.pgc_service.service;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.goofinity.pgc_service.domain.ExportOrderHistory;
import com.goofinity.pgc_service.domain.ImageUpload;
import com.goofinity.pgc_service.domain.LineItem;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.dto.ExcelData;
import com.goofinity.pgc_service.dto.LineItemDTO;
import com.goofinity.pgc_service.dto.LineItemStatisticDTO;
import com.goofinity.pgc_service.enums.OrderLogTypeEnum;
import com.goofinity.pgc_service.enums.ProduceStatusEnum;
import com.goofinity.pgc_service.enums.VariantTypeEnum;
import com.goofinity.pgc_service.repository.ExportOrderHistoryRepository;
import com.goofinity.pgc_service.repository.ImageUploadRepository;
import com.goofinity.pgc_service.repository.OrderRepository;
import com.goofinity.pgc_service.repository.ProductRepository;
import com.goofinity.pgc_service.util.DataUtil;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExportOrderService {
    @Getter
    private List<String> supplierExportHeader = Arrays.asList("Order Name", "Origin Order ID", "Order Status", "Variant SKU",
        "Shipping Method", "Tracking Number", "Tracking URL", "Processing Date", "Product Name", "Product Type SKU",
        "Type", "Size", "Gender", "Color", "Pack", "Extra Discount", "Quantity", "Supplier Cost", "Shipping Name",
        "Shipping Address", "Shipping Company", "Shipping City", "Shipping Zip", "Shipping State", "Shipping Country",
        "Shipping Phone", "Design SKU", "Print File Url", "Mockup Image Url");

    @Getter
    private List<String> adminExportHeader = Arrays.asList("#Order", "Origin Order ID", "Order Status", "Status Date",
        "Seller Email", "Seller Plan", "Supplier ID", "Product Name", "Product Type SKU", "Variant SKU", "Type", "Gender",
        "Size", "Color", "Pack", "Extra", "Quantity", "Base Cost", "Carrier Cost", "Discount", "Total Selling Cost", "Supplier Cost", "Design SKU",
        "Site Url", "Customer Email", "Shipping Full Name", "Shipping Address", "Shipping Company", "Shipping City",
        "Shipping Zip", "Shipping State/Province Code", "Shipping Country Code", "Shipping Phone", "Image Url",
        "Carrier Code", "Tracking Number", "Comment");

    @Getter
    private List<String> sellerExportHeader = Arrays.asList("#Order", "Origin Order ID", "Order Status", "Status Date",
        "Product Name", "Product Type SKU", "Variant SKU", "Type", "Gender", "Size", "Color", "Pack", "Extra",
        "Quantity", "Base Cost", "Carrier Cost", "Discount", "Total Selling Cost", "Design SKU", "Site Url", "Customer Email",
        "Shipping Full Name", "Shipping Address", "Shipping Company", "Shipping City", "Shipping Zip",
        "Shipping State/Province Code", "Shipping Country Code", "Shipping Phone", "Image Url", "Carrier Code", "Tracking Number", "Comment");

    private final ProductRepository productRepository;
    private final ImageUploadRepository imageUploadRepository;
    private final ExportOrderHistoryRepository exportOrderHistoryRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final LineItemStatisticService lineItemStatisticService;
    private final ExcelService excelService;
    private final AmazonS3Service amazonS3Service;

    public ExportOrderService(final ProductRepository productRepository,
                              final ImageUploadRepository imageUploadRepository,
                              final ExportOrderHistoryRepository exportOrderHistoryRepository,
                              final OrderRepository orderRepository,
                              final ProductService productService,
                              final LineItemStatisticService lineItemStatisticService,
                              final ExcelService excelService,
                              final AmazonS3Service amazonS3Service) {
        this.productRepository = productRepository;
        this.imageUploadRepository = imageUploadRepository;
        this.exportOrderHistoryRepository = exportOrderHistoryRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.lineItemStatisticService = lineItemStatisticService;
        this.excelService = excelService;
        this.amazonS3Service = amazonS3Service;
    }

    public void resolveDataForSupplierExport(ExcelData excelData, ExportOrderHistory exportOrderHistory, Order order, List<LineItem> lineItems) {
        List<LineItemStatisticDTO> statisticDTOList = new ArrayList<>();
        for (LineItem lineItem : lineItems) {
            productRepository.findBySku(lineItem.getSku()).ifPresent(product -> {
                ProductType productType = productService.getProductTypeBySku(product, lineItem.getSku())
                    .orElse(null);
                ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, lineItem.getSku())
                    .orElse(null);

                if (productType != null && productVariantDetail != null) {
                    if (exportOrderHistory != null) {
                        lineItemStatisticService.addStatistic(statisticDTOList, order.getSellerEmail(),
                            ProduceStatusEnum.IN_PRODUCTION.name(), lineItem.getStatus());
                        lineItemStatisticService.addStatistic(statisticDTOList, lineItem.getSupplierId(),
                            ProduceStatusEnum.IN_PRODUCTION.name(), lineItem.getStatus());

                        exportOrderHistory.setTotalItem(exportOrderHistory.getTotalItem() + 1);
                        lineItem.setStatus(ProduceStatusEnum.IN_PRODUCTION.name());
                        lineItem.setChangeToProd(true);
                        lineItem.setExportOrderId(exportOrderHistory.getId());
                        order.addOrderLog(lineItem.getSku(), OrderLogTypeEnum.IN_PRODUCTION.name(), null);
                    }

                    ImageUpload imageUpload = imageUploadRepository.findById(StringUtils.defaultString(productVariantDetail.getImageId()))
                        .orElse(null);
                    String mockupImageUrls = imageUpload == null
                        ? (product.getImages().isEmpty() ? "" : product.getImages().get(0).getImage().getImageUrl())
                        : imageUpload.getImageUrl();

                    excelData.getRowData().add(Arrays.asList(
                        "#" + order.getOrderName(),
                        order.getId(),
                        lineItem.getStatus(),
                        lineItem.getSku(),
                        lineItem.getCarrier(),
                        "",
                        "",
                        lineItem.getLastStatusDate().toString(),
                        lineItem.getName(),
                        productType.getSku(),
                        getVariantData(VariantTypeEnum.TYPE.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.SIZE.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.GENDER.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.COLOR.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.PACK.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.EXTRA.getValue(), productVariantDetail),
                        lineItem.getQuantity() + "",
                        lineItem.getSupplierCost() + "",
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getFullName(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getAddress1() + ", " + order.getShippingAddress().getAddress2(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getCompany(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getCity(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getPostcode(),
                        order.getShippingAddress() == null ? "" : (StringUtils.isEmpty(order.getShippingAddress().getProvinceCode()) ? order.getShippingAddress().getProvince() : order.getShippingAddress().getProvinceCode()),
                        order.getShippingAddress() == null ? "" : (StringUtils.isEmpty(order.getShippingAddress().getCountryCode()) ? order.getShippingAddress().getCountry() : order.getShippingAddress().getCountryCode()),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getPhone(),
                        lineItem.getPrintFileImages().isEmpty() ? "" : lineItem.getPrintFileImages().get(0).getSku(),
                        lineItem.getPrintFileImages().stream()
                            .map(design -> design.getImage() == null ? null : (design.getName() + "|" + design.isCustom() + "|" + design.getImage().getImageUrl()))
                            .filter(s -> !StringUtils.isEmpty(s))
                            .collect(Collectors.joining("\r\n")),
                        mockupImageUrls
                    ));
                }
            });
        }

        // Update statistic
        statisticDTOList.forEach(lineItemStatisticService::sendStatisticStatus);
    }

    public void resolveDataForAdminAndSellerExport(ExcelData excelData, Order order, List<LineItem> lineItems, boolean isAdmin) {
        for (LineItem lineItem : lineItems) {
            productRepository.findBySku(lineItem.getSku()).ifPresent(product -> {
                ProductType productType = productService.getProductTypeBySku(product, lineItem.getSku())
                    .orElse(null);
                ProductVariantDetail productVariantDetail = productService.getProductVariantDetailBySku(product, lineItem.getSku())
                    .orElse(null);

                if (productType != null && productVariantDetail != null) {
                    List<String> rowData = new ArrayList<>(Arrays.asList(
                        "#" + order.getOrderName(),
                        order.getId(),
                        lineItem.getStatus(),
                        lineItem.getLastStatusDate() == null ? "" : DataUtil.formatterExport.format(lineItem.getLastStatusDate()),
                        order.getSellerEmail(),
                        order.getSeller().getSellerLevel() == null ? "" : order.getSeller().getSellerLevel().getName(),
                        lineItem.getSupplierId(),
                        lineItem.getName(),
                        productType.getSku(),
                        lineItem.getSku(),
                        getVariantData(VariantTypeEnum.TYPE.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.GENDER.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.SIZE.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.COLOR.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.PACK.getValue(), productVariantDetail),
                        getVariantData(VariantTypeEnum.EXTRA.getValue(), productVariantDetail),
                        lineItem.getQuantity() + "",
                        lineItem.getBaseCost() + "",
                        lineItem.getCarrierCost() + "",
                        (order.getDiscount() * lineItem.getQuantity()) + "",
                        (lineItem.getQuantity() * (lineItem.getBaseCost() + lineItem.getCarrierCost() - order.getDiscount())) + "",
                        lineItem.getSupplierCost() + "",
                        lineItem.getPrintFileImages().isEmpty() ? "" : lineItem.getPrintFileImages().get(0).getSku(),
                        order.getSite().getUrl(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getEmail(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getFullName(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getAddress1(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getCompany(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getCity(),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getPostcode(),
                        order.getShippingAddress() == null ? "" : (StringUtils.isEmpty(order.getShippingAddress().getProvinceCode()) ? order.getShippingAddress().getProvince() : order.getShippingAddress().getProvinceCode()),
                        order.getShippingAddress() == null ? "" : (StringUtils.isEmpty(order.getShippingAddress().getCountryCode()) ? order.getShippingAddress().getCountry() : order.getShippingAddress().getCountryCode()),
                        order.getShippingAddress() == null ? "" : order.getShippingAddress().getPhone(),
                        lineItem.getPrintFileImages().stream()
                            .map(design -> design.getImage() != null ? design.getImage().getImageUrl() : "empty")
                            .collect(Collectors.joining("\r\n")),
                        lineItem.getCarrierCode(),
                        lineItem.getTrackingNumber(),
                        lineItem.getStatusNote()
                    ));

                    if (!isAdmin) {
                        rowData.remove(4);
                        rowData.remove(4);
                        rowData.remove(4);
                        rowData.remove(18);
                    }
                    excelData.getRowData().add(rowData);
                }
            });
        }
    }

    public void createExportOrderHistory(User user, List<Order> orders, List<LineItemDTO> lineItemDTOs) throws IOException {
        Instant now = Instant.now();
        ExcelData excelData = new ExcelData();
        excelData.setHeaders(Collections.singletonList(getSupplierExportHeader()));
        ExportOrderHistory exportOrderHistory = exportOrderHistoryRepository.save(ExportOrderHistory.builder()
            .title("Export-order-" + now.toString())
            .supplierId(user.getId())
            .supplierName(user.getFullName())
            .totalItem(0)
            .build());

        Set<String> lineItemExportId = lineItemDTOs != null
            ? lineItemDTOs.stream()
            .map(lineItemDTO -> lineItemDTO.getOrderId() + "-" + lineItemDTO.getItemSku())
            .collect(Collectors.toSet())
            : new HashSet<>();

        //Resolve data
        for (Order order : orders) {
            resolveDataForSupplierExport(excelData, exportOrderHistory, order,
                order.getLineItems()
                    .stream()
                    .filter(lineItem -> user.getId().equals(lineItem.getSupplierId())
                        && ProduceStatusEnum.PROCESSING.name().equals(lineItem.getStatus())
                        && StringUtils.isEmpty(lineItem.getExportOrderId())
                        && !(!lineItemExportId.isEmpty() && !lineItemExportId.contains(order.getId() + "-" + lineItem.getSku())))
                    .collect(Collectors.toList()));
        }

        if (!excelData.getRowData().isEmpty()) {
            Workbook workbook = excelService.exportExcel("Orders", excelData);
            String filename = "orders-production-" + DataUtil.formatter.format(now) + ".xlsx";

            ByteArrayOutputStream amzOutputStream = new ByteArrayOutputStream();
            workbook.write(amzOutputStream);
            InputStream amzIn = new ByteArrayInputStream(amzOutputStream.toByteArray());
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setHeader("filename", filename);
            metadata.setContentLength(amzIn.available());

            exportOrderHistory.setUrl(amazonS3Service.uploadExportOrderToS3Bucket(filename, amzIn, metadata));
            exportOrderHistoryRepository.save(exportOrderHistory);
            orderRepository.saveAll(orders);
        } else {
            exportOrderHistoryRepository.delete(exportOrderHistory);
        }
    }

    public String getVariantData(String type, ProductVariantDetail productVariantDetail) {
        if (StringUtils.equalsIgnoreCase(type, productVariantDetail.getOption1Type())) {
            return productVariantDetail.getOption1();
        }

        if (StringUtils.equalsIgnoreCase(type, productVariantDetail.getOption2Type())) {
            return productVariantDetail.getOption2();
        }

        return "";
    }
}
