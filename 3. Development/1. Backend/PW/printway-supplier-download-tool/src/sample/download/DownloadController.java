package sample.download;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicInteger;

public class DownloadController {
    private static final int BUFFER_SIZE = 4096;
    final FileChooser fileChooser = new FileChooser();
    private boolean isDownload = false;

    @FXML
    public Label txtProgress;

    @FXML
    public TextField txtFileDir;

    @FXML
    private ImageView imageView;

    public void initialize() {
        Image img = new Image("file:img/logo.png");
        imageView.setImage(img);
    }

    @FXML
    public void handleSubmitButtonFile(ActionEvent actionEvent) {
        Stage stage = (Stage) ((Node) actionEvent.getSource()).getScene().getWindow();
        File file = fileChooser.showOpenDialog(stage);
        if (file != null) {
            txtFileDir.setText(file.getAbsolutePath());
        }
    }

    @FXML
    public void handleDownloadImage(ActionEvent actionEvent) {
        if (!isDownload) {
            isDownload = true;
            new Thread(() -> {
                try {
                    Platform.runLater(() -> txtProgress.setText("Downloading..."));
                    File fileInput = new File(txtFileDir.getText());
                    FileInputStream fis = new FileInputStream(fileInput);
                    XSSFWorkbook wb = new XSSFWorkbook(fis);
                    XSSFSheet sheet = wb.getSheetAt(0);
                    int total = sheet.getPhysicalNumberOfRows() - 1;
                    AtomicInteger i = new AtomicInteger(1);
                    int index = fileInput.getName().lastIndexOf(".");
                    String packageName = fileInput.getName().substring(0, index == -1 ? fileInput.getName().length() : index);
                    Files.createDirectories(Paths.get(packageName));
                    boolean isHeader = true;
                    for (Row row : sheet) {
                        if (!isHeader) {
                            String designSku = row.getCell(26).getStringCellValue();
                            if (!isEmpty(designSku)) {
                                //Download print file
                                String orderName = row.getCell(0).getStringCellValue().replaceAll("[\uFEFF-\uFFFF]", "").replaceAll("#", "");
                                String[] printFileUrls = row.getCell(27).getStringCellValue().replaceAll("[\uFEFF-\uFFFF]", "").split("\\r?\\n");

                                boolean isCustomDesign = isCustomDesign(row.getCell(27).getStringCellValue());
                                boolean isFirst = true;
                                String packageDesignName = packageName + "/" + designSku;
                                if (isCustomDesign) {
                                    for (int c = 1; c < 100000000; c++) {
                                        if (!new File(packageDesignName + "-custom-" + orderName + "-" + c).exists()) {
                                            packageDesignName += "-custom-" + orderName + "-" + c;
                                            isFirst = c == 1;
                                            break;
                                        }
                                    }
                                }

                                File file = new File(packageDesignName);
                                if (!file.exists()) {
                                    file.mkdir();
                                }

                                for (int j = 0; j < printFileUrls.length; j++) {
                                    String[] designImgDatas = printFileUrls[j].split("\\|");
                                    String printFileName = normalizeSpace(designImgDatas[0].trim()).toLowerCase().replace(" ", "-");
                                    String extension = designImgDatas[2].lastIndexOf(".") > 0 ? designImgDatas[2].substring(designImgDatas[2].lastIndexOf(".")) : null;
                                    extension = (extension == null ? ".jpg" : extension);
                                    String name = packageDesignName + "/" + designSku;
                                    boolean imageCustom = Boolean.parseBoolean(designImgDatas[1]);
                                    if (imageCustom) {
                                        for (int c = 1; c < 100000000; c++) {
                                            if (!new File(name + "-" + orderName + extension).exists()) {
                                                name += orderName + "-" + c + "-" + printFileName;
                                                break;
                                            }
                                        }
                                    } else {
                                        name += "-" + printFileName;
                                    }

                                    name += extension;
                                    if (!new File(name).exists()) {
                                        if (!(isCustomDesign && !imageCustom && !isFirst)) {
                                            downloadImage(designImgDatas[2], name);
                                        }
                                    }
                                }

                                if (isFirst) {
                                    //Download mockup file
                                    String[] mockupUrls = row.getCell(28).getStringCellValue().replaceAll("[\uFEFF-\uFFFF]", "").split("\r\n");
                                    for (int j = 0; j < mockupUrls.length; j++) {
                                        String sku = row.getCell(3).getStringCellValue();
                                        String extension = mockupUrls[j].lastIndexOf(".") > 0 ? mockupUrls[j].substring(mockupUrls[j].lastIndexOf(".")) : null;
                                        extension = (extension == null ? ".jpg" : extension);
                                        String name = packageDesignName + "/" + designSku + "-" + sku + "-" + (j + 1) + extension;

                                        if (!new File(name).exists()) {
                                            downloadImage(mockupUrls[j], name);
                                        }
                                    }
                                }

                                int percent = i.get() / total * 100;
                                Platform.runLater(() -> txtProgress.setText("Progress: " + (i.getAndIncrement()) + "/" + total + " (" + percent + "%)"));
                            }
                        }
                        isHeader = false;
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                Platform.runLater(() -> txtProgress.setText(txtProgress.getText() + " - Done"));
                isDownload = false;
            }).start();
        }
    }

    private void downloadImage(String url, String name) {
        try {
            downloadFile(url, name);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private static boolean isEmpty(CharSequence cs) {
        return cs == null || cs.length() == 0;
    }

    private static String normalizeSpace(String str) {
        if (isEmpty(str)) {
            return str;
        } else {
            int size = str.length();
            char[] newChars = new char[size];
            int count = 0;
            int whitespacesCount = 0;
            boolean startWhitespaces = true;

            for (int i = 0; i < size; ++i) {
                char actualChar = str.charAt(i);
                boolean isWhitespace = Character.isWhitespace(actualChar);
                if (isWhitespace) {
                    if (whitespacesCount == 0 && !startWhitespaces) {
                        newChars[count++] = " ".charAt(0);
                    }

                    ++whitespacesCount;
                } else {
                    startWhitespaces = false;
                    newChars[count++] = actualChar == 160 ? 32 : actualChar;
                    whitespacesCount = 0;
                }
            }

            if (startWhitespaces) {
                return "";
            } else {
                return (new String(newChars, 0, count - (whitespacesCount > 0 ? 1 : 0))).trim();
            }
        }
    }

    private boolean isCustomDesign(String data) {
        String[] rowDatas = data.replaceAll("[\uFEFF-\uFFFF]", "").split("\\r?\\n");
        for (String rowData : rowDatas) {
            String[] childs = rowData.split("\\|");
            if (Boolean.parseBoolean(childs[1])) {
                return true;
            }
        }

        return false;
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
}
