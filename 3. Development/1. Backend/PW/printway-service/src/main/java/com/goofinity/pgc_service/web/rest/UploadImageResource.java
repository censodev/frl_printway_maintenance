package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.ImageUpload;
import com.goofinity.pgc_service.dto.ImageUploadDTO;
import com.goofinity.pgc_service.enums.ImageTypeEnum;
import com.goofinity.pgc_service.repository.ImageUploadRepository;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import com.goofinity.pgc_service.service.AmazonS3Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
public class UploadImageResource {
    private static final Logger log = LoggerFactory.getLogger(UploadImageResource.class);
    private final AmazonS3Service amazonS3Service;
    private final ImageUploadRepository imageUploadRepository;

    public UploadImageResource(final AmazonS3Service amazonS3Service,
                               final ImageUploadRepository imageUploadRepository) {
        this.amazonS3Service = amazonS3Service;
        this.imageUploadRepository = imageUploadRepository;
    }

    @PostMapping("/image")
    public ResponseEntity<ImageUploadDTO> uploadFile(@RequestPart(value = "file") final MultipartFile multipartFile,
                                                     @RequestParam(required = false) String productId,
                                                     @RequestParam(required = false) String designSku) {
        log.debug("Upload image: {}", multipartFile.getOriginalFilename());

//        amazonS3Service.checkSizeBeforeUpload(multipartFile, productId, designSku);

        ImageUploadDTO dto = amazonS3Service.uploadFile(multipartFile);
        ImageUpload imageUpload = imageUploadRepository.save(ImageUpload.builder()
            .fileName(multipartFile.getOriginalFilename())
            .imageUrl(dto.getImageUrl())
            .thumbUrl(dto.getThumbUrl())
            .build());
        dto.setImageUrl(null);
        dto.setThumbUrl(null);
        dto.setId(imageUpload.getId());
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/image-source/{id}/{type}")
    public void getImage(@PathVariable String id,
                         @PathVariable String type,
                         HttpServletResponse response) throws IOException {
        log.debug("Get image: {}", id);
        ImageUpload imageUpload = imageUploadRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("image"));
        switch (ImageTypeEnum.getByName(type.toUpperCase()).orElseThrow(() -> new ObjectNotFoundException("image_type"))) {
            case THUMB:
                response.sendRedirect(imageUpload.getThumbUrl());
                break;
            case ORIGINAL:
                response.sendRedirect(imageUpload.getImageUrl());
                break;
        }
    }
}
