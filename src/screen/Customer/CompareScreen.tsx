import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

// Dữ liệu mẫu (Dùng khi thiếu sản phẩm để so sánh)
const DEFAULT_PRODUCT_1 = { 
    name: 'iPhone 15 Pro Max', 
    price: 34990000, 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500',
    specs: { screen: '6.7 inch OLED', cpu: 'A17 Pro', ram: '8GB', battery: '4422 mAh', cam: '48MP Main' }
};

const DEFAULT_PRODUCT_2 = { 
    name: 'Samsung S24 Ultra', 
    price: 29990000, 
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    specs: { screen: '6.8 inch AMOLED', cpu: 'Snapdragon 8 Gen 3', ram: '12GB', battery: '5000 mAh', cam: '200MP Main' }
};

const CompareScreen = ({ route, navigation }: any) => {
    // 👇 FIX LỖI Ở ĐÂY:
    // Lấy params, nếu không có thì dùng object rỗng
    const params = route.params || {};
    
    // Nếu product1 không có, dùng mặc định
    const product1 = params.product1 || DEFAULT_PRODUCT_1;
    
    // Nếu product2 bị null (do truyền từ trang trước), dùng mặc định S24 Ultra
    const product2 = params.product2 || DEFAULT_PRODUCT_2;

    const { addToCart } = useCart();

    // Component hiển thị 1 dòng so sánh
    const SpecRow = ({ label, val1, val2, highlight = false }: any) => (
        <View style={styles.specRow}>
            <Text style={styles.specLabel}>{label}</Text>
            <View style={styles.specValues}>
                <View style={styles.valBox}>
                    <Text style={[styles.valText, highlight && val1 > val2 && styles.winner]}>{val1}</Text>
                </View>
                <View style={styles.valBox}>
                    <Text style={[styles.valText, highlight && val2 > val1 && styles.winner]}>{val2}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#102A43" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>So sánh cấu hình</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* 1. ẢNH & GIÁ */}
                <View style={styles.productHeader}>
                    {/* Sản phẩm 1 */}
                    <View style={styles.prodCol}>
                        <Image 
                            source={typeof product1.image === 'string' ? { uri: product1.image } : product1.image} 
                            style={styles.prodImg} 
                            resizeMode="contain" 
                        />
                        <Text style={styles.prodName}>{product1.name}</Text>
                        <Text style={styles.prodPrice}>{product1.price.toLocaleString()}đ</Text>
                        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product1)}>
                            <Text style={styles.addText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                    </View>

                    {/* VS Icon */}
                    <View style={styles.vsCircle}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>

                    {/* Sản phẩm 2 */}
                    <View style={styles.prodCol}>
                        <Image 
                            source={typeof product2.image === 'string' ? { uri: product2.image } : product2.image} 
                            style={styles.prodImg} 
                            resizeMode="contain" 
                        />
                        <Text style={styles.prodName}>{product2.name}</Text>
                        <Text style={styles.prodPrice}>{product2.price.toLocaleString()}đ</Text>
                        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product2)}>
                            <Text style={styles.addText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. BẢNG THÔNG SỐ */}
                <View style={styles.specsContainer}>
                    <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
                    
                    {/* Lấy dữ liệu an toàn bằng ?. */}
                    <SpecRow label="Màn hình" val1={product1.specs?.screen || '---'} val2={product2.specs?.screen || '---'} />
                    <SpecRow label="Vi xử lý (CPU)" val1={product1.specs?.cpu || '---'} val2={product2.specs?.cpu || '---'} />
                    <SpecRow label="RAM" val1={product1.specs?.ram || '---'} val2={product2.specs?.ram || '---'} />
                    <SpecRow label="Dung lượng Pin" val1={product1.specs?.battery || '---'} val2={product2.specs?.battery || '---'} />
                    <SpecRow label="Camera Chính" val1={product1.specs?.cam || '---'} val2={product2.specs?.cam || '---'} />
                    
                    {/* Fake thêm thông số khác */}
                    <SpecRow label="Hệ điều hành" val1="iOS/Android" val2="Android/iOS" />
                    <SpecRow label="Chống nước" val1="IP68" val2="IP68" />
                </View>

                {/* 3. KẾT LUẬN AI (Giả lập) */}
                <View style={styles.aiReview}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                        <Ionicons name="sparkles" size={20} color="#F59E0B" />
                        <Text style={styles.aiTitle}> AI Tech Review</Text>
                    </View>
                    <Text style={styles.aiText}>
                        Nếu bạn thích sự ổn định và hệ sinh thái, hãy chọn <Text style={{fontWeight:'bold'}}>{product1.name}</Text>. 
                        {"\n\n"}
                        Tuy nhiên, nếu bạn cần tính năng đa dạng và tùy biến cao, <Text style={{fontWeight:'bold'}}>{product2.name}</Text> là lựa chọn đáng cân nhắc.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
    
    productHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', position: 'relative', paddingBottom: 25 },
    prodCol: { width: '45%', alignItems: 'center' },
    prodImg: { width: 100, height: 100, marginBottom: 10 },
    prodName: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: '#102A43', marginBottom: 5, height: 35 },
    prodPrice: { fontSize: 14, fontWeight: 'bold', color: '#EF4444', marginBottom: 10 },
    addBtn: { backgroundColor: '#EFF6FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    addText: { color: '#2563EB', fontSize: 11, fontWeight: 'bold' },

    vsCircle: { 
        position: 'absolute', top: '40%', left: '50%', marginLeft: -15, 
        width: 30, height: 30, borderRadius: 15, backgroundColor: '#102A43', 
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
        borderWidth: 2, borderColor: '#fff'
    },
    vsText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    specsContainer: { marginTop: 10, backgroundColor: '#fff', padding: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#102A43', marginBottom: 15 },
    specRow: { marginBottom: 15, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingBottom: 10 },
    specLabel: { fontSize: 12, color: '#64748B', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase' },
    specValues: { flexDirection: 'row', justifyContent: 'space-between' },
    valBox: { width: '48%', alignItems: 'center' },
    valText: { fontSize: 14, color: '#334E68', fontWeight: '500', textAlign: 'center' },
    winner: { color: '#2563EB', fontWeight: 'bold' },

    aiReview: { margin: 15, backgroundColor: '#FFFBEB', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FCD34D' },
    aiTitle: { fontWeight: 'bold', color: '#B45309' },
    aiText: { fontSize: 13, color: '#92400E', lineHeight: 20 }
});

export default CompareScreen;