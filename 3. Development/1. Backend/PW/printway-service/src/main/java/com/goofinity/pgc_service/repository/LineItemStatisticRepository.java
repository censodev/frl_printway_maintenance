package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.LineItemStatistic;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LineItemStatisticRepository extends MongoRepository<LineItemStatistic, String> {
}
