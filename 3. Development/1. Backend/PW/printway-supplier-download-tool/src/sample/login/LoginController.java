package sample.login;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class LoginController {
    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtPassword;

    @FXML
    private ImageView imageView;

    public void initialize() {
        Image img = new Image("file:img/logo.png");
        imageView.setImage(img);
    }

    @FXML
    protected void handleButtonLogin(ActionEvent event) {
        try {
            login(event);
        } catch (IOException e) {
            e.printStackTrace();
            Alert alert = new Alert(Alert.AlertType.ERROR);

            alert.setTitle("Login error");
            alert.setContentText("Invalid email or password.");

            alert.showAndWait();
        }
    }

    private void login(ActionEvent event) throws IOException {
        String email = txtEmail.getText();
        String password = txtPassword.getText();

        final String POST_PARAMS = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";
        URL obj = new URL("https://app.printway.io/api/authenticate");
        HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
        postConnection.setRequestMethod("POST");
        postConnection.setRequestProperty("Content-Type", "application/json");
        postConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36");
        postConnection.setDoOutput(true);

        OutputStream os = postConnection.getOutputStream();
        os.write(POST_PARAMS.getBytes());
        os.flush();
        os.close();

        if (postConnection.getResponseCode() == 200) {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("/sample/download/download.fxml"));
                Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
                Scene scene = new Scene(loader.load());
                stage.setWidth(400);
                stage.setHeight(520);
                stage.setScene(scene);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            throw new IOException();
        }
    }
}
