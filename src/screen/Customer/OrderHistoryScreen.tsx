import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderHistoryScreen = ({ navigation }: any) => {
  const { orders } = useCart();
  const [activeTab, setActiveTab] = useState('Tất cả');

  const tabs = ['Tất cả', 'Chờ xác nhận', 'Đã thanh toán', 'Đang giao'];

  // Lọc đơn hàng an toàn: Nếu orders bị null/undefined thì trả về mảng rỗng []
  const filteredOrders = (orders ?? []).filter(order => {
    if (activeTab === 'Tất cả') return true;
    return order?.status === activeTab;
  });

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Đã thanh toán': return { bg: '#D1FAE5', text: '#10B981' }; 
          case 'Đang giao': return { bg: '#DBEAFE', text: '#2563EB' };    
          case 'Chờ xác nhận': return { bg: '#FEF3C7', text: '#F59E0B' }; 
          default: return { bg: '#F1F5F9', text: '#64748B' };             
      }
  };

  const renderOrderItem = ({ item }: any) => {
    const statusStyle = getStatusColor(item?.status ?? '');

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.shopRow}>
            <Ionicons name="business-outline" size={18} color="#102A43" />
            <Text style={styles.shopName}> Tech Store Official</Text>
          </View>
          <Text style={[styles.statusTag, { backgroundColor: statusStyle.bg, color: statusStyle.text }]}>
            {item?.status ?? 'Đang xử lý'}
          </Text>
        </View>

        {/* Bảo vệ vòng lặp map: Nếu items không có thì không chạy */}
        {(item?.items ?? []).map((prod: any, index: number) => (
          <View key={index} style={styles.prodRow}>
            <Image 
                source={typeof prod?.image === 'string' ? { uri: prod.image } : (prod?.image ?? {uri: 'https://via.placeholder.com/150'})} 
                style={styles.prodImg} 
            />
            <View style={styles.prodInfo}>
              <Text style={styles.prodName} numberOfLines={1}>{prod?.name ?? 'Sản phẩm công nghệ'}</Text>
              <Text style={styles.prodQty}>x{prod?.quantity ?? 1}</Text>
            </View>
            <Text style={styles.prodPrice}>{(prod?.price ?? 0).toLocaleString('vi-VN')}₫</Text>
          </View>
        ))}

        <View style={styles.orderFooter}>
          <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{(item?.items?.length ?? 0)} sản phẩm</Text>
              <Text style={styles.totalLabel}>Tổng: <Text style={styles.totalPrice}>{(item?.total ?? 0).toLocaleString('vi-VN')}₫</Text></Text>
          </View>
          
          <View style={styles.actionRow}>
              <Text style={styles.orderDate}>{item?.date ?? 'N/A'}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.detailBtn} 
                  activeOpacity={0.8}
                  onPress={() => {
                    // Kiểm tra item tồn tại trước khi điều hướng
                    if (item) {
                      navigation.navigate('OrderDetails', { order: item });
                    }
                  }}
                >
                  <Text style={styles.detailBtnText}>
                     {(item?.status === 'Đã thanh toán' || item?.status === 'Đang giao') ? 'Đánh giá' : 'Chi tiết'}
                  </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#102A43" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{width: 26}} />
      </View>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 10}}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredOrders} 
        // 👇 GIẢI PHÁP TRIỆT TIÊU LỖI toString():
        // 1. Dùng String() thay vì .toString() (an toàn hơn)
        // 2. Nếu id không có, dùng index của mảng làm key dự phòng
        keyExtractor={(item, index) => (item?.id ? String(item.id) : `order-${index}`)} 
        renderItem={renderOrderItem} 
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={60} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
  tabBar: { backgroundColor: '#fff', marginBottom: 10, elevation: 1 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabItem: { borderBottomColor: '#2563EB' },
  tabText: { fontSize: 14, color: '#64748B' },
  activeTabText: { color: '#2563EB', fontWeight: 'bold' },
  orderCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  shopRow: { flexDirection: 'row', alignItems: 'center' },
  shopName: { fontWeight: 'bold', fontSize: 14, marginLeft: 6, color: '#102A43' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 11, fontWeight: 'bold' },
  prodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  prodImg: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F0F4F8' },
  prodInfo: { flex: 1, marginLeft: 12 },
  prodName: { fontSize: 14, fontWeight: '500', color: '#102A43' },
  prodQty: { fontSize: 12, color: '#64748B' },
  prodPrice: { fontSize: 14, fontWeight: 'bold', color: '#102A43' },
  orderFooter: { borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 13, color: '#64748B' },
  totalPrice: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderDate: { fontSize: 11, color: '#94A3B8' },
  buttonGroup: { flexDirection: 'row' },
  detailBtn: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  detailBtnText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#CBD5E0', marginTop: 10 }
});

export default OrderHistoryScreen;