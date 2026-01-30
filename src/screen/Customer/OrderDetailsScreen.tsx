import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviews } from '../../context/ReviewContext';

const OrderDetailsScreen = ({ route, navigation }: any) => {
    // 1. Lấy dữ liệu an toàn - Tránh lỗi crash khi route.params bị null
    const { order } = route.params || {};
    
    // Ép kiểu ID về chuỗi một cách an toàn nhất (Dùng String() thay vì .toString())
    const safeOrderId = order?.id ? String(order.id) : 'N/A';
    
    const { addReview } = useReviews();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSendReview = async () => {
        const cleanComment = comment ? comment.trim() : "";
        if (cleanComment.length < 5) {
            Alert.alert("Thông báo", "Sen vui lòng nhập cảm nhận từ 5 ký tự nhé!");
            return;
        }

        // Lưu đánh giá vào kho dữ liệu
        const success = await addReview({
            id: String(Date.now()),
            orderId: safeOrderId,
            user: "Khách hàng Tech Store",
            productName: order?.items?.[0]?.name || "Thiết bị công nghệ",
            content: cleanComment,
            star: rating,
            date: new Date().toLocaleDateString('vi-VN')
        });

        if (success) {
            Alert.alert("Thành công", "Cảm ơn Sen đã để lại đánh giá! 🌟", [
                { text: "Về Trang Chủ", onPress: () => navigation.popToTop() }
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#102A43" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi Tiết Hóa Đơn</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                
                {/* PHẦN 1: GIAO DIỆN HÓA ĐƠN ĐIỆN TỬ */}
                <View style={styles.invoiceCard}>
                    <View style={styles.invoiceBranding}>
                        <Ionicons name="flash" size={20} color="#2563EB" />
                        <Text style={styles.brandText}> TECH STORE RECEIPT</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã hóa đơn:</Text>
                        <Text style={styles.infoValue}>#{safeOrderId}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày xuất:</Text>
                        <Text style={styles.infoValue}>{order?.date || 'Hôm nay'}</Text>
                    </View>
                    
                    <View style={styles.dashedDivider} />

                    {/* Danh sách sản phẩm trong hóa đơn */}
                    {(order?.items || []).map((prod: any, index: number) => (
                        <View key={index} style={styles.itemRow}>
                            <Image 
                                source={typeof prod?.image === 'string' ? { uri: prod.image } : prod?.image} 
                                style={styles.itemImg} 
                            />
                            <View style={styles.itemContent}>
                                <Text style={styles.itemName} numberOfLines={1}>{prod?.name || 'Sản phẩm'}</Text>
                                <Text style={styles.itemQty}>x{prod?.quantity || 1}</Text>
                            </View>
                            <Text style={styles.itemPrice}>{(prod?.price || 0).toLocaleString()}₫</Text>
                        </View>
                    ))}

                    <View style={styles.dashedDivider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TỔNG THANH TOÁN</Text>
                        <Text style={styles.totalValue}>{(order?.total || 0).toLocaleString()}₫</Text>
                    </View>
                </View>

                {/* PHẦN 2: KHU VỰC ĐÁNH GIÁ (Chỉ hiện khi đơn đã hoàn tất) */}
                <View style={styles.reviewCard}>
                    <Text style={styles.reviewTitle}>Đánh giá trải nghiệm</Text>
                    
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <TouchableOpacity key={s} onPress={() => setRating(s)} style={{padding: 5}}>
                                <Ionicons 
                                    name={s <= rating ? "star" : "star-outline"} 
                                    size={40} 
                                    color="#F59E0B" 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput 
                        style={styles.input}
                        placeholder="Hãy chia sẻ cảm nhận của Sen về sản phẩm này nhé..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        value={comment}
                        onChangeText={setComment}
                    />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSendReview}>
                        <Text style={styles.submitBtnText}>GỬI ĐÁNH GIÁ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
    
    // Invoice Card
    invoiceCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, margin: 15, elevation: 4 },
    invoiceBranding: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    brandText: { fontWeight: 'bold', fontSize: 16, color: '#2563EB', letterSpacing: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    infoLabel: { color: '#64748B', fontSize: 13 },
    infoValue: { fontWeight: 'bold', color: '#102A43', fontSize: 13 },
    dashedDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E0' },
    
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    itemImg: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#F8FAFC' },
    itemContent: { flex: 1, marginLeft: 12 },
    itemName: { fontWeight: 'bold', fontSize: 14, color: '#102A43' },
    itemQty: { fontSize: 12, color: '#94A3B8' },
    itemPrice: { fontWeight: 'bold', color: '#102A43' },
    
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#102A43' },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },

    // Review Card
    reviewCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginHorizontal: 15, marginBottom: 20 },
    reviewTitle: { fontSize: 16, fontWeight: 'bold', color: '#102A43', textAlign: 'center', marginBottom: 15 },
    starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
    input: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, color: '#102A43' },
    submitBtn: { backgroundColor: '#2563EB', marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default OrderDetailsScreen;