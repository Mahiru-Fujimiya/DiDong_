import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

// Import các màn hình
import HomeScreen from '../screen/Customer/HomeScreen';
import FavoriteScreen from '../screen/Customer/FavoriteScreen';
import StoreReviewScreen from '../screen/Customer/StoreReviewScreen';
import CartScreen from '../screen/Customer/CartScreen';
import ProfileScreen from '../screen/Customer/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    const cartContext = useCart();
    const cart = cartContext ? cartContext.cart : [];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#FF9F1C', 
                tabBarInactiveTintColor: '#A0AEC0', 
                tabBarStyle: { 
                    paddingBottom: 10, 
                    height: 70,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginBottom: 5 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'paw' : 'paw-outline';
                    } else if (route.name === 'FavoriteTab') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'ReviewTab') {
                        // Icon chatbubbles trông rất hợp với phần Phản hồi
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'CartTab') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size + 2} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Khám phá' }}
            />

            <Tab.Screen
                name="FavoriteTab"
                component={FavoriteScreen}
                options={{ tabBarLabel: 'Yêu thích' }}
            />

            {/* 👇 CẤU CẤU LẠI TAB ĐÁNH GIÁ ĐỂ KHÔNG BỊ LỖI KHI BẤM TRỰC TIẾP */}
            <Tab.Screen
                name="ReviewTab"
                component={StoreReviewScreen}
                options={{ tabBarLabel: 'Đánh giá' }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // Ngăn chặn hành động mặc định
                        e.preventDefault();
                        // Chuyển sang trang Review nhưng ép showHistory = true để chỉ xem
                        navigation.navigate('ReviewTab', { 
                            product: null, 
                            showHistory: true 
                        });
                    },
                })}
            />

            <Tab.Screen
                name="CartTab"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Giỏ hàng',
                    tabBarBadge: cart.length > 0 ? cart.length : undefined,
                    tabBarBadgeStyle: { backgroundColor: '#FF4444', fontSize: 10 }
                }}
            />

            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Tôi' }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;