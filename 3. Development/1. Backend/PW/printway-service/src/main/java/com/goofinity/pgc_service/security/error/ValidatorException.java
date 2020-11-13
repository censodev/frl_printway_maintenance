package com.goofinity.pgc_service.security.error;

import lombok.Getter;

public class ValidatorException
    extends RuntimeException {
    @Getter
    private final String fieldName;

    public ValidatorException(final String message, final String fieldName) {
        super(message);
        this.fieldName = fieldName;
    }

    public ValidatorException(final String message, final Throwable cause, final String fieldName) {
        super(message, cause);
        this.fieldName = fieldName;
    }

    public ValidatorException(final Throwable cause, final String fieldName) {
        super(cause);
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}
