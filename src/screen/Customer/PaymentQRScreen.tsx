import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, StatusBar, Animated } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const PaymentQRScreen = ({ route, navigation }: any) => {
  const { finalTotal, description, cart, type = 'ORDER' } = route.params;
  const { addOrder, clearCart } = useCart();
  const { user, loginSuccess } = useAuth();

  const [timeLeft, setTimeLeft] = useState(900); 
  // State để hiện thông báo "Đang kiểm tra giao dịch"
  const [statusText, setStatusText] = useState("Đang chờ bạn quét mã...");

  // 1. LOGIC ĐẾM NGƯỢC & TỰ ĐỘNG XÁC NHẬN GIẢ LẬP
  useEffect(() => {
    // Đếm ngược thời gian
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // GIẢ LẬP: Sau 10 giây (kể từ khi mở QR), hệ thống báo "Đã nhận được tiền"
    const autoVerifyTimer = setTimeout(() => {
      handleAutoSuccess();
    }, 10000); // 10 giây để khách kịp nhìn mã QR

    return () => {
      clearInterval(timer);
      clearTimeout(autoVerifyTimer);
    };
  }, []);

  // 2. HÀM XỬ LÝ KHI THANH TOÁN THÀNH CÔNG TỰ ĐỘNG
  const handleAutoSuccess = () => {
    setStatusText("✅ Đã nhận được thanh toán!");
    
    // Đợi 1.5 giây để khách thấy thông báo thành công rồi mới nhảy trang
    setTimeout(() => {
      if (type === 'VIP') {
        if (user) {
          loginSuccess({ ...user, role: 'VIP MEMBER' });
        }
        navigation.navigate('Main', { screen: 'ProfileTab' });
        Alert.alert("Tech Store VIP", "Chúc mừng Sen đã lên đời VIP! 👑");
      } else {
        addOrder({
          id: 'TS' + Math.floor(Math.random() * 1000000),
          date: new Date().toLocaleDateString('vi-VN'),
          total: finalTotal,
          status: 'Đã thanh toán',
          items: [...(cart || [])]
        });
        clearCart();
        navigation.navigate('Main');
        Alert.alert("Thành công ✅", "Đơn hàng của Sen đã được thanh toán tự động.");
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const BANK_ID = "MB"; 
  const ACCOUNT_NO = "0999999999"; 
  const ACCOUNT_NAME = "TECH STORE OFFICIAL";
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-print.png?amount=${finalTotal}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* TRẠNG THÁI TỰ ĐỘNG */}
        <View style={styles.statusBadge}>
            <ActivityIndicator size="small" color="#2563EB" style={{marginRight: 10}} />
            <Text style={styles.statusText}>{statusText}</Text>
        </View>

        <Text style={styles.price}>{finalTotal.toLocaleString('vi-VN')}₫</Text>
        
        <View style={styles.qrWrapper}>
          <Text style={styles.timerText}>Mã hết hạn sau: <Text style={{color: '#EF4444'}}>{formatTime(timeLeft)}</Text></Text>
          <Image source={{ uri: qrUrl }} style={styles.qrImg} resizeMode="contain" />
          <View style={styles.bankTag}>
             <Text style={styles.bankName}>NGÂN HÀNG QUÂN ĐỘI (MB)</Text>
          </View>
        </View>

        <View style={styles.instructionBox}>
            <Ionicons name="information-circle" size={20} color="#64748B" />
            <Text style={styles.instructionText}>
                Hệ thống sẽ tự động xác nhận sau khi Sen quét mã thành công. Vui lòng không thoát ứng dụng.
            </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  statusBadge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', 
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, marginBottom: 20 
  },
  statusText: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },

  price: { fontSize: 32, fontWeight: 'bold', color: '#102A43', marginBottom: 30 },

  qrWrapper: { 
    backgroundColor: '#fff', padding: 20, borderRadius: 20, 
    borderWidth: 2, borderColor: '#F1F5F9', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10
  },
  timerText: { fontSize: 13, fontWeight: 'bold', marginBottom: 15, color: '#64748B' },
  qrImg: { width: 260, height: 260 },
  bankTag: { marginTop: 15, paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#F1F5F9', borderRadius: 8 },
  bankName: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },

  instructionBox: { 
    flexDirection: 'row', marginTop: 40, padding: 15, 
    backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center' 
  },
  instructionText: { flex: 1, marginLeft: 10, fontSize: 12, color: '#64748B', lineHeight: 18 }
});

export default PaymentQRScreen;