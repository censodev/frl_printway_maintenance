package com.goofinity.pgc_service.repository;

import com.goofinity.pgc_service.domain.DailyStatistic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface DailyStatisticRepository extends MongoRepository<DailyStatistic, String> {
    Optional<DailyStatistic> findByUserAndStatisticDate(String user, Instant statisticDate);

    Optional<DailyStatistic> findBySiteAndStatisticDate(String site, Instant statisticDate);

    @Query("{$and: [\n" +
        "        ?#{[0] == null ? {$where: 'true'} : {'user': [0]}},\n" +
        "        ?#{[1] == null ? {$where: 'true'} : {'site': [1]}},\n" +
        "        {'statisticDate': {$gte: ?2}},\n" +
        "        {'statisticDate': {$lte: ?3}}\n" +
        "    ]}")
    List<DailyStatistic> findStatistic(String user,
                                       String site,
                                       Instant startDate,
                                       Instant endDate);
}
