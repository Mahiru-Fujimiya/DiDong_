import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const VipRegisterScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<'month' | 'year'>('year');

    const handlePayment = () => {
        // 1. Xác định số tiền
        const amount = selectedPlan === 'year' ? 499000 : 59000;
        
        // 2. Tạo nội dung chuyển khoản
        const desc = `VIP ${selectedPlan === 'year' ? '1 NAM' : '1 THANG'} ${user?.name}`;

        // 3. Chuyển sang màn hình QR (mang theo tham số type='VIP')
        navigation.navigate('PaymentQR', {
            finalTotal: amount,
            description: desc,
            type: 'VIP', // 👈 Đánh dấu đây là thanh toán VIP
            plan: selectedPlan // Gửi kèm gói để bên kia biết mà kích hoạt
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#102A43" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nâng cấp thành viên</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* CARD VIP */}
                <View style={styles.cardContainer}>
                    <View style={styles.vipCard}>
                        <View style={styles.cardTop}>
                            <Ionicons name="diamond" size={32} color="#F59E0B" />
                            <Text style={styles.cardBrand}>TECH STORE VIP</Text>
                        </View>
                        <Text style={styles.cardSlogan}>Đẳng cấp công nghệ thượng thừa</Text>
                        <View style={styles.cardBottom}>
                            <Text style={styles.memberName}>{user?.name || 'Khách hàng'}</Text>
                            <Text style={styles.memberId}>ID: {user?.id || '---'}</Text>
                        </View>
                        <View style={styles.circleDecor1} />
                        <View style={styles.circleDecor2} />
                    </View>
                </View>

                {/* PRICING */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chọn gói nâng cấp</Text>
                    
                    {/* Gói Năm */}
                    <TouchableOpacity 
                        style={[styles.planCard, selectedPlan === 'year' && styles.activePlan]}
                        activeOpacity={0.9}
                        onPress={() => setSelectedPlan('year')}
                    >
                        <View style={styles.planHeader}>
                            <View style={styles.radioCircle}>
                                {selectedPlan === 'year' && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.planName}>Gói 1 Năm (Best Choice)</Text>
                            <View style={styles.saveBadge}>
                                <Text style={styles.saveText}>-20%</Text>
                            </View>
                        </View>
                        <View style={styles.planPriceRow}>
                            <Text style={styles.planPrice}>499.000đ</Text>
                            <Text style={styles.planDuration}>/năm</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Gói Tháng */}
                    <TouchableOpacity 
                        style={[styles.planCard, selectedPlan === 'month' && styles.activePlan]}
                        activeOpacity={0.9}
                        onPress={() => setSelectedPlan('month')}
                    >
                        <View style={styles.planHeader}>
                            <View style={styles.radioCircle}>
                                {selectedPlan === 'month' && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.planName}>Gói 1 Tháng</Text>
                        </View>
                        <View style={styles.planPriceRow}>
                            <Text style={styles.planPrice}>59.000đ</Text>
                            <Text style={styles.planDuration}>/tháng</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* QUYỀN LỢI */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quyền lợi đặc biệt</Text>
                    <View style={styles.benefitItem}>
                        <Ionicons name="rocket" size={20} color="#0284C7" style={{marginRight: 10}} />
                        <Text style={styles.benefitText}>Freeship hỏa tốc mọi đơn hàng</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="construct" size={20} color="#16A34A" style={{marginRight: 10}} />
                        <Text style={styles.benefitText}>Bảo hành tận nhà 24/7</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="gift" size={20} color="#9333EA" style={{marginRight: 10}} />
                        <Text style={styles.benefitText}>Quà tặng sinh nhật trị giá 1 triệu</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalLabel}>Thanh toán qua QR</Text>
                    <Text style={styles.totalPrice}>{selectedPlan === 'year' ? '499.000đ' : '59.000đ'}</Text>
                </View>
                <TouchableOpacity style={styles.upgradeBtn} onPress={handlePayment}>
                    <Text style={styles.upgradeBtnText}>THANH TOÁN NGAY</Text>
                    <Ionicons name="qr-code" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// ... (Giữ nguyên phần styles như cũ, không thay đổi)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#102A43' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    backBtn: { padding: 8 },
    cardContainer: { backgroundColor: '#102A43', paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    vipCard: { backgroundColor: '#1E3A8A', borderRadius: 20, padding: 25, marginTop: 10, height: 180, justifyContent: 'space-between', overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', elevation: 10 },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardBrand: { color: '#F59E0B', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
    cardSlogan: { color: '#BFDBFE', fontSize: 14, marginTop: -20 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    memberName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    memberId: { color: '#93C5FD', fontSize: 12 },
    circleDecor1: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' },
    circleDecor2: { position: 'absolute', bottom: -50, left: -20, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.05)' },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43', marginBottom: 15 },
    planCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 2, borderColor: '#E2E8F0' },
    activePlan: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#2563EB', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' },
    planName: { fontSize: 16, fontWeight: 'bold', color: '#102A43', flex: 1 },
    saveBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    saveText: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
    planPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginLeft: 30 },
    planPrice: { fontSize: 24, fontWeight: 'bold', color: '#2563EB' },
    planDuration: { fontSize: 14, color: '#64748B', marginLeft: 2 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#fff', padding: 12, borderRadius: 10 },
    benefitText: { color: '#334E68', fontWeight: '500' },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 20 },
    totalLabel: { fontSize: 12, color: '#64748B' },
    totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#102A43' },
    upgradeBtn: { backgroundColor: '#F59E0B', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 30, flexDirection: 'row', alignItems: 'center', shadowColor: '#F59E0B', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
    upgradeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginRight: 8 }
});

export default VipRegisterScreen;