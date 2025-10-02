# Quiz App - React Native với Expo

## 🎯 Ứng dụng Quiz hoàn chỉnh với 3 màn hình:

1. **Màn hình đăng nhập** - Nhập tên người dùng
2. **Màn hình Quiz** - 15 câu hỏi với text và hình ảnh
3. **Màn hình Leaderboard** - Bảng xếp hạng

## 🚀 Cách chạy ứng dụng:

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Khởi động development server
```bash
npx expo start
```

### Bước 3: Chạy trên thiết bị
Có 3 cách:

#### A. Sử dụng Expo Go (Dễ nhất)
1. Tải app "Expo Go" từ App Store/Google Play
2. Scan QR code từ terminal
3. Ứng dụng sẽ mở ngay trên điện thoại

#### B. Sử dụng Android Emulator
```bash
npx expo run:android
```

#### C. Sử dụng iOS Simulator (chỉ macOS)
```bash
npx expo run:ios
```

## 🔧 Khắc phục sự cố:

### Nếu gặp lỗi dependencies:
```bash
rm -rf node_modules
npm in# Quiz App - # Nếu Metro cache bị lỗi:
```bash
npx expo start --clear
```

### Nếu không thể kết nối:
- Đ
1. **Màn háy tính và điện thoại cùng mạng WiFi
-2. **Màn hình  có
- Kiểm tra firewall

## 📱 Tính năng ứng dụng:

- ✅ Đăng nhập với validation
- ✅ 15 câu hỏi đa dạng (text + hình ảnh)
- ✅ Timer 30 giây mỗi câu
- ✅ Hiển thị điểm số realtime
- ✅ Bảng xếp hạng với emoji
- ✅ Lưu trữ dữ liệu local
- ✅ Responsive design

## 🎮 Hướng dẫn chơi:

1. Nhập tên (ít nhất 3 ký tự)
2. Làm quiz trong 30s/câu
3. Xem kết quả trên bảng xếp hạng
4. Chơi lại để cải thiện điểm số!

Enjoy! 🎉
