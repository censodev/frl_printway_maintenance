package com.goofinity.pgc_service.util;

public class ParseUtil {
    public static double parseDouble(String num) {
        try {
            return Double.parseDouble(num);
        } catch (Exception ex) {
        }
        return 0;
    }

    public static int parseInt(String num) {
        try {
            return Integer.parseInt(num);
        } catch (Exception ex) {
        }
        return 0;
    }

    public static long parseLong(String num) {
        try {
            return Long.parseLong(num);
        } catch (Exception ex) {
        }
        return 0;
    }
}
