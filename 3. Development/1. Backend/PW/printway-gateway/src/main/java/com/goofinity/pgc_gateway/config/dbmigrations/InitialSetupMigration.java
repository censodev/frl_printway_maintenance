package com.goofinity.pgc_gateway.config.dbmigrations;

import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import com.goofinity.pgc_gateway.domain.User;
import com.goofinity.pgc_gateway.enums.RoleEnum;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;

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
        adminUser.setPassword("$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC");
        adminUser.setFirstName("admin");
        adminUser.setLastName("Administrator");
        adminUser.setActivated(true);
        adminUser.setCreatedBy("system");
        adminUser.setCreatedDate(Instant.now());
        adminUser.setRoles(new HashSet<>(Collections.singletonList(RoleEnum.ROLE_ADMIN.name())));
        mongoTemplate.save(adminUser);
    }
}
