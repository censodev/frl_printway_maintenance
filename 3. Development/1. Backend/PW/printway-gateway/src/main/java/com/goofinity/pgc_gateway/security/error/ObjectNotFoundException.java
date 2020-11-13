package com.goofinity.pgc_gateway.security.error;

public class ObjectNotFoundException
    extends ValidatorException
{
    public ObjectNotFoundException(final String fieldName)
    {
        super("objectNotFound", fieldName);
    }
}
