import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// --- IMPORT NAVIGATOR ---
import AppNavigator from './src/navigation/AppNavigator';

// --- IMPORT CONTEXT PROVIDERS ---
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { FavoriteProvider } from './src/context/FavoriteContext';
import { ReviewProvider } from './src/context/ReviewContext'; // Đảm bảo Sen đã tạo file này

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      
      {/* 1. AuthProvider: Quản lý đăng nhập (Bọc ngoài cùng) */}
      <AuthProvider>
        
        {/* 2. FavoriteProvider: Quản lý danh sách yêu thích */}
        <FavoriteProvider>
          
          {/* 3. ReviewProvider: Quản lý đánh giá sản phẩm (Vừa thêm vào) */}
          <ReviewProvider>
            
            {/* 4. CartProvider: Quản lý giỏ hàng */}
            <CartProvider>
              
              {/* 5. AppNavigator: Chứa tất cả các màn hình (OrderDetailsScreen, Home, v.v.) */}
              <AppNavigator />
              
            </CartProvider>
            
          </ReviewProvider>
          
        </FavoriteProvider>
        
      </AuthProvider>
      
    </SafeAreaProvider>
  );
}