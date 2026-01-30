import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, FlatList, Dimensions, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 👇 Dùng icon công nghệ
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

import FlashSale from '../../components/FlashSale';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 25;

// --- 1. DANH MỤC CÔNG NGHỆ ---
const CATEGORIES = [
  { id: '0', name: 'Tất cả', lib: 'Ionicons', icon: 'grid-outline', filter: '' },
  { id: '1', name: 'Laptop', lib: 'MaterialCommunityIcons', icon: 'laptop', filter: 'Laptop' },
  { id: '2', name: 'Điện thoại', lib: 'MaterialCommunityIcons', icon: 'cellphone', filter: 'Điện thoại' },
  { id: '3', name: 'Tablet', lib: 'MaterialCommunityIcons', icon: 'tablet', filter: 'Tablet' },
  { id: '4', name: 'Âm thanh', lib: 'MaterialCommunityIcons', icon: 'headphones', filter: 'Âm thanh' },
  { id: '5', name: 'Đồng hồ', lib: 'MaterialCommunityIcons', icon: 'watch', filter: 'Đồng hồ' },
  { id: '6', name: 'PC & Màn', lib: 'MaterialCommunityIcons', icon: 'monitor', filter: 'PC' },
  { id: '7', name: 'Gaming', lib: 'Ionicons', icon: 'game-controller-outline', filter: 'Gaming' },
  { id: '8', name: 'Phụ kiện', lib: 'MaterialCommunityIcons', icon: 'usb-flash-drive', filter: 'Phụ kiện' },
];

// --- 2. DỮ LIỆU SẢN PHẨM MẪU (Dùng link ảnh online cho tiện test) ---
export const PRODUCTS = [
    // --- LAPTOP ---
    { id: '1', name: 'MacBook Air M2 2023', price: 24500000, image: require('../../assets/products/macbook_air.jpg'), rating: 5.0, breed: 'Laptop' },
    { id: '9', name: 'Laptop Gaming ASUS ROG', price: 32000000, image: require('../../assets/products/asus_rog.jpg'), rating: 4.8, breed: 'Laptop' },
    { id: '13', name: 'MacBook Pro M3 Max', price: 89900000, image: require('../../assets/products/macbook_pro.jpg'), rating: 5.0, breed: 'Laptop' },
    { id: '16', name: 'Dell XPS 13 Plus', price: 45500000, image: require('../../assets/products/dell_xps.jpg'), rating: 4.8, breed: 'Laptop' },

    // --- ĐIỆN THOẠI ---
    { id: '2', name: 'iPhone 15 Pro Max Titanium', price: 34990000, image: require('../../assets/products/iphone_15_pm.jpg'), rating: 4.9, breed: 'Điện thoại' },
    { id: '5', name: 'Samsung S24 Ultra', price: 29990000, image: require('../../assets/products/s24_ultra.jpg'), rating: 4.8, breed: 'Điện thoại' },
    { id: '14', name: 'iPhone 15 Pink', price: 21990000, image: require('../../assets/products/iphone_15_pink.jpg'), rating: 4.7, breed: 'Điện thoại' },
    { id: '24', name: 'Google Pixel 8 Pro', price: 25500000, image: require('../../assets/products/pixel_8.jpg'), rating: 4.7, breed: 'Điện thoại' },

    // --- ÂM THANH & PHỤ KIỆN ---
    { id: '3', name: 'Sony WH-1000XM5', price: 6490000, image: require('../../assets/products/sony_wh.jpg'), rating: 4.8, breed: 'Âm thanh' },
    { id: '10', name: 'Loa Marshall Stanmore III', price: 9500000, image: require('../../assets/products/marshall.jpg'), rating: 4.9, breed: 'Âm thanh' },
    { id: '7', name: 'Bàn phím cơ Keychron K2', price: 1850000, image: require('../../assets/products/keychron.jpg'), rating: 4.7, breed: 'Phụ kiện' },
    { id: '40', name: 'Flycam DJI Mini 4 Pro', price: 21500000, image: require('../../assets/products/dji_drone.jpg'), rating: 5.0, breed: 'Phụ kiện' },
];

const HomeScreen = ({ navigation }: any) => {
  const { cart, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === '' || p.breed.includes(selectedCategory) || p.name.includes(selectedCategory);
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const renderProductItem = ({ item }: any) => {
    // Xử lý ảnh: Ưu tiên link online để không bị lỗi
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={imageSource} style={styles.productImage} resizeMode="cover" />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.ratingRow}>
             <Ionicons name="star" size={12} color="#F59E0B" />
             <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER CỐ ĐỊNH */}
      <View style={styles.topFixed}>
        <View style={styles.headerRow}>
          <View>
              <Text style={styles.greetingText}>Xin chào, Sen Công Nghệ 👋</Text>
              <Text style={styles.brandText}>Tech Store Official</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'CartTab' })} style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={28} color="#102A43" />
            {cart.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>}
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#627D98" />
          <TextInput 
            placeholder="Tìm iPhone, Laptop, Phụ kiện..." 
            placeholderTextColor="#9AA5B1"
            style={styles.input} 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {/* Banner Quảng cáo (Giả lập) */}
            <View style={styles.banner}>
                <View style={{flex: 1}}>
                    <Text style={styles.bannerTitle}>Siêu Sale ⚡</Text>
                    <Text style={styles.bannerSub}>Giảm đến 40%</Text>
                    <Text style={styles.bannerSubSmall}>Cho phụ kiện Apple</Text>
                </View>
                <Ionicons name="gift-outline" size={60} color="#fff" style={{opacity: 0.9}} />
            </View>
            {/* 👇 Thêm Flash Sale vào đây */}
            <FlashSale/>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{paddingRight: 20}}
              renderItem={({ item }: any) => {
                const IconComp = item.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
                const active = selectedCategory === item.filter;
                return (
                  <TouchableOpacity 
                    style={[styles.catBox, active && styles.catBoxActive]}
                    onPress={() => setSelectedCategory(item.filter)}
                  >
                    <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                      <IconComp name={item.icon as any} size={24} color={active ? "#fff" : "#2563EB"} />
                    </View>
                    <Text style={[styles.catName, active && styles.catNameActive]}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Gợi ý cho bạn</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' }, // Nền xám xanh nhạt
  
  topFixed: { 
      backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15,
      borderBottomWidth: 1, borderColor: '#E2E8F0',
      elevation: 4, shadowColor: '#000', shadowOpacity: 0.05
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  greetingText: { fontSize: 13, color: '#627D98', marginBottom: 2 },
  brandText: { fontSize: 22, fontWeight: 'bold', color: '#102A43' },
  
  cartIconContainer: { padding: 5 },
  badge: { 
      position: 'absolute', top: 0, right: 0, 
      backgroundColor: '#EF4444', borderRadius: 9, width: 18, height: 18, 
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' 
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  
  searchBar: { 
      flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', 
      paddingHorizontal: 15, borderRadius: 12, height: 45, borderWidth: 1, borderColor: '#E2E8F0' 
  },
  input: { flex: 1, marginLeft: 10, color: '#102A43' },
  
  headerContent: { padding: 20, paddingTop: 10 },
  
  // Banner
  banner: {
      backgroundColor: '#2563EB', borderRadius: 16, padding: 20, marginBottom: 25,
      flexDirection: 'row', alignItems: 'center',
      shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bannerSub: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bannerSubSmall: { color: '#BFDBFE', fontSize: 12, marginTop: 4 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#102A43' },
  
  // Danh mục
  catBox: { alignItems: 'center', marginRight: 20 },
  catBoxActive: { },
  iconCircle: { 
      width: 55, height: 55, borderRadius: 20, backgroundColor: '#fff', 
      justifyContent: 'center', alignItems: 'center', marginBottom: 8,
      borderWidth: 1, borderColor: '#E2E8F0',
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
  },
  iconCircleActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' }, // Xanh dương
  catName: { fontSize: 12, color: '#627D98', fontWeight: '500' },
  catNameActive: { color: '#2563EB', fontWeight: 'bold' },
  
  // Sản phẩm
  row: { justifyContent: 'space-between', paddingHorizontal: 20 },
  productCard: { 
      width: COLUMN_WIDTH, backgroundColor: '#fff', borderRadius: 16, marginBottom: 15, 
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, overflow: 'hidden'
  },
  productImage: { width: '100%', height: 160, backgroundColor: '#F1F5F9' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', height: 40, color: '#102A43', lineHeight: 20 },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingText: { fontSize: 11, color: '#627D98', marginLeft: 4 },
  
  productPrice: { color: '#2563EB', fontWeight: 'bold', fontSize: 15 }, // Giá màu xanh
  
  addBtn: { 
      position: 'absolute', bottom: 10, right: 10, 
      backgroundColor: '#2563EB', borderRadius: 10, padding: 6,
      elevation: 2
  }
});

export default HomeScreen;