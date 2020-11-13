package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.News;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.enums.NewsTypeEnum;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.NewsRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.AmazonSESService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsResource {
    private static final Logger log = LoggerFactory.getLogger(NewsResource.class);
    private final int SHORT_DESCRIPTION_LENGTH = 150;
    private final int PAGE_SIZE = 200;
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final AmazonSESService amazonSESService;

    public NewsResource(final NewsRepository newsRepository,
                        final UserRepository userRepository,
                        final AmazonSESService amazonSESService) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
        this.amazonSESService = amazonSESService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable String id) {
        log.debug("Get news by id: {}", id);
        return new ResponseEntity<>(newsRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("news")), HttpStatus.OK);
    }

    @GetMapping("/top")
    public ResponseEntity<List<News>> getTopNews() {
        log.debug("Get top news");

        List<String> roles = SecurityUtils.getCurrentUserRoles();
        if (roles.isEmpty()) {
            throw new SecurityException();
        }

        return new ResponseEntity<>(newsRepository.findAllByRolesContainsAndTypeAndCreatedDateAfter(roles,
            NewsTypeEnum.NEWS.name(), Instant.now().minus(7, ChronoUnit.DAYS),
            PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdDate"))).getContent(), HttpStatus.OK);
    }

    @GetMapping("/urgent-note")
    public ResponseEntity<List<News>> getUrgentNote() {
        log.debug("Get urgent note");

        List<String> roles = SecurityUtils.getCurrentUserRoles();
        if (roles.isEmpty()) {
            throw new SecurityException();
        }

        return new ResponseEntity<>(newsRepository.findAllByRolesContainsAndTypeAndCreatedDateAfter(roles,
            NewsTypeEnum.URGENT_NOTE.name(), Instant.now().minus(7, ChronoUnit.DAYS)), HttpStatus.OK);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<News>> getNewsByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                          @RequestParam Map<String, String> params) {
        log.debug("Get news with pagination: {}", pageable);

        List<String> roles = SecurityUtils.getCurrentUserRoles();
        if (roles.isEmpty()) {
            throw new SecurityException();
        }

        Instant startDate = StringUtils.isEmpty(params.get("startDate"))
            ? Instant.ofEpochMilli(Long.MIN_VALUE)
            : Instant.parse(params.get("startDate"));
        Instant endDate = StringUtils.isEmpty(params.get("endDate"))
            ? Instant.ofEpochMilli(Long.MAX_VALUE)
            : Instant.parse(params.get("endDate"));
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(newsRepository.findAllByForUser(roles, keyword, startDate, endDate, pageable), HttpStatus.OK);
    }

    @GetMapping("/admin/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<List<News>> getNewsForAdmin() {
        log.debug("Get news");
        return new ResponseEntity<>(newsRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/admin/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Page<News>> getNewsByPaginationForAdmin(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                  @RequestParam Map<String, String> params) {
        log.debug("Get news with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(newsRepository.findAllByTitleIgnoreCaseContaining(keyword, pageable), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<News> createNews(@Valid @RequestBody News news) {
        log.debug("Create news: {}", news);

        NewsTypeEnum.getByName(news.getType()).orElseThrow(() -> new ObjectNotFoundException("news_type"));

        if (news.getRoles() == null || news.getRoles().isEmpty()) {
            throw new InvalidDataException("roles_empty");
        }
        news.getRoles().forEach(role -> {
            if (!RoleEnum.getByName(role).isPresent()) {
                throw new InvalidDataException("role");
            }
        });

        news.setShortDescription(news.getContent().substring(0, Math.min(news.getContent().length(), SHORT_DESCRIPTION_LENGTH)));
        newsRepository.save(news);

        if (news.isEmail() || news.isNotification()) {
            int page = 0;
            while (true) {
                List<User> users = userRepository.findAllByListRoles(news.getRoles(), PageRequest.of(page++, PAGE_SIZE));

                if (users.isEmpty()) {
                    break;
                }

                users.forEach(user -> {
                    if (news.isEmail()) {
                        //Send email noti
                        amazonSESService.sendEmailForNewsUpdated(user.getRoles().contains(RoleEnum.ROLE_ADMIN_CONSTANT), user, news);
                    }

                    if (news.isNotification()) {
                        //Send noti
                    }
                });
            }
        }

        return new ResponseEntity<>(news, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<News> updateNews(@Valid @RequestBody News news) {
        log.debug("Update news: {}", news);

        NewsTypeEnum.getByName(news.getType()).orElseThrow(() -> new ObjectNotFoundException("news_type"));

        if (news.getRoles() == null || news.getRoles().isEmpty()) {
            throw new InvalidDataException("roles_empty");
        }
        news.getRoles().forEach(role -> {
            if (!RoleEnum.getByName(role).isPresent()) {
                throw new InvalidDataException("role");
            }
        });

        News existNews = newsRepository.findById(news.getId())
            .orElseThrow(() -> new ObjectNotFoundException("news"));
        existNews.setTitle(news.getTitle());
        existNews.setType(news.getType());
        existNews.setContent(news.getContent());
        existNews.setShortDescription(existNews.getContent().substring(0, Math.min(existNews.getContent().length(), SHORT_DESCRIPTION_LENGTH)));
        existNews.setRoles(news.getRoles());
        newsRepository.save(existNews);
        return new ResponseEntity<>(existNews, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void deleteNewsById(@PathVariable String id) {
        log.debug("Delete news by id: {}", id);

        News news = newsRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("news"));
        newsRepository.delete(news);
    }
}
