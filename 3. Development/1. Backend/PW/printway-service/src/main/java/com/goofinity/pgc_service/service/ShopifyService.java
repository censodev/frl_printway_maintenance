package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductImage;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.dto.RequestAccessTokenShopifyDTO;
import com.goofinity.pgc_service.dto.shopify.*;
import com.goofinity.pgc_service.dto.shopify.product.*;
import com.goofinity.pgc_service.event.shopifyUpdate.ShopifyUpdateBinding;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@EnableBinding(ShopifyUpdateBinding.class)
@Service
public class ShopifyService {
    private static final Logger log = LoggerFactory.getLogger(ShopifyService.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final int MAX_SIZE_BODY = 4000000;
    private final MessageChannel messageChannel;

    public ShopifyService(final ShopifyUpdateBinding shopifyUpdateBinding) {
        this.messageChannel = shopifyUpdateBinding.publisher();
    }


    public ShopifyOrderPage getPaidOrdersFrom(String url, String accessToken, String pageInfo, Instant startDate) throws IOException {
        url += "/admin/api/2020-07/orders.json?limit=100";
        if (StringUtils.isEmpty(pageInfo)) {
            url += "&financial_status=paid" +
                "&fulfillment_status=unfulfilled" +
                "&updated_at_min=" + startDate.toString();
        } else {
            url += "&page_info=" + pageInfo;
        }

        Connection.Response response = getRequest(url, accessToken);
        if (response.header("Link") == null || !response.header("Link").contains("next")) {
            pageInfo = null;
        } else {
            pageInfo = response.header("Link").substring(response.header("Link").lastIndexOf("page_info=") + 10, response.header("Link").lastIndexOf(">;"));
        }

        return ShopifyOrderPage.builder()
            .orders(objectMapper.readValue(response.body(), ShopifyOrdersResponseDTO.class).getOrders())
            .pageInfo(pageInfo)
            .build();
    }

    public long getLocationId(String url, String accessToken) throws IOException {
        String response = getRequest(url + "/admin/api/2020-07/locations.json", accessToken).body();
        ShopifyLocationsWrapDTO dto = objectMapper.readValue(response, ShopifyLocationsWrapDTO.class);
        return dto.getLocations().get(0).getId();
    }

    public String createWebhook(String topic, String webhookUrl, String url, String accessToken) throws IOException {
        String data = "{\n" +
            "  \"webhook\": {\n" +
            "    \"topic\": \"" + topic + "\",\n" +
            "    \"address\": \"" + webhookUrl + "\",\n" +
            "    \"format\": \"json\"\n" +
            "  }\n" +
            "}";
        return postRequest(url + "/admin/api/2020-07/webhooks.json", accessToken, Connection.Method.POST, data, true);
    }

    public String addTracking(String url, String accessToken, String orderId, long lineItemId, long locationId, String trackingNumber, String trackingUrl) throws IOException {
        Map<String, Long> lineItem = new HashMap<>();
        lineItem.put("id", lineItemId);
        return postRequest(url + "/admin/api/2020-07/orders/" + orderId + "/fulfillments.json",
            accessToken,
            Connection.Method.POST,
            "{\"fulfillment\":" + objectMapper.writeValueAsString(UpdateTrackingDTO.builder()
                .locationId(locationId)
                .notifyCustomer(true)
                .trackingNumber(trackingNumber)
                .trackingUrls(Collections.singletonList(trackingUrl))
                .lineItems(Collections.singletonList(lineItem))
                .build()) + "}");
    }

    public void updateTracking(String url, String accessToken, String orderId, long fulfillmentId, String trackingNumber, String trackingUrl) throws IOException {
        postRequest(url + "/admin/api/2020-07/orders/" + orderId + "/fulfillments/" + fulfillmentId + ".json",
            accessToken,
            Connection.Method.PUT,
            "{\"fulfillment\":" + objectMapper.writeValueAsString(UpdateTrackingDTO.builder()
                .id(fulfillmentId)
                .notifyCustomer(true)
                .trackingNumber(trackingNumber)
                .trackingUrls(Collections.singletonList(trackingUrl))
                .build()) + "}");
    }

    public List<ShopifyCollectionDTO> getSmartCollections(String url, String accessToken) throws IOException {
        String responseData = getRequest(url + "/admin/api/2020-07/smart_collections.json", accessToken).body();
        ShopifyCollectionsResponseDTO data = objectMapper.readValue(responseData, ShopifyCollectionsResponseDTO.class);
        return data.getSmartCollections();
    }

    public List<ShopifyCollectionDTO> getCustomCollections(String url, String accessToken) throws IOException {
        String responseData = getRequest(url + "/admin/api/2020-07/custom_collections.json", accessToken).body();
        ShopifyCollectionsResponseDTO data = objectMapper.readValue(responseData, ShopifyCollectionsResponseDTO.class);
        return data.getCustomCollections();
    }

    public ShopifyCollectionDTO createCollection(ShopifyCollectionDTO dto, String url, String accessToken) throws IOException {
        String response = postRequest(url + "/admin/api/2020-07/smart_collections.json", accessToken, Connection.Method.POST,
            objectMapper.writeValueAsString(ShopifyCollectionCreateDTO.builder()
                .customCollection(dto).build()));
        return objectMapper.readValue(response, ShopifyCollectionCreateDTO.class).getCustomCollection();
    }

    public ShopifyProductPage getProducts(String url, String accessToken, String collectionId, String keyword, String pageInfo) throws IOException {
        url += "/admin/api/2020-07/products.json?limit=150";
        if (StringUtils.isEmpty(pageInfo)) {
            url += "&published_status=published" +
                "&status=active" +
                "&title=" + keyword +
                "&collection_id=" + collectionId;
        } else {
            url += "&page_info=" + pageInfo;
        }

        Connection.Response response = getRequest(url, accessToken);
        if (response.header("Link") == null || !response.header("Link").contains("next")) {
            pageInfo = null;
        } else {
            pageInfo = response.header("Link").substring(response.header("Link").lastIndexOf("page_info=") + 10, response.header("Link").lastIndexOf(">;"));
        }

        return ShopifyProductPage.builder()
            .data(objectMapper.readValue(response.body(), ShopifyProductResponseDTO.class).getProducts())
            .pageInfo(pageInfo)
            .build();
    }

    public void createProduct(Product product, String url, String accessToken) throws IOException {
        ShopifyProductDTO productDTO = ShopifyProductDTO.builder()
            .title(product.getTitle())
            .bodyHtml(product.getDescription())
            .tags(product.getTags())
            .images(product.getImages().stream().map(image -> ShopifyImageDTO.builder()
                .src(image.getImage().getImageUrl())
                .position(image.getImagePosition())
                .build()).collect(Collectors.toList()))
            .variants(new ArrayList<>())
            .options(new ArrayList<>())
            .published(true)
            .build();

        setOptionsAndVariant(product, productDTO);

        Map<String, ShopifyProductDTO> data = new HashMap<>();
        data.put("product", productDTO);
        String response = postRequest(url + "/admin/api/2020-07/products.json", accessToken, Connection.Method.POST, objectMapper.writeValueAsString(data));
        ShopifyProductResponseDTO productResponse = objectMapper.readValue(response, ShopifyProductResponseDTO.class);

        //Assign product to collection
        if (product.getCategories() != null && !product.getCategories().isEmpty()) {
            for (String categoryId : product.getCategories()) {
                messageChannel.send(MessageBuilder.withPayload(objectMapper.writeValueAsString(ShopifyUpdateDTO
                    .builder()
                    .assignCatalogDTO(AssignCatalogDTO.builder()
                        .productId(productResponse.getProduct().getId())
                        .collectionId(categoryId)
                        .url(url)
                        .accessToken(accessToken)
                        .build())
                    .build()))
                    .build());
            }
        }

        updateImageForVariant(product, productResponse, url, accessToken);
        product.setUrl(product.getSite().getUrl() + "/products/" + productResponse.getProduct().getHandle());
        product.setProductId(productResponse.getProduct().getId());
    }

    public void replaceOptionsAndVariants(Product product, String url, String accessToken) throws IOException {
        ShopifyProductDTO productDTO = ShopifyProductDTO.builder()
            .id(product.getProductId())
            .options(new ArrayList<>())
            .variants(new ArrayList<>())
            .images(new ArrayList<>())
            .build();
        product.getImages().forEach(productImage -> {
            if (productImage.getImageId() != null && productImage.getImageId() > 0) {
                productDTO.getImages().add(ShopifyImageDTO.builder()
                    .id(productImage.getImageId())
                    .build());
            } else {
                productDTO.getImages().add(ShopifyImageDTO.builder()
                    .src(productImage.getImage().getImageUrl())
                    .position(productImage.getImagePosition())
                    .build());
            }
        });
        setOptionsAndVariant(product, productDTO);
        String requestData = "{\"product\": " + objectMapper.writeValueAsString(productDTO) + "}";
        String response = postRequest(url + "/admin/api/2020-07/products/" + product.getProductId() + ".json", accessToken,
            Connection.Method.PUT, requestData);
        ShopifyProductResponseDTO productResponse = objectMapper.readValue(response, ShopifyProductResponseDTO.class);
        updateImageForVariant(product, productResponse, url, accessToken);
    }

    private void setOptionsAndVariant(Product product, ShopifyProductDTO productDTO) {
        Map<String, Set<String>> options = new HashMap<>();
        product.getProductTypes().forEach(ptg -> {
            ptg.getProductType().getVariants().forEach(productTypeVariant -> {
                if (options.get(productTypeVariant.getName()) == null) {
                    options.put(productTypeVariant.getName(), new LinkedHashSet<>(productTypeVariant.getOptions()));
                } else {
                    options.get(productTypeVariant.getName()).addAll(productTypeVariant.getOptions());
                }
            });

            List<String> keys = new ArrayList<>(options.keySet());
            ptg.getVariantDetails().forEach(variantDetail -> {
                String option1 = keys.indexOf(variantDetail.getOption1Type()) == 0 ? variantDetail.getOption1() : variantDetail.getOption2();
                String option2 = keys.indexOf(variantDetail.getOption1Type()) == 0 ? variantDetail.getOption2() : variantDetail.getOption1();
                if (variantDetail.isEnable()) {
                    ShopifyVariantDTO shopifyVariantDTO;
                    if (product.getProductTypes().size() > 1) {
                        shopifyVariantDTO = ShopifyVariantDTO.builder()
                            .option1(ptg.getProductType().getTitle())
                            .option2(option1)
                            .option3(option2)
                            .sku(variantDetail.getSku())
                            .inventoryPolicy("continue")
                            .build();
                    } else {
                        shopifyVariantDTO = ShopifyVariantDTO.builder()
                            .option1(option1)
                            .option2(option2)
                            .sku(variantDetail.getSku())
                            .inventoryPolicy("continue")
                            .build();
                    }

                    if (variantDetail.getSalePrice() > 0 && variantDetail.getRegularPrice() > variantDetail.getSalePrice()) {
                        shopifyVariantDTO.setPrice(variantDetail.getSalePrice() + "");
                        shopifyVariantDTO.setCompareAtPrice(variantDetail.getRegularPrice() + "");
                    } else if (variantDetail.getRegularPrice() <= variantDetail.getSalePrice()) {
                        shopifyVariantDTO.setPrice(variantDetail.getSalePrice() + "");
                    }
                    productDTO.getVariants().add(shopifyVariantDTO);
                }
            });
        });

        for (Map.Entry<String, Set<String>> entry : options.entrySet()) {
            productDTO.getOptions().add(ShopifyOptionDTO.builder()
                .name(entry.getKey())
                .values(entry.getValue())
                .build());
        }

        if (product.getProductTypes().size() > 1) {
            productDTO.getOptions().add(0, ShopifyOptionDTO.builder()
                .name("Product")
                .values(product.getProductTypes().stream().map(ptg -> ptg.getProductType().getTitle()).collect(Collectors.toSet()))
                .build());
        }

        if (productDTO.getOptions().size() > 3) {
            throw new InvalidDataException("option_more_than_3");
        }
    }

    private void updateImageForVariant(Product product, ShopifyProductResponseDTO productResponse, String url, String accessToken) throws JsonProcessingException {
        //Update image for variant
        for (ProductTypeGroup ptg : product.getProductTypes()) {
            for (ProductVariantDetail variantDetail : ptg.getVariantDetails()) {
                if (variantDetail.isEnable()) {
                    long variantId = productResponse.getProduct().getVariants()
                        .stream()
                        .filter(shopifyVariantDTO -> shopifyVariantDTO.getSku().equals(variantDetail.getSku()))
                        .findFirst().orElse(new ShopifyVariantDTO()).getId();
                    long imagePosition = product.getImages().stream().filter(productImage -> productImage.getImage().getId().equals(variantDetail.getImageId()))
                        .findFirst()
                        .orElse(new ProductImage()).getImagePosition();
                    long shopifyImageId = productResponse.getProduct().getImages()
                        .stream()
                        .filter(shopifyImageDTO -> shopifyImageDTO.getPosition() == imagePosition)
                        .findFirst()
                        .orElse(new ShopifyImageDTO()).getId();
                    variantDetail.setId(variantId);
                    if (shopifyImageId > 0) {
                        messageChannel.send(MessageBuilder.withPayload(objectMapper.writeValueAsString(ShopifyUpdateDTO
                            .builder()
                            .updateVariantImageDTO(UpdateVariantImageDTO
                                .builder()
                                .variantId(variantId)
                                .imageId(shopifyImageId)
                                .url(url)
                                .accessToken(accessToken)
                                .build())
                            .build()))
                            .build());
                    }
                }
            }
        }
    }

    public void addProductToCollection(long productId, String collectionId, String url, String accessToken) throws IOException {
        String data = "{\"collect\": {\"product_id\": " + productId + ", \"collection_id\": " + collectionId + "}}";
        postRequest(url + "/admin/api/2020-07/collects.json", accessToken, Connection.Method.POST, data);
    }

    public void updateImageForVariant(long variantId, long imageId, String url, String accessToken) throws IOException {
        String data = "{\"variant\": {\"id\": " + variantId + ", \"image_id\": " + imageId + "}}";
        postRequest(url + "/admin/api/2020-07/variants/" + variantId + ".json", accessToken, Connection.Method.PUT, data);
    }

    public String getAccessToken(String url, String apiKey, String apiSecret, String code) throws IOException {
        String response = postRequest(url + "/admin/oauth/access_token", "", Connection.Method.POST,
            objectMapper.writeValueAsString(RequestAccessTokenShopifyDTO.builder()
                .clientId(apiKey)
                .clientSecret(apiSecret)
                .code(code)
                .build()));
        return objectMapper.readValue(response, Map.class).get("access_token").toString();
    }

    private String postRequest(String url, String accessToken, Connection.Method method, String data) throws IOException {
        return postRequest(url, accessToken, method, data, false);
    }

    private String postRequest(String url, String accessToken, Connection.Method method, String data, boolean isPassError) throws IOException {
        Connection.Response response = Jsoup.connect(url)
            .timeout(120000)
            .method(method)
            .requestBody(data)
            .header("X-Shopify-Access-Token", accessToken)
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .maxBodySize(MAX_SIZE_BODY)
            .execute();

        if (!isPassError && response.statusCode() != 200) {
            log.error("Error when request shopify: {}", response.body());
            throw new InvalidDataException("shopify_request");
        }

        return response.body();
    }

    public Connection.Response getRequest(String url, String accessToken) throws IOException {
        Connection.Response response = Jsoup.connect(url)
            .header("X-Shopify-Access-Token", accessToken)
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .maxBodySize(MAX_SIZE_BODY)
            .execute();

        if (response.statusCode() != 200) {
            log.error("Error when request shopify: {}", response.body());
            throw new InvalidDataException("shopify_request");
        }

        return response;
    }
}
