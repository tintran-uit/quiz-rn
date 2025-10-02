#!/bin/bash

echo "�� Quiz App - Expo Runner"
echo "========================="
echo ""

show_menu() {
    echo "Chọn cách chạy ứng dụng:"
    echo "1. 📱 Expo Go (QR Code) - Dễ nhất"
    echo "2. 🤖 Android Emulator"
    echo "3. 🍎 iOS Simulator"
    echo "4. 🌐 Web Browser"
    echo "5. ❌ Thoát"
    echo ""
    read -p "Nhập lựa chọn (1-5): " choice
}

while true; do
    show_menu
    
    case $choice in
        1)
            echo "📱 Khởi động Expo Go..."
            echo "1. Tải app 'Expo Go' từ App Store/Google Play"
            echo "2. Scan QR code hiện ra"
            npx expo start
            ;;
        2)
            echo "🤖 Chạy Android Emulator..."
            npx expo run:android
            ;;
        3)
            echo "🍎 Chạy iOS Simulator..."
            npx expo run:ios
            ;;
        4)
            echo "🌐 Chạy Web Browser..."
            npx expo start --web
            ;;
        5)
            echo "👋 Tạm biệt!"
            exit 0
            ;;
        *)
            echo "❌ Lựa chọn không hợp lệ"
            ;;
    esac
    
    echo ""
    read -p "Nhấn Enter để tiếp tục..."
    clear
done
