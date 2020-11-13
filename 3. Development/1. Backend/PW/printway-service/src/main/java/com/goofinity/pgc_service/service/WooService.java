package com.goofinity.pgc_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofinity.pgc_service.domain.product.Product;
import com.goofinity.pgc_service.domain.product.ProductTypeGroup;
import com.goofinity.pgc_service.domain.product.ProductVariantDetail;
import com.goofinity.pgc_service.dto.CollectionDTO;
import com.goofinity.pgc_service.dto.woo.WooCategoryDTO;
import com.goofinity.pgc_service.dto.woo.WooOrder;
import com.goofinity.pgc_service.dto.woo.product.WooAttribute;
import com.goofinity.pgc_service.dto.woo.product.WooCategory;
import com.goofinity.pgc_service.dto.woo.product.WooImage;
import com.goofinity.pgc_service.dto.woo.product.WooProduct;
import com.goofinity.pgc_service.dto.woo.variant.WooVariant;
import com.goofinity.pgc_service.dto.woo.variant.WooVariantBatch;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static com.goofinity.pgc_service.util.LogUtil.getObjectMapper;

@Service
public class WooService {
    private static final Logger log = LoggerFactory.getLogger(WooService.class);
    private final ObjectMapper objectMapper = getObjectMapper();
    private final int MAX_SIZE_BODY = 4000000;

    public List<WooOrder> getPaidOrdersFrom(String url, String key, String secret, Instant startDate, int page) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        String response = getRequest(url + "/wp-json/wc/v3/orders?per_page=100&status=processing&after=" + startDate + "&page=" + page,
            key, secret);
        return objectMapper.readValue(response, new TypeReference<List<WooOrder>>() {
        });
    }

    public List<WooProduct> getProducts(String url, String key, String secret, int page, String category, String keyword) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        String response = getRequest(url + "/wp-json/wc/v3/products" +
            "?page=" + page + "&per_page=100&category=" + category + "&search=" + keyword, key, secret);

        return objectMapper.readValue(response, new TypeReference<List<WooProduct>>() {
        });
    }

    public void addNote(String url, String key, String secret, String orderId, String note) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        postRequest(url + "/wp-json/wc/v3/orders/" + orderId + "/notes", key, secret,
            "{\"note\": \"" + note + "\", \"customer_note\": true}",
            Connection.Method.POST);
    }

    public void createProduct(Product product,
                              String url,
                              String key,
                              String secret) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        WooProduct wooProduct = WooProduct.builder()
            .name(product.getTitle())
            .type("variable")
            .description(product.getDescription())
            .images(product.getImages().stream()
                .map(productImage -> WooImage.builder()
                    .id(NumberUtils.toLong(productImage.getImage().getThumbUrl() + "", 0))
                    .src(productImage.getImage().getThumbUrl())
                    .alt(productImage.getImage().getId())
                    .build())
                .collect(Collectors.toList()))
            .categories(product.getCategories() != null
                ? product.getCategories().stream()
                .map(categoryId -> WooCategory.builder()
                    .id(categoryId)
                    .build()).collect(Collectors.toList())
                : new ArrayList<>())
            .attributes(new ArrayList<>())
            .build();
        mapAttribute(wooProduct, product);

        String response = postRequest(url + "/wp-json/wc/v3/products", key,
            secret, objectMapper.writeValueAsString(wooProduct), Connection.Method.POST);
        WooProduct createdWooProduct = objectMapper.readValue(response, WooProduct.class);
        updateVariant(url, key, secret, createdWooProduct.getId(), product, createdWooProduct, null);

        product.setUrl(createdWooProduct.getPermalink());
        product.setProductId(createdWooProduct.getId());
    }

    public void updateVariant(String url, String key, String secret, long productId, Product product, WooProduct wooProduct, List<Long> deleteVariantIds) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        List<WooVariant> variants = new ArrayList<>();
        for (ProductTypeGroup ptg : product.getProductTypes()) {
            for (ProductVariantDetail variantDetail : ptg.getVariantDetails()) {
                if (variantDetail.isEnable()) {
                    WooVariant wooVariant = WooVariant.builder()
                        .sku(variantDetail.getSku())
                        .attributes(new ArrayList<>())
                        .build();
                    if (variantDetail.getSalePrice() > 0 && variantDetail.getRegularPrice() > variantDetail.getSalePrice()) {
                        wooVariant.setRegularPrice(variantDetail.getRegularPrice());
                        wooVariant.setSalePrice(variantDetail.getSalePrice());
                    } else if (variantDetail.getRegularPrice() <= variantDetail.getSalePrice()) {
                        wooVariant.setRegularPrice(variantDetail.getSalePrice());
                    }

                    wooProduct.getImages()
                        .stream()
                        .filter(wooImage -> wooImage.getAlt().equals(variantDetail.getImageId()))
                        .findFirst()
                        .ifPresent(wooImage -> wooVariant.setImage(WooImage.builder()
                            .id(wooImage.getId())
                            .build()));

                    if (!StringUtils.isEmpty(variantDetail.getOption1Type())) {
                        wooVariant.getAttributes().add(WooAttribute.builder()
                            .name(variantDetail.getOption1Type())
                            .option(variantDetail.getOption1())
                            .build());
                    }

                    if (!StringUtils.isEmpty(variantDetail.getOption2Type())) {
                        wooVariant.getAttributes().add(WooAttribute.builder()
                            .name(variantDetail.getOption2Type())
                            .option(variantDetail.getOption2())
                            .build());
                    }

                    if (product.getProductTypes().size() > 1) {
                        wooVariant.getAttributes().add(WooAttribute.builder()
                            .name("Product")
                            .option(ptg.getProductType().getTitle())
                            .build());
                    }

                    variants.add(wooVariant);
                }
            }
        }
        postRequest(url + "/wp-json/wc/v3/products/" + productId + "/variations/batch", key, secret,
            objectMapper.writeValueAsString(WooVariantBatch.builder()
                .delete((List) deleteVariantIds)
                .build()), Connection.Method.POST);
        String response = postRequest(url + "/wp-json/wc/v3/products/" + productId + "/variations/batch", key, secret,
            objectMapper.writeValueAsString(WooVariantBatch.builder()
                .create(variants)
                .build()), Connection.Method.POST);

        WooVariantBatch wooVariantBatch = objectMapper.readValue(response, WooVariantBatch.class);
        Map<String, Long> ids = new HashMap<>();
        wooVariantBatch.getCreate().forEach(wooVariant -> {
            ids.put(wooVariant.getSku(), wooVariant.getId());
        });

        for (ProductTypeGroup ptg : product.getProductTypes()) {
            for (ProductVariantDetail variantDetail : ptg.getVariantDetails()) {
                if (ids.get(variantDetail.getSku()) != null) {
                    variantDetail.setId(ids.get(variantDetail.getSku()));
                }
            }
        }
    }

    public void updateAttributes(String url, String key, String secret, Product product) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        WooProduct wooProduct = WooProduct.builder()
            .type("variable")
            .attributes(new ArrayList<>())
            .images(product.getImages()
                .stream()
                .map(productImage -> WooImage.builder()
                    .id(productImage.getImageId() == null ? 0 : productImage.getImageId())
                    .src(productImage.getImage().getImageUrl())
                    .alt(productImage.getImage().getId())
                    .build())
                .collect(Collectors.toList()))
            .build();

        mapAttribute(wooProduct, product);
        WooProduct wooProductUpdated = requestUpdateProduct(url, key, secret, product.getProductId(), wooProduct);
        product.getImages().forEach(productImage -> {
            if (productImage.getImageId() == null) {
                productImage.setImageId(wooProductUpdated.getImages()
                    .stream()
                    .filter(wooImage -> wooImage.getAlt().equalsIgnoreCase(productImage.getImage().getId()))
                    .findFirst()
                    .orElse(WooImage.builder().build())
                    .getId()
                );
            }
        });
    }

    private Map<String, Set<String>> mapVariant(Product product) {
        Map<String, Set<String>> variants = new HashMap<>();
        for (ProductTypeGroup ptg : product.getProductTypes()) {
            for (ProductVariantDetail variantDetail : ptg.getVariantDetails()) {
                if (!StringUtils.isEmpty(variantDetail.getOption1Type())) {
                    variants.computeIfAbsent(variantDetail.getOption1Type(), k -> new LinkedHashSet<>());
                    variants.get(variantDetail.getOption1Type()).add(variantDetail.getOption1());
                }

                if (!StringUtils.isEmpty(variantDetail.getOption2Type())) {
                    variants.computeIfAbsent(variantDetail.getOption2Type(), k -> new LinkedHashSet<>());
                    variants.get(variantDetail.getOption2Type()).add(variantDetail.getOption2());
                }
            }
        }

        return variants;
    }

    private void mapAttribute(WooProduct wooProduct, Product product) {
        if (product.getProductTypes().size() > 1) {
            wooProduct.setAttributes(new ArrayList<>(Collections.singletonList(WooAttribute.builder()
                .name("Product")
                .visible(true)
                .variation(true)
                .options(product.getProductTypes().stream()
                    .map(ptg -> ptg.getProductType().getTitle())
                    .collect(Collectors.toList()))
                .build())));
        }

        for (Map.Entry<String, Set<String>> entry : mapVariant(product).entrySet()) {
            wooProduct.getAttributes().add(WooAttribute.builder()
                .name(entry.getKey())
                .position(0)
                .visible(true)
                .variation(true)
                .options(new ArrayList<>(entry.getValue()))
                .build());
        }
    }

    public String createWebhook(String name, String topic, String secret, String webhookUrl, String url, String consumerKey, String consumerSecret) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        String data = "{\n" +
            "  \"name\": \"" + name + "\",\n" +
            "  \"topic\": \"" + topic + "\",\n" +
            "  \"secret\": \"" + secret + "\",\n" +
            "  \"delivery_url\": \"" + webhookUrl + "\"\n" +
            "}";
        return postRequest(url + "/wp-json/wc/v3/webhooks", consumerKey, consumerSecret, data, Connection.Method.POST);
    }

    public List<WooCategoryDTO> getCollections(String url, String consumerKey, String consumerSecret) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        String response = getRequest(url + "/wp-json/wc/v3/products/categories", consumerKey, consumerSecret);
        return objectMapper.readValue(response, new TypeReference<List<WooCategoryDTO>>() {
        });
    }

    public WooCategoryDTO createCollection(CollectionDTO collectionDTO, String url, String consumerKey, String consumerSecret) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
        String response = postRequest(url + "/wp-json/wc/v3/products/categories", consumerKey, consumerSecret,
            objectMapper.writeValueAsString(collectionDTO), Connection.Method.POST);
        return objectMapper.readValue(response, WooCategoryDTO.class);
    }

    public static String generateRequest(String url,
                                         String consumerKey,
                                         String consumerSecret,
                                         String method) throws NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException, MalformedURLException {
        if ("http".equals(new URL(url).getProtocol())) {
            long time = System.currentTimeMillis() / 1000;
            String nounce = DigestUtils.sha1Hex(time + "");

            TreeMap<String, String> sorted = new TreeMap<>();
            sorted.put("oauth_consumer_key", consumerKey);
            sorted.put("oauth_timestamp", (time) + "");
            sorted.put("oauth_nonce", nounce);
            sorted.put("oauth_signature_method", "HMAC-SHA256");

            sorted.replaceAll((k, v) -> encode(v));

            List<String> queryParams = new ArrayList<>();
            for (Map.Entry<String, String> entry : sorted.entrySet()) {
                queryParams.add(encode(entry.getKey() + "=" + entry.getValue()));
            }

            String strToSign = method + "&" + URLEncoder.encode(url) + "&" + String.join("%26", queryParams);

            return url + (url.contains("?") ? "&" : "?") +
                "oauth_consumer_key=" + consumerKey +
                "&oauth_nonce=" + nounce +
                "&oauth_signature=" + hmac256(strToSign, consumerSecret + "&") +
                "&oauth_signature_method=HMAC-SHA256" +
                "&oauth_timestamp=" + time;
        }

        return url + (url.contains("?") ? "&" : "?") + "consumer_key=" + consumerKey + "&consumer_secret=" + consumerSecret;
    }

    private static String hmac256(String text, String secret)
        throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        sha256Hmac.init(new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256"));

        return Base64.getEncoder().encodeToString(sha256Hmac.doFinal(text.getBytes()));
    }

    private static String encode(String txt) {
        txt = txt.replace("+", "%7E");
        txt = txt.replace(" ", "~");

        return URLEncoder.encode(txt);
    }

    private WooProduct requestUpdateProduct(String url, String key, String secret, long productId, WooProduct wooProduct) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        String response = postRequest(url + "/wp-json/wc/v3/products/" + productId, key,
            secret, objectMapper.writeValueAsString(wooProduct), Connection.Method.PUT);
        return objectMapper.readValue(response, WooProduct.class);
    }

    private String postRequest(String url, String key, String secret, String data, Connection.Method method) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        Connection.Response response = Jsoup.connect(generateRequest(url, key, secret, method.name()))
            .timeout(120000)
            .method(method)
            .requestBody(data)
            .header("Content-Type", "application/json")
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .maxBodySize(MAX_SIZE_BODY)
            .followRedirects(false)
            .execute();

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            log.error("Error when request woo: {}", response.body());
            throw new InvalidDataException("woo_request");
        }

        return response.body();
    }

    private String getRequest(String url, String key, String secret) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        Connection.Response response = Jsoup.connect(generateRequest(url, key, secret, "GET"))
            .timeout(120000)
            .method(Connection.Method.GET)
            .header("Content-Type", "application/json")
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .maxBodySize(MAX_SIZE_BODY)
            .followRedirects(false)
            .execute();

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            log.error("Error when request woo: {}", response.body());
            throw new InvalidDataException("woo_request");
        }

        return response.body();
    }
}
