package com.goofinity.pgc_service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "news")
@TypeAlias("news")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class News extends AbstractAuditingEntity {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotEmpty
    private String title;

    @NotEmpty
    private String content;

    private String shortDescription;

    private boolean notification;

    private boolean email;

    @NotEmpty
    private String type;

    @NotEmpty
    @Builder.Default
    private Set<String> roles = new HashSet<>();
}
