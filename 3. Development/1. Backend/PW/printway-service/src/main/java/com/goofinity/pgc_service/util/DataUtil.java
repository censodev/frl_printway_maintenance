package com.goofinity.pgc_service.util;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;

public class DataUtil {
    public static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-hhmm-ss").withZone(ZoneId.of("UTC"));
    public static final DateTimeFormatter formatterExport = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss").withZone(ZoneId.of("UTC"));

    public static Map<String, String> convertMapKeyIgnoreCase(Map<String, String> sourse) {
        Map<String, String> result = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (Map.Entry<String, String> entry : sourse.entrySet()) {
            result.put(entry.getKey(), entry.getValue());
        }

        return result;
    }
}
