import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screen/Auth/LoginScreen';
import RegisterScreen from '../screen/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screen/Auth/ForgotPasswordScreen';

// Customer Screens
import MainTabNavigator from './MainTabNavigator';
import ProductDetailScreen from '../screen/Customer/ProductDetailScreen';
import CheckoutScreen from '../screen/Customer/CheckoutScreen';
import PaymentQRScreen from '../screen/Customer/PaymentQRScreen'; 
import OrderHistoryScreen from '../screen/Customer/OrderHistoryScreen';
import VoucherScreen from '../screen/Customer/VoucherScreen';
import ChatScreen from '../screen/Customer/ChatScreen';
import ReviewScreen from '../screen/Customer/StoreReviewScreen'; 
import OrderDetailScreen from '../screen/Customer/OrderHistoryScreen';
import FavoriteScreen from '../screen/Customer/FavoriteScreen';
import CompareScreen from '../screen/Customer/CompareScreen';

// 👇 1. THÊM IMPORT MÀN HÌNH VIP Ở ĐÂY
import VipRegisterScreen from '../screen/Customer/VipRegisterScreen';
import OrderDetailsScreen from '../screen/Customer/OrderDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {/* Giao diện chính */}
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            
            {/* Thanh toán & Voucher */}
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="PaymentQR" component={PaymentQRScreen} />
            <Stack.Screen name="Voucher" component={VoucherScreen} />

            {/* Đơn hàng & Đánh giá */}
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="StoreReviewScreen" component={ReviewScreen} />

            {/* Chat AI & Yêu thích */}
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Favorite" component={FavoriteScreen} />

            {/* 👇 2. ĐĂNG KÝ MÀN HÌNH VIP VÀO ĐÂY */}
            <Stack.Screen name="VipRegister" component={VipRegisterScreen} />
            {/* So sánh sản phẩm */}
            <Stack.Screen name="Compare" component={CompareScreen} />
            {/* Chi tiết đơn hàng */}
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;