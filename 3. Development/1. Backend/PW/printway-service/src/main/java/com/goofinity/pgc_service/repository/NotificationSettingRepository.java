package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.NotificationSetting;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationSettingRepository extends MongoRepository<NotificationSetting, String> {
}
