package com.goofinity.pgc_service.config.dbmigrations;

import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import com.goofinity.pgc_service.domain.*;
import com.goofinity.pgc_service.domain.order.Order;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.domain.productType.ProductType;
import com.goofinity.pgc_service.domain.productType.ProductTypePrintFileFormat;
import com.goofinity.pgc_service.enums.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.hashids.Hashids;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.goofinity.pgc_service.util.NumberUtil.addDouble;
import static com.goofinity.pgc_service.util.NumberUtil.subtractDouble;

/**
 * Creates the initial database setup.
 */
@ChangeLog(order = "001")
public class InitialSetupMigration {
    @ChangeSet(order = "01", author = "initiator", id = "01-addUsers")
    public void addUsers(MongoTemplate mongoTemplate) {
        User adminUser = new User();
        adminUser.setId("user-2");
        adminUser.setEmail("admin@admin.com");
        adminUser.setFirstName("admin");
        adminUser.setLastName("Administrator");
        adminUser.setActivated(true);
        adminUser.setCreatedBy("system");
        adminUser.setCreatedDate(Instant.now());
        adminUser.setRoles(new HashSet<>(Collections.singletonList(RoleEnum.ROLE_ADMIN.name())));
        adminUser.setSellerLevel(null);
        adminUser.setUniqueKey(new Hashids(User.SALT, 7).encode(System.currentTimeMillis()));
        mongoTemplate.save(adminUser);
    }

    @ChangeSet(order = "02", author = "initiator", id = "02-addAdminConfigs")
    public void addAdminConfigs(MongoTemplate mongoTemplate) {
        Config config = Config.builder()
            .key(ConfigEnum.AUTO_APPROVE.name())
            .value("True")
            .build();
        mongoTemplate.save(config);
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.PENDING_DESIGN_6_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been approved into PrintWay system for <strong>6 hours</strong>. However, design files have not been uploaded completely. Kindly complete it so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.PENDING_DESIGN_24_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been approved into PrintWay system for <strong>24 hours</strong>. However, design files have not been uploaded completely. Kindly complete it so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.PENDING_DESIGN_48_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been approved into PrintWay system for <strong>48 hours</strong>. However, design files have not been uploaded completely. Kindly complete it so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.PENDING_DESIGN_72_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been approved into PrintWay system for <strong>72 hours</strong>. However, design files have not been uploaded completely. Kindly complete it so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.ACTION_REQUIRED_6_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in ACTION REQUIRED status&nbsp;or <strong>6 hours</strong>. Kindly check and take proper action on it&nbsp;so that your order can be&nbsp;processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.ACTION_REQUIRED_24_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in ACTION REQUIRED status&nbsp;or <strong>24 hours</strong>. Kindly check and take proper action on it&nbsp;so that your order can be&nbsp;processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.ACTION_REQUIRED_48_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in ACTION REQUIRED status&nbsp;or <strong>48 hours</strong>. Kindly check and take proper action on it&nbsp;so that your order can be&nbsp;processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.ACTION_REQUIRED_72_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in ACTION REQUIRED status&nbsp;or <strong>72 hours</strong>. Kindly check and take proper action on it&nbsp;so that your order can be&nbsp;processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.NEED_PAY_6_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in NEED PAY status&nbsp;or <strong>6 hours</strong>. Kindly check and make a deposit&nbsp;so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.NEED_PAY_24_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in NEED PAY status&nbsp;or <strong>24 hours</strong>. Kindly check and make a deposit&nbsp;so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.NEED_PAY_48_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in NEED PAY status&nbsp;or <strong>48 hours</strong>. Kindly check and make a deposit&nbsp;so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.NEED_PAY_72_HOURS.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your order #" + EmailTagEnum.ORDER_NAME.getValue() + " (" + EmailTagEnum.LINE_ITEM_SKU.getValue() + ") has been in NEED PAY status&nbsp;or <strong>72 hours</strong>. Kindly check and make a deposit&nbsp;so that your order can be processed as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
    }

    @ChangeSet(order = "03", author = "initiator", id = "03-addNotificationConfigs")
    public void addNotificationConfigs(MongoTemplate mongoTemplate) {
        mongoTemplate.save(NotificationSetting.builder()
            .id(RoleEnum.ROLE_ADMIN_CONSTANT)
            .configs(Arrays.asList(
                Config.builder()
                    .key(ConfigEnum.NEWS_UPDATE_EMAIL.name())
                    .value("true")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.NEWS_UPDATE_PUSH.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_PROCESSING_EMAIL.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_PROCESSING_PUSH.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_ON_HOLD_EMAIL.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_ON_HOLD_PUSH.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_CANCEL_EMAIL.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_CANCEL_PUSH.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_REFUND_EMAIL.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.ORDER_UPDATE_REFUND_PUSH.name())
                    .value("false")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.BALANCE_UPDATE_EMAIL.name())
                    .value("true")
                    .build(),
                Config.builder()
                    .key(ConfigEnum.BALANCE_UPDATE_PUSH.name())
                    .value("false")
                    .build()))
            .build());
    }

    @ChangeSet(order = "04", author = "initiator", id = "04-addBalanceForAdmin")
    public void addBalanceForAdmin(MongoTemplate mongoTemplate) {
        mongoTemplate.save(UserBalance.builder()
            .email(RoleEnum.ROLE_ADMIN.name())
            .availableAmount(0)
            .paidAmount(0)
            .upcomingAmount(0)
            .pendingAmount(0)
            .build());

    }

    @ChangeSet(order = "05", author = "initiator", id = "05-addAdminLineItemStatistic")
    public void addAdminLineItemStatistic(MongoTemplate mongoTemplate) {
        mongoTemplate.save(LineItemStatistic.builder()
            .id(RoleEnum.ROLE_ADMIN_CONSTANT)
            .statistic(ProduceStatusEnum.initStatusStatistic())
            .build());
    }

    @ChangeSet(order = "06", author = "initiator", id = "06-addCarriers")
    public void addCarriers(MongoTemplate mongoTemplate) {
        for (CarrierEnum carrier : CarrierEnum.values()) {
            mongoTemplate.save(Carrier.builder()
                .name(carrier.getName())
                .code(carrier.getCode())
                .url(carrier.getUrl())
                .active(true)
                .build());
        }
    }

    @ChangeSet(order = "07", author = "initiator", id = "07-updateAdminConfigs")
    public void updateAdminConfigs(MongoTemplate mongoTemplate) {
        mongoTemplate.save(Config.builder()
            .key(ConfigEnum.SELLER_NEXT_LEVEL.name())
            .value("<p>Hi " + EmailTagEnum.FIRST_NAME.getValue() + ",</p>\n" +
                "\n" +
                "<p>Your level is about&nbsp;to upgrade to&nbsp;<strong>" + EmailTagEnum.NEXT_LEVEL.getValue() + "</strong> with progress&nbsp;<strong>" + EmailTagEnum.TOTAL_ORDER.getValue() + "/" + EmailTagEnum.TOTAL_ORDER_NEXT_LEVEL.getValue() + "&nbsp;</strong>orders. Kindly check and take proper action on it&nbsp;so that your level can be&nbsp;upgraded as soon as possible.</p>\n" +
                "\n" +
                "<p>Kind regards,</p>\n" +
                "\n" +
                "<p>PrintWay Team.</p>\n")
            .build());
    }

    @ChangeSet(order = "08", author = "initiator", id = "08-updateDesignSku")
    public void updateDesignSku(MongoTemplate mongoTemplate) throws InterruptedException {
        Map<String, String> skuDesign = new HashMap<>();
        List<ProductType> productTypes = mongoTemplate.findAll(ProductType.class);
        for (ProductType productType : productTypes) {
            for (ProductTypePrintFileFormat printFileFormat : productType.getPrintFileFormats()) {
                String oldSku = productType.getId() + printFileFormat.getSku() + printFileFormat.getUniqueKey();
                printFileFormat.setSku(RandomStringUtils.random(4, 0, 0, true, true, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray()));
                Thread.sleep(100);
                skuDesign.put(oldSku, printFileFormat.getSku());
            }
            mongoTemplate.save(productType);
        }

        List<Product> products = mongoTemplate.findAll(Product.class);
        for (Product product : products) {
            for (ProductTypeGroup productType : product.getProductTypes()) {
                for (ProductPrintFileDetail printFileImage : productType.getPrintFileImages()) {
                    String sku = skuDesign.get(productType.getProductType().getId() + printFileImage.getSku() + printFileImage.getUniqueKey());
                    if (sku != null) {
                        printFileImage.setSku(sku);
                    }
                }
            }
            mongoTemplate.save(product);
        }

        List<Order> orders = mongoTemplate.findAll(Order.class);
        for (Order order : orders) {
            for (LineItem lineItem : order.getLineItems()) {
                lineItem.getPrintFileImages().forEach(productPrintFileDetail -> {
                    String sku = skuDesign.get(lineItem.getProductTypeId() + productPrintFileDetail.getSku() + productPrintFileDetail.getUniqueKey());
                    if (sku != null) {
                        productPrintFileDetail.setSku(sku);
                    }
                });
            }
            mongoTemplate.save(order);
        }
    }

    @ChangeSet(order = "09", author = "initiator", id = "09-updateDesignSkuFinalOfFinal")
    public void updateDesignSkuFinalOfFinal(MongoTemplate mongoTemplate) throws InterruptedException {
        Map<String, String> skuDesign = new HashMap<>();
        List<ProductType> productTypes = mongoTemplate.findAll(ProductType.class);
        for (ProductType productType : productTypes) {
            for (ProductTypePrintFileFormat printFileFormat : productType.getPrintFileFormats()) {
                printFileFormat.setSku(productType.getSku());
                Thread.sleep(100);
            }
            mongoTemplate.save(productType);
        }

        List<Product> products = mongoTemplate.findAll(Product.class);
        for (Product product : products) {
            for (ProductTypeGroup productType : product.getProductTypes()) {
                String sku = productType.getProductType().getSku() + "-" + RandomStringUtils.random(4, 0, 0, true, true, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray());
                for (ProductPrintFileDetail printFileImage : productType.getPrintFileImages()) {
                    String oldSku = productType.getProductType().getId() + printFileImage.getSku() + printFileImage.getUniqueKey();
                    printFileImage.setSku(sku);
                    skuDesign.put(oldSku, sku);
                }
            }
            mongoTemplate.save(product);
        }

        List<Order> orders = mongoTemplate.findAll(Order.class);
        for (Order order : orders) {
            for (LineItem lineItem : order.getLineItems()) {
                lineItem.getPrintFileImages().forEach(productPrintFileDetail -> {
                    String sku = skuDesign.get(lineItem.getProductTypeId() + productPrintFileDetail.getSku() + productPrintFileDetail.getUniqueKey());
                    if (sku != null) {
                        productPrintFileDetail.setSku(sku);
                    }
                });
            }
            mongoTemplate.save(order);
        }
    }

    @ChangeSet(order = "11", author = "initiator", id = "11-statisticOrder")
    public void statisticOrder(MongoTemplate mongoTemplate) {
        List<Order> orders = mongoTemplate.findAll(Order.class);
        List<DailyStatistic> dailyStatistics = mongoTemplate.findAll(DailyStatistic.class);

        for (DailyStatistic dailyStatistic : dailyStatistics) {
            dailyStatistic.setTotalOrders(0);
        }

        for (Order order : orders) {
            DailyStatistic adminStatistic = findDailyStatistic(dailyStatistics, RoleEnum.ROLE_ADMIN_CONSTANT, order.getCreatedDate().truncatedTo(ChronoUnit.DAYS), false);
            DailyStatistic sellerStatistic = findDailyStatistic(dailyStatistics, order.getSellerEmail(), order.getCreatedDate().truncatedTo(ChronoUnit.DAYS), false);
            DailyStatistic siteStatistic = findDailyStatistic(dailyStatistics, order.getSite().getId(), order.getCreatedDate().truncatedTo(ChronoUnit.DAYS), true);

            adminStatistic.setTotalOrders(adminStatistic.getTotalOrders() + 1);
            sellerStatistic.setTotalOrders(sellerStatistic.getTotalOrders() + 1);
            siteStatistic.setTotalOrders(siteStatistic.getTotalOrders() + 1);
        }

        for (DailyStatistic dailyStatistic : dailyStatistics) {
            mongoTemplate.save(dailyStatistic);
        }
    }

    @ChangeSet(order = "12", author = "initiator", id = "12-statisticDashboard")
    public void statisticDashboard(MongoTemplate mongoTemplate) {
        List<User> users = mongoTemplate.findAll(User.class);
        List<Site> sites = mongoTemplate.findAll(Site.class);
        List<Order> orders = mongoTemplate.findAll(Order.class);
        List<TransactionHistory> transactionHistories = mongoTemplate.findAll(TransactionHistory.class);
        List<DailyStatistic> dailyStatistics = mongoTemplate.findAll(DailyStatistic.class);

        for (DailyStatistic dailyStatistic : dailyStatistics) {
            dailyStatistic.setTotalUsers(0);
            dailyStatistic.setTotalSites(0);
            dailyStatistic.setCustomBalance(0);
            dailyStatistic.setTotalBalance(0);
            dailyStatistic.setProfit(0);
            dailyStatistic.setRevenue(0);
        }

        //Statistic user
        for (User user : users) {
            if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
                DailyStatistic adminStatistic = findDailyStatistic(dailyStatistics, RoleEnum.ROLE_ADMIN_CONSTANT,
                    user.getCreatedDate().truncatedTo(ChronoUnit.DAYS), false);
                adminStatistic.setTotalUsers(adminStatistic.getTotalUsers() + 1);
            }
        }

        //Statistic site
        for (Site site : sites) {
            DailyStatistic adminStatistic = findDailyStatistic(dailyStatistics, RoleEnum.ROLE_ADMIN_CONSTANT,
                site.getCreatedDate().truncatedTo(ChronoUnit.DAYS), false);
            adminStatistic.setTotalSites(adminStatistic.getTotalSites() + 1);

            DailyStatistic sellerStatistic = findDailyStatistic(dailyStatistics, site.getEmail(),
                site.getCreatedDate().truncatedTo(ChronoUnit.DAYS), false);
            sellerStatistic.setTotalSites(sellerStatistic.getTotalSites() + 1);
        }

        //Statistic balance
        for (TransactionHistory transactionHistory : transactionHistories) {
            if (TransactionStatusEnum.APPROVED.name().equalsIgnoreCase(transactionHistory.getStatus())) {
                Instant statisticDate = (transactionHistory.getLastChangeStatusDate() == null
                    ? transactionHistory.getLastModifiedDate() : transactionHistory.getLastChangeStatusDate()).truncatedTo(ChronoUnit.DAYS);
                //For admin
                DailyStatistic adminStatistic = findDailyStatistic(dailyStatistics, RoleEnum.ROLE_ADMIN_CONSTANT, statisticDate, false);

                if (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.DEPOSIT.name())) {
                    adminStatistic.setTotalBalance(adminStatistic.getTotalBalance() + transactionHistory.getAmount());
                }

                if (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_ADD.name())
                    || transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_SUBTRACT.name())) {
                    adminStatistic.setCustomBalance(adminStatistic.getCustomBalance()
                        + (transactionHistory.getAmount() * (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_ADD.name()) ? 1 : -1)));
                }

                //For seller
                DailyStatistic sellerStatistic = findDailyStatistic(dailyStatistics, transactionHistory.getEmail(), statisticDate, false);

                if (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.DEPOSIT.name())) {
                    sellerStatistic.setTotalBalance(sellerStatistic.getTotalBalance() + transactionHistory.getAmount());
                }

                if (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_ADD.name())
                    || transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_SUBTRACT.name())) {
                    sellerStatistic.setCustomBalance(sellerStatistic.getCustomBalance()
                        + (transactionHistory.getAmount() * (transactionHistory.getType().equalsIgnoreCase(TransactionTypeEnum.CUSTOM_ADD.name()) ? 1 : -1)));
                }
            }
        }

        //Statistic revenue/profit
        for (Order order : orders) {
            for (LineItem lineItem : order.getLineItems()) {
                if (lineItem.isPaid() && !Arrays.asList(ProduceStatusEnum.CANCELED.name(), ProduceStatusEnum.REFUNDED.name()).contains(lineItem.getStatus())) {
                    DailyStatistic adminStatistic = findDailyStatistic(dailyStatistics, RoleEnum.ROLE_ADMIN_CONSTANT, lineItem.getLastStatusDate().truncatedTo(ChronoUnit.DAYS), false);
                    DailyStatistic sellerStatistic = findDailyStatistic(dailyStatistics, order.getSellerEmail(), lineItem.getLastStatusDate().truncatedTo(ChronoUnit.DAYS), false);
                    DailyStatistic siteStatistic = findDailyStatistic(dailyStatistics, order.getSite().getId(), lineItem.getLastStatusDate().truncatedTo(ChronoUnit.DAYS), true);

                    double saleCost = (Double.parseDouble(lineItem.getPrice()) - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity();
                    double baseCost = (lineItem.getBaseCost() - order.getDiscount() + lineItem.getCarrierCost()) * lineItem.getQuantity();
                    double supplierCost = lineItem.getSupplierCost() * lineItem.getQuantity();

                    sellerStatistic.setRevenue(addDouble(sellerStatistic.getRevenue(), saleCost));
                    siteStatistic.setRevenue(addDouble(siteStatistic.getRevenue(), saleCost));
                    adminStatistic.setRevenue(addDouble(adminStatistic.getRevenue(), baseCost));

                    sellerStatistic.setProfit(addDouble(sellerStatistic.getProfit(), subtractDouble(saleCost, baseCost)));
                    siteStatistic.setProfit(addDouble(siteStatistic.getProfit(), subtractDouble(saleCost, baseCost)));
                    adminStatistic.setProfit(addDouble(adminStatistic.getProfit(), subtractDouble(baseCost, supplierCost)));
                }
            }
        }


        for (DailyStatistic dailyStatistic : dailyStatistics) {
            mongoTemplate.save(dailyStatistic);
        }
    }

    private DailyStatistic findDailyStatistic(List<DailyStatistic> dailyStatistics, String keyword, Instant date, boolean isSite) {
        DailyStatistic dailyStatistic = dailyStatistics.stream()
            .filter(ds -> keyword.equalsIgnoreCase(isSite ? ds.getSite() : ds.getUser())
                && ds.getStatisticDate().equals(date.truncatedTo(ChronoUnit.DAYS)))
            .findFirst()
            .orElse(null);
        if (dailyStatistic == null) {
            dailyStatistic = DailyStatistic.builder()
                .user(isSite ? null : keyword)
                .site(isSite ? keyword : null)
                .statisticDate(date.truncatedTo(ChronoUnit.DAYS))
                .build();
            dailyStatistics.add(dailyStatistic);
        }

        return dailyStatistic;
    }

    @ChangeSet(order = "13", author = "initiator", id = "13-updateDesignSkuUpdateProductType")
    public void updateDesignSkuUpdateProductType(MongoTemplate mongoTemplate) {
        List<ProductType> productTypes = mongoTemplate.findAll(ProductType.class);
        for (ProductType productType : productTypes) {
            for (ProductTypePrintFileFormat printFileFormat : productType.getPrintFileFormats()) {
                printFileFormat.setSku(productType.getSku());
            }
            mongoTemplate.save(productType);
        }
    }

    @ChangeSet(order = "14", author = "initiator", id = "14-updateLastSyncOrderForSite")
    public void updateLastSyncOrderForSite(MongoTemplate mongoTemplate) {
        List<Site> sites = mongoTemplate.findAll(Site.class);
        for (Site site : sites) {
            site.setLastSyncOrderDate(Instant.now().minus(14, ChronoUnit.DAYS));
            mongoTemplate.save(site);
        }
    }

    @ChangeSet(order = "16", author = "initiator", id = "16-updatePaidAmount")
    public void updatePaidAmount(MongoTemplate mongoTemplate) {
        List<User> users = mongoTemplate.findAll(User.class);
        List<UserBalance> userBalances = mongoTemplate.findAll(UserBalance.class);
        List<TransactionHistory> transactionHistories = mongoTemplate.findAll(TransactionHistory.class);

        Map<String, UserBalance> userBalanceMap = new HashMap<>();
        for (User user : users) {
            if (user.getRoles().contains(RoleEnum.ROLE_SELLER_CONSTANT)) {
                userBalances.stream()
                    .filter(userBalance -> user.getEmail().equalsIgnoreCase(userBalance.getEmail()))
                    .findFirst()
                    .ifPresent(userBalance -> {
                        userBalance.setPaidAmount(0);
                        userBalanceMap.put(userBalance.getEmail(), userBalance);
                    });
            }
        }

        UserBalance adminBalance = userBalances.stream()
            .filter(userBalance -> RoleEnum.ROLE_ADMIN_CONSTANT.equalsIgnoreCase(userBalance.getEmail()))
            .findFirst().get();
        adminBalance.setPaidAmount(0);

        for (TransactionHistory transactionHistory : transactionHistories) {
            if (TransactionStatusEnum.APPROVED.name().equalsIgnoreCase(transactionHistory.getStatus())
                && TransactionTypeEnum.PAID_ITEM.name().equalsIgnoreCase(transactionHistory.getType())) {
                UserBalance userBalance = userBalanceMap.get(transactionHistory.getEmail());
                if (userBalance != null) {
                    userBalance.setPaidAmount(addDouble(userBalance.getPaidAmount(), transactionHistory.getAmount()));
                    adminBalance.setPaidAmount(addDouble(adminBalance.getPaidAmount(), transactionHistory.getAmount()));
                }
            }
        }

        for (Map.Entry<String, UserBalance> entry : userBalanceMap.entrySet()) {
            mongoTemplate.save(entry.getValue());
        }
        mongoTemplate.save(adminBalance);
    }
}
