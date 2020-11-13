package com.goofinity.pgc_service.security.error;

public class DuplicateDataException
    extends ValidatorException
{
    public DuplicateDataException(final String fieldName)
    {
        super("duplicatedData", fieldName);
    }
}
