package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.Category;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.CategoryRepository;
import com.goofinity.pgc_service.security.error.DuplicateDataException;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
public class CategoryResource {
    private static final Logger log = LoggerFactory.getLogger(CategoryResource.class);
    private final CategoryRepository categoryRepository;

    public CategoryResource(final CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        log.debug("Get category by id: {}", id);
        return new ResponseEntity<>(categoryRepository.findById(id)
            .orElseThrow(() -> new ObjectNotFoundException("category")), HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<List<Category>> getCategories() {
        log.debug("Get categories");
        return new ResponseEntity<>(categoryRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\")")
    public ResponseEntity<Page<Category>> getCategoriesByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                    @RequestParam Map<String, String> params) {
        log.debug("Get categories with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(categoryRepository.findAllByNameIgnoreCaseContaining(keyword, pageable), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        log.debug("Create category: {}", category);

        if (categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()) {
            throw new DuplicateDataException("name");
        }

        categoryRepository.save(category);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category) {
        log.debug("Update category: {}", category);

        Category existCategory = categoryRepository.findById(category.getId())
            .orElseThrow(() -> new ObjectNotFoundException("category"));

        if (categoryRepository.findByIdNotAndNameIgnoreCase(category.getId(), category.getName()).isPresent()) {
            throw new DuplicateDataException("name");
        }

        existCategory.setName(category.getName());
        existCategory.setDescription(category.getDescription());
        existCategory.setPriority(category.getPriority());
        categoryRepository.save(existCategory);
        return new ResponseEntity<>(existCategory, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public void deleteCategoryById(@PathVariable String id) {
        log.debug("Delete category by id: {}", id);

        Category category = categoryRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("category"));
        if (category.getTotalProductType() > 0) {
            throw new InvalidDataException("product_type_constrain");
        }

        categoryRepository.delete(category);
    }
}
