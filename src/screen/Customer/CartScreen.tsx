import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }: any) => {
  const { cart, totalAmount, removeFromCart } = useCart();

  const renderItem = ({ item }: any) => {
    // Xử lý ảnh (nếu là link online hoặc ảnh local)
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.img} />
        
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.brand}>Tech Store Genuine</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
                {item.price.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={styles.quantity}>x{item.quantity}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => removeFromCart(item.id)} 
          style={styles.deleteBtn}
          activeOpacity={0.6}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header đơn giản */}
      <View style={styles.header}>
          <Text style={styles.title}>Giỏ hàng ({cart.length})</Text>
      </View>
      
      <FlatList 
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="cart-outline" size={60} color="#CBD5E0" />
            </View>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyText}>Có vẻ như bạn chưa chọn món đồ công nghệ nào.</Text>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
              activeOpacity={0.8}
              style={styles.shopNowBtn}
            >
              <Text style={styles.shopNowText}>Khám phá sản phẩm ngay</Text>
            </TouchableOpacity>
          </View>
        }
        // Khoảng trống ở dưới để danh sách không bị phần footer che mất
        contentContainerStyle={{ paddingBottom: 220, paddingTop: 10 }}
      />
      
      {cart.length > 0 && (
        <View style={styles.footer}>
          {/* DÒNG TỔNG TIỀN */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tạm tính:</Text>
            <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
          </View>

          <TouchableOpacity 
            style={styles.btn} 
            activeOpacity={0.9}
            // Điều hướng sang trang Thanh Toán (Checkout)
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.btnText}>TIẾN HÀNH ĐẶT HÀNG</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' }, // Màu nền xám xanh nhạt
  
  header: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#F0F4F8',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#102A43' },
  
  // CARD SẢN PHẨM
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    marginHorizontal: 20,
    borderRadius: 16, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#2563EB', // Bóng xanh nhẹ
    shadowOpacity: 0.08,
    shadowRadius: 5
  },
  img: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F1F5F9' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#102A43', marginBottom: 4 },
  brand: { fontSize: 12, color: '#627D98', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: { color: '#2563EB', fontWeight: 'bold', fontSize: 16, marginRight: 10 }, // Giá màu xanh
  quantity: { fontSize: 14, color: '#486581', fontWeight: '500' },
  
  deleteBtn: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8 }, // Nền đỏ nhạt cho nút xóa

  // TRẠNG THÁI TRỐNG
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIconCircle: { 
      width: 120, height: 120, backgroundColor: '#fff', 
      borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#102A43', marginBottom: 10 },
  emptyText: { fontSize: 15, color: '#627D98', textAlign: 'center', marginBottom: 30 },
  shopNowBtn: {
      paddingVertical: 14, paddingHorizontal: 30,
      backgroundColor: '#2563EB', borderRadius: 30, // Nút bo tròn màu xanh
      elevation: 5, shadowColor: '#2563EB', shadowOpacity: 0.3
  },
  shopNowText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // FOOTER (PHẦN THANH TOÁN)
  footer: { 
    position: 'absolute', 
    bottom: 0,
    width: width,
    borderTopWidth: 1, 
    borderColor: '#E2E8F0', 
    paddingHorizontal: 25,
    paddingTop: 20, 
    paddingBottom: 100, // Nhích cao lên để tránh TabBar
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },

  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 20 
  },
  totalLabel: { fontSize: 16, color: '#486581', fontWeight: '600' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#102A43' }, // Tổng tiền màu đen đậm cho dễ nhìn
  
  btn: { 
    backgroundColor: '#2563EB', // MÀU XANH DƯƠNG CHỦ ĐẠO
    padding: 16, 
    borderRadius: 14, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5, marginRight: 8 }
});

export default CartScreen;