package com.goofinity.pgc_gateway.client;

import com.goofinity.pgc_gateway.dto.UserSyncDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "pgc-service")
public interface PgcServiceClient {
    @PostMapping(value = "/api/user/sync")
    void syncUserInfoToService(@RequestBody UserSyncDTO dto,
                               @RequestHeader("security-key") String securityKey);

    @PostMapping(value = "/api/user/sync/lock")
    void syncLockUserToService(@RequestBody UserSyncDTO dto,
                               @RequestHeader("security-key") String securityKey);
}
