import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const VoucherScreen = ({ navigation }: any) => {
  const { vouchers, setAppliedVoucher, totalAmount } = useCart();

  const handleApply = (item: any) => {
    // Kiểm tra điều kiện đơn tối thiểu
    if (totalAmount < item.minOrder) {
      Alert.alert(
          "Chưa đủ điều kiện", 
          `Đơn hàng cần tối thiểu ${item.minOrder.toLocaleString()}₫ để sử dụng mã này.`
      );
      return;
    }
    setAppliedVoucher(item);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={28} color="#102A43" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kho Voucher Tech</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
            const isEligible = totalAmount >= item.minOrder;
            
            return (
              <View style={[styles.voucherCard, !isEligible && styles.disabledCard]}>
                {/* Phần Trái: Icon */}
                <View style={styles.leftPart}>
                   <View style={styles.iconCircle}>
                       <Ionicons name={item.type === 'percent' ? "pricetags" : "gift"} size={24} color="#fff" />
                   </View>
                   <View style={styles.verticalLine}>
                       {[...Array(6)].map((_, i) => (
                           <View key={i} style={styles.dash} />
                       ))}
                   </View>
                </View>

                {/* Phần Phải: Nội dung */}
                <View style={styles.rightPart}>
                  <View>
                      <Text style={styles.codeText}>{item.code}</Text>
                      <Text style={styles.descText}>{item.desc}</Text>
                      <Text style={styles.minOrderText}>Đơn tối thiểu: {item.minOrder.toLocaleString()}₫</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                        styles.applyBtn, 
                        !isEligible && { backgroundColor: '#CBD5E0' }
                    ]} 
                    onPress={() => handleApply(item)}
                    disabled={!isEligible}
                  >
                    <Text style={styles.applyText}>
                        {isEligible ? "Áp dụng" : "Chưa đủ"}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Trang trí hình tròn khuyết ở giữa */}
                <View style={styles.circleTop} />
                <View style={styles.circleBottom} />
              </View>
            );
        }}
      />
    </SafeAreaView>
  );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' }, // Nền xám xanh
  
  header: { 
      flexDirection: 'row', justifyContent: 'space-between', padding: 16, 
      backgroundColor: '#fff', alignItems: 'center',
      borderBottomWidth: 1, borderColor: '#E2E8F0'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },

  // Voucher Card
  voucherCard: { 
      flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, 
      overflow: 'hidden', elevation: 2, shadowColor: '#2563EB', shadowOpacity: 0.1, shadowRadius: 4,
      height: 110
  },
  disabledCard: { opacity: 0.7 },

  // Left Part
  leftPart: { 
      width: 100, backgroundColor: '#2563EB', // Màu xanh dương
      justifyContent: 'center', alignItems: 'center', 
      position: 'relative'
  },
  iconCircle: {
      width: 45, height: 45, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center', alignItems: 'center'
  },
  verticalLine: { position: 'absolute', right: 0, top: 10, bottom: 10, justifyContent: 'space-between', width: 1, overflow: 'hidden' },
  dash: { width: 1, height: 6, backgroundColor: '#fff', marginBottom: 4 },

  // Right Part
  rightPart: { flex: 1, padding: 12, paddingLeft: 20, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
  
  codeText: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' }, // Mã màu xanh
  descText: { fontSize: 13, color: '#102A43', marginVertical: 4, fontWeight: '500', maxWidth: 140 },
  minOrderText: { fontSize: 11, color: '#627D98' },
  
  applyBtn: { 
      backgroundColor: '#2563EB', paddingHorizontal: 15, paddingVertical: 8, 
      borderRadius: 20, elevation: 1
  },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Trang trí lỗ khuyết (tạo hiệu ứng vé)
  circleTop: { 
      position: 'absolute', top: -10, left: 90, 
      width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0F4F8' 
  },
  circleBottom: { 
      position: 'absolute', bottom: -10, left: 90, 
      width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0F4F8' 
  }
});

export default VoucherScreen;