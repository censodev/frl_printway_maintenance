package com.goofinity.pgc_gateway.security.error;

public class SyncDataException extends ValidatorException {
    public SyncDataException(final String fieldName) {
        super("syncData", fieldName);
    }
}
