## Hướng dẫn chạy service:
### Các module;
pgc-admin (FE): Là trang admin của website
pgc-supplier (FE): Là trang supplier của website
pgc-seller (FE): Là trang seller của website
pgc-gateway (BE): Là service xử lí xác thực user
pgc-service (BE): Là service xử lí toàn bộ logic của website

### Cấu trúc thư mục trên sv:
~/pgc-admin: Chứa file build của trang admin và bash deploy
~/pgc-supplier: Chứa file build của trang supplier và bash deploy
~/pgc-seller: Chứa file build của trang seller và bash deploy
~/pgc-service: Chứa file chạy service, log và bash start/stop
~/pgc-gateway: Chứa file chạy gateway, log và bash start/stop

/var/www/html/admin: nơi để deploy trang admin
/var/www/html/seller: nơi để deploy trang seller
/var/www/html/supplier: nơi để deploy trang supplier

### Hướng dẫn deploy FE
Step 1: Upload file build.zip vào thư mục tương ứng trên server `pgc-admin`, `pgc-supplier`, `pgc-seller`
Step 2: Chạy `source deploy.sh`

### Hướng dẫn deploy BE
Step 1: Upload file `pgc-service-0.0.1-SNAPSHOT.war`, `pgc-gateway-0.0.1-SNAPSHOT.war` vào thư mục tương ứng trên server `pgc-service`, `pgc-gateway`
Step 2: Chạy `source stop.sh` để dừng service đang chạy
Step 3: Chạy `source start.sh` để chạy lại service

### Lưu ý
Khi build BE thì file build sẽ nằm ở `build/libs` trong phần source code
Khi khởi chạy lại `pgc-service`, cần chờ một lúc để service kết nối với consul (khoảng 1~2 phút)
