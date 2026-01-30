import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';

// 👇 1. Import MapView
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = ({ navigation }: any) => {
  const { 
    cart, totalAmount, clearCart, addOrder, appliedVoucher, getDiscountAmount,
    shippingMethods, selectedShipping, setSelectedShipping 
  } = useCart();

  const [method, setMethod] = useState<'cod' | 'qr'>('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // --- STATE BẢN ĐỒ ---
  const [isMapVisible, setMapVisible] = useState(false);
  const [region, setRegion] = useState({
      latitude: 10.762622, // Tọa độ mặc định (TP.HCM)
      longitude: 106.660172,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
  });

  const shippingFee = selectedShipping.fee;
  const voucherDiscount = getDiscountAmount(totalAmount); 
  const finalTotal = totalAmount + shippingFee - voucherDiscount;
  const DESCRIPTION = `TECHORDER${Math.floor(Math.random() * 10000)}`;

  // Xử lý khi chọn xong vị trí trên Map
  const handleConfirmLocation = () => {
      // Trong thực tế, Sen sẽ dùng API Google Geocoding để đổi Lat/Long thành tên đường
      // Ở đây mình giả lập điền tọa độ vào ô địa chỉ
      const locationString = `Ghim bản đồ: ${region.latitude.toFixed(4)}, ${region.longitude.toFixed(4)}`;
      setAddress((prev) => locationString + (prev ? `, ${prev}` : '')); 
      setMapVisible(false);
  };

  const handleProcessOrder = () => {
    if (!address || !phone) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập địa chỉ và số điện thoại nhận hàng.");
      return;
    }

    if (method === 'qr') {
      navigation.navigate('PaymentQR', {
        finalTotal,
        description: DESCRIPTION,
        cart,
        address,
        phone,
        type: 'ORDER'
      });
    } else {
      Alert.alert("Xác nhận đặt hàng", "Bạn chắc chắn muốn đặt đơn hàng công nghệ này?", [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", 
          onPress: () => {
            addOrder({
              id: 'TS' + Math.floor(Math.random() * 1000000),
              date: new Date().toLocaleDateString('vi-VN'),
              total: finalTotal,
              status: 'Đang xử lý',
              items: [...cart]
            });
            clearCart();
            navigation.navigate('Main');
            Alert.alert("Thành công", "Đơn hàng Tech Store của bạn đang được chuẩn bị!");
          } 
        }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#102A43" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* ĐỊA CHỈ NHẬN HÀNG */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#2563EB" /> 
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <TextInput 
                placeholder="Số điện thoại người nhận" 
                placeholderTextColor="#9AA5B1"
                style={styles.addressInput} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
            />
            
            {/* Ô NHẬP ĐỊA CHỈ + NÚT BẢN ĐỒ */}
            <View style={styles.addressRow}>
                <TextInput 
                    placeholder="Số nhà, Tên đường..." 
                    placeholderTextColor="#9AA5B1"
                    style={[styles.addressInput, { flex: 1, borderBottomWidth: 0 }]} 
                    value={address} 
                    onChangeText={setAddress} 
                    multiline 
                />
                {/* 👇 Nút mở bản đồ */}
                <TouchableOpacity onPress={() => setMapVisible(true)} style={styles.mapBtn}>
                    <Ionicons name="map" size={20} color="#2563EB" />
                    <Text style={styles.mapBtnText}>Bản đồ</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DANH SÁCH SẢN PHẨM */}
        <View style={styles.sectionCard}>
          <View style={styles.shopHeader}>
            <Ionicons name="business-outline" size={18} color="#102A43" />
            <Text style={styles.shopName}> Tech Store Official</Text>
            <Ionicons name="checkmark-circle" size={14} color="#2563EB" style={{marginLeft: 4}} />
          </View>
          {cart.map((item: any) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImg} />
              <View style={styles.productDetail}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.variantText}>Phân loại: Chính hãng</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}₫</Text>
                  <Text style={styles.productQty}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* PHƯƠNG THỨC VẬN CHUYỂN */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Vận chuyển</Text>
          {shippingMethods.map((methodItem) => (
            <TouchableOpacity 
              key={methodItem.id} 
              style={[styles.shippingOption, selectedShipping.id === methodItem.id && styles.activeShippingOption]} 
              onPress={() => setSelectedShipping(methodItem)}
            >
              <View style={styles.shippingIconBox}>
                 <Ionicons name={methodItem.id === 'express' ? "rocket-outline" : "bicycle-outline"} size={20} color={selectedShipping.id === methodItem.id ? "#2563EB" : "#627D98"} />
              </View>
              <View style={styles.shippingInfo}>
                <Text style={[styles.shippingName, selectedShipping.id === methodItem.id && styles.activeText]}>{methodItem.name}</Text>
                <Text style={styles.shippingTime}>Giao trong: {methodItem.time}</Text>
              </View>
              <Text style={styles.shippingFeeText}>{methodItem.fee.toLocaleString('vi-VN')}₫</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VOUCHER & THANH TOÁN */}
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('Voucher')}>
            <View style={styles.rowLabel}>
              <Ionicons name="ticket-outline" size={20} color="#2563EB" />
              <Text style={styles.rowText}> Tech Voucher</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.discountText, !appliedVoucher && { color: '#999' }]}>
                  {appliedVoucher ? `-${voucherDiscount.toLocaleString('vi-VN')}₫` : "Chọn hoặc nhập mã"}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Thanh toán</Text>
          <TouchableOpacity onPress={() => setMethod('cod')} style={styles.paymentOption}>
            <Ionicons name="cash-outline" size={24} color="#102A43" />
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
            <Ionicons name={method === 'cod' ? "radio-button-on" : "radio-button-off"} size={22} color={method === 'cod' ? "#2563EB" : "#ccc"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMethod('qr')} style={styles.paymentOption}>
            <Ionicons name="qr-code-outline" size={24} color="#102A43" />
            <Text style={styles.paymentText}>Chuyển khoản ngân hàng (QR)</Text>
            <Ionicons name={method === 'qr' ? "radio-button-on" : "radio-button-off"} size={22} color={method === 'qr' ? "#2563EB" : "#ccc"} />
          </TouchableOpacity>
        </View>

        {/* TỔNG KẾT CHI PHÍ */}
        <View style={styles.sectionCard}>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
            <Text style={styles.summaryValue}>{totalAmount.toLocaleString('vi-VN')}₫</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>+{shippingFee.toLocaleString('vi-VN')}₫</Text>
          </View>
          {voucherDiscount > 0 && (
            <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Giảm giá Voucher</Text>
                <Text style={[styles.summaryValue, {color: '#2563EB'}]}>-{voucherDiscount.toLocaleString('vi-VN')}₫</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryLine}>
            <Text style={styles.finalTotalLabel}>Tổng thanh toán</Text>
            <Text style={styles.finalAmountText}>{finalTotal.toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.totalInfo}>
          <Text style={styles.bottomTotalLabel}>Tổng cộng</Text>
          <Text style={styles.bottomTotalValue}>{finalTotal.toLocaleString('vi-VN')}₫</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handleProcessOrder}>
          <Text style={styles.orderBtnText}>
            {method === 'qr' ? 'THANH TOÁN NGAY' : 'ĐẶT HÀNG'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 👇 MODAL BẢN ĐỒ (MAP VIEW) */}
      <Modal visible={isMapVisible} animationType="slide">
          <View style={{flex: 1}}>
              <MapView
                style={{flex: 1}}
                region={region}
                // Khi kéo map, cập nhật region
                onRegionChangeComplete={(r) => setRegion(r)} 
              />
              
              {/* Marker cố định ở giữa màn hình */}
              <View style={styles.markerFixed}>
                  <Ionicons name="location" size={40} color="#EF4444" />
              </View>

              {/* Header Modal */}
              <View style={styles.mapHeader}>
                  <TouchableOpacity onPress={() => setMapVisible(false)} style={styles.closeMapBtn}>
                      <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.mapTitle}>Ghim vị trí nhận hàng</Text>
              </View>

              {/* Nút Xác nhận vị trí */}
              <View style={styles.mapFooter}>
                  <Text style={styles.coordText}>
                      Tọa độ: {region.latitude.toFixed(5)}, {region.longitude.toFixed(5)}
                  </Text>
                  <TouchableOpacity style={styles.confirmLocationBtn} onPress={handleConfirmLocation}>
                      <Text style={styles.confirmLocationText}>XÁC NHẬN VỊ TRÍ NÀY</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
  
  sectionCard: { backgroundColor: '#fff', padding: 16, marginBottom: 10, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 8, color: '#102A43' },
  
  inputGroup: { backgroundColor: '#F0F4F8', borderRadius: 8, paddingHorizontal: 10 },
  addressInput: { borderBottomWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12, fontSize: 15, color: '#102A43' },
  
  // Style cho dòng địa chỉ có nút Map
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#DBEAFE', borderRadius: 6, marginLeft: 5 },
  mapBtnText: { color: '#2563EB', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },

  // ... (Giữ nguyên các styles cũ của Shop, Product, Shipping, Voucher...)
  shopHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderColor: '#F0F4F8', paddingBottom: 10 },
  shopName: { fontWeight: 'bold', fontSize: 15, color: '#102A43' },
  productItem: { flexDirection: 'row', marginBottom: 15 },
  productImg: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#F0F4F8' },
  productDetail: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  productName: { fontSize: 15, color: '#102A43', fontWeight: '500', marginBottom: 4 },
  variantText: { fontSize: 12, color: '#627D98', marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontWeight: 'bold', fontSize: 15, color: '#102A43' },
  productQty: { color: '#627D98', fontSize: 14 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 15, color: '#102A43' },
  shippingOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, marginBottom: 10 },
  activeShippingOption: { borderColor: '#2563EB', backgroundColor: '#F0F7FF' },
  shippingIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  shippingInfo: { flex: 1 },
  shippingName: { fontSize: 15, color: '#102A43', fontWeight: '600' },
  activeText: { color: '#2563EB' },
  shippingTime: { fontSize: 12, color: '#627D98', marginTop: 2 },
  shippingFeeText: { fontSize: 14, fontWeight: 'bold', color: '#102A43' },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  rowLabel: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 15, color: '#102A43', marginLeft: 8 },
  discountText: { color: '#2563EB', fontSize: 14, fontWeight: '600', marginRight: 5 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F0F4F8' },
  paymentText: { flex: 1, marginLeft: 12, fontSize: 15, color: '#102A43' },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#627D98', fontSize: 14 },
  summaryValue: { color: '#102A43', fontSize: 15, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  finalTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#102A43' },
  finalAmountText: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 15, paddingBottom: 25, borderTopWidth: 1, borderColor: '#E2E8F0', elevation: 10 },
  totalInfo: { flex: 1, justifyContent: 'center' },
  bottomTotalLabel: { fontSize: 12, color: '#627D98' },
  bottomTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  orderBtn: { backgroundColor: '#2563EB', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  orderBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // 👇 Styles cho Modal Map
  markerFixed: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -40, zIndex: 10 },
  mapHeader: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, elevation: 5 },
  closeMapBtn: { padding: 5 },
  mapTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  mapFooter: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 10 },
  coordText: { textAlign: 'center', color: '#627D98', marginBottom: 10 },
  confirmLocationBtn: { backgroundColor: '#2563EB', padding: 15, borderRadius: 12, alignItems: 'center' },
  confirmLocationText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CheckoutScreen;