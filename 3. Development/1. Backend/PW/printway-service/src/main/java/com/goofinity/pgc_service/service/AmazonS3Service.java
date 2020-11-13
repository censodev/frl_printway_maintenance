package com.goofinity.pgc_service.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.dto.ImageUploadDTO;
import com.goofinity.pgc_service.security.error.InvalidDataException;
import org.apache.commons.io.FilenameUtils;
import org.hashids.Hashids;
import org.im4java.core.ConvertCmd;
import org.im4java.core.IM4JavaException;
import org.im4java.core.IMOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.util.Date;

/**
 * Service for managing audit events.
 * <p>
 * This is the default implementation to support SpringBoot Actuator {@code AuditEventRepository}.
 */
@Service
public class AmazonS3Service {
    private final Logger log = LoggerFactory.getLogger(AmazonS3Service.class);
    private static final int BUFFER_SIZE = 4096;

    @Value("${cloud.aws.access-key}")
    private String accessKey;

    @Value("${cloud.aws.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    @Value("${cloud.aws.thumb-bucket-name}")
    private String thumbBucketName;

    @Value("${cloud.aws.endpoint-url}")
    private String endpointUrl;

    @Value("${cloud.aws.region}")
    private String region;

    private AmazonS3 s3client;

    @PostConstruct
    private void initializeAmazon() {
        final BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretKey);
        this.s3client = AmazonS3ClientBuilder
            .standard()
            .withRegion(Regions.fromName(region))
            .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
            .build();
    }

    public ImageUploadDTO uploadFile(final MultipartFile multipartFile) {
        log.info("File upload in progress.");
        ImageUploadDTO imageUploadDTO = new ImageUploadDTO();
        imageUploadDTO.setSize(multipartFile.getSize());
        File file = convertMultiPartFileToFile(multipartFile);
        try {
            String fileName = generateFileName(multipartFile.getOriginalFilename());
            imageUploadDTO.setFileName(fileName);

            uploadFileToS3Bucket(bucketName, fileName, file);
            imageUploadDTO.setImageUrl(endpointUrl + "/" + bucketName + "/" + fileName);
            imageUploadDTO.setThumbUrl(endpointUrl + "/" + thumbBucketName + "/" + fileName);
        } catch (final Exception ex) {
            log.error("Error = {} while uploading file.", ex.getMessage());
            throw new InvalidDataException("image");
        } finally {
            file.delete();
        }

        return imageUploadDTO;
    }

    private void resizeImage(String imagePath, String outputImage) throws InterruptedException, IOException, IM4JavaException {
        ConvertCmd cmd = new ConvertCmd();

        IMOperation op = new IMOperation();
        op.addImage(imagePath);
        op.resize(300, 300);
        op.addImage(outputImage);

        cmd.run(op);
    }

    public ImageUploadDTO uploadFromUrl(final String imgUrl) {
        log.info("File upload in progress.");
        ImageUploadDTO imageUploadDTO = new ImageUploadDTO();

        File file = null;
        try {
            URL url = new URL(imgUrl);
            file = new File(Instant.now().toEpochMilli() + "-" + FilenameUtils.getName(url.getPath()));
            downloadFile(imgUrl, file.getPath());
            String fileName = generateFileName(file.getName());

            uploadFileToS3Bucket(bucketName, fileName, file);
            imageUploadDTO.setFileName(fileName);
            imageUploadDTO.setImageUrl(endpointUrl + "/" + bucketName + "/" + fileName);
            imageUploadDTO.setThumbUrl(endpointUrl + "/" + thumbBucketName + "/" + fileName);
        } catch (final Exception ex) {
            log.error("Error = {} while uploading file.", ex.getMessage());
            throw new InvalidDataException("image");
        } finally {
            if (file != null && file.exists()) {
                file.delete();
            }
        }

        return imageUploadDTO;
    }

    public void downloadFile(String fileURL, String saveDir)
        throws IOException {
        URL url = new URL(fileURL);
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36");
        int responseCode = httpConn.getResponseCode();

        // always check HTTP response code first
        if (responseCode == HttpURLConnection.HTTP_OK) {
            // opens input stream from the HTTP connection
            InputStream inputStream = httpConn.getInputStream();
            String saveFilePath = saveDir;

            // opens an output stream to save into file
            FileOutputStream outputStream = new FileOutputStream(saveFilePath);

            int bytesRead = -1;
            byte[] buffer = new byte[BUFFER_SIZE];
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            outputStream.close();
            inputStream.close();
        }
        httpConn.disconnect();
    }

    public String deleteFileFromS3Bucket(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        s3client.deleteObject(new DeleteObjectRequest(bucketName + "/", fileName));
        return "Successfully deleted";
    }

    public String uploadExportOrderToS3Bucket(final String filename, final InputStream input, ObjectMetadata metadata) {
        try {
            final PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, filename, input, metadata);
            s3client.putObject(putObjectRequest);

            return endpointUrl + "/" + bucketName + "/" + filename;
        } catch (final AmazonClientException ex) {
            log.error("Error = {} while uploading file.", ex.getMessage());
            throw new InvalidDataException("file");
        }
    }

    private String generateFileName(String originalFileName) {
        String extension = FilenameUtils.getExtension(originalFileName);
        extension = StringUtils.isEmpty(extension) ? "" : "." + extension;
        return new Date().getTime() + "-" + new Hashids(User.SALT, 10).encode(System.currentTimeMillis()) + extension;
    }

    private File convertMultiPartFileToFile(final MultipartFile multipartFile) {
        final File file = new File(Instant.now().toEpochMilli() + "-" + multipartFile.getOriginalFilename());
        try (final FileOutputStream outputStream = new FileOutputStream(file)) {
            outputStream.write(multipartFile.getBytes());
            outputStream.flush();
        } catch (final IOException ex) {
            log.error("Error converting the multi-part file to file = {}", ex.getMessage());
        }
        return file;
    }


    private void uploadFileToS3Bucket(final String bucketName, final String fileName, final File file) {
        final PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file);
        s3client.putObject(putObjectRequest);
    }
}
