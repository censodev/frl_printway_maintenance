package com.goofinity.pgc_gateway.security.error;

public class InvalidDataException
    extends ValidatorException
{
    public InvalidDataException(final String fieldName)
    {
        super("invalidData", fieldName);
    }
}
