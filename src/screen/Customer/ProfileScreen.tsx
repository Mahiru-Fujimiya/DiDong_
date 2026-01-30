import React, { useState } from 'react';
import { 
    View, Text, FlatList, StyleSheet, StatusBar, Image, 
    TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// 👇 1. IMPORT THƯ VIỆN CHỌN ẢNH
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const { orders } = useCart();
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();

    // --- STATE QUẢN LÝ THÔNG TIN ---
    const [isModalVisible, setModalVisible] = useState(false);
    const [tempName, setTempName] = useState(user?.name || 'Sen Công Nghệ');
    const [tempPhone, setTempPhone] = useState('090 123 4567');
    const [tempAddress, setTempAddress] = useState('Quận 1, TP. Hồ Chí Minh');

    // --- STATE QUẢN LÝ ẢNH ---
    const [avatarUri, setAvatarUri] = useState('https://ui-avatars.com/api/?name=' + tempName + '&background=0D8ABC&color=fff&size=200');
    const [isPreviewVisible, setPreviewVisible] = useState(false);

    // 👇 2. HÀM CHỌN ẢNH TỪ BỘ NHỚ
    const pickImage = async () => {
        // Yêu cầu quyền truy cập (thường Expo tự xử lý, nhưng gọi cho chắc)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Cấp quyền', 'Sen cần cấp quyền truy cập thư viện ảnh để đổi Avatar nhé!');
            return;
        }

        // Mở thư viện ảnh
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Cho phép cắt ảnh
            aspect: [1, 1],      // Cắt hình vuông
            quality: 1,
        });

        if (!result.canceled) {
            // Cập nhật đường dẫn ảnh mới
            setAvatarUri(result.assets[0].uri);
            Alert.alert("Thành công", "Đã cập nhật ảnh đại diện mới từ điện thoại! 📸");
        }
    };

    // 👇 3. SỬA LOGIC KHI BẤM VÀO AVATAR
    const handleAvatarPress = () => {
        Alert.alert(
            "Cập nhật Avatar",
            "Bạn muốn làm gì với ảnh đại diện?",
            [
                { text: "Xem ảnh", onPress: () => setPreviewVisible(true) },
                { 
                    text: "Chọn từ thư viện", 
                    onPress: pickImage // Gọi hàm chọn ảnh ở đây
                },
                { text: "Hủy", style: "cancel" }
            ]
        );
    };

    const handleSaveInfo = () => {
        if (tempName.trim() === "") {
            Alert.alert("Lỗi", "Vui lòng nhập họ tên!");
            return;
        }
        Alert.alert("Thành công", "Hồ sơ cá nhân đã được cập nhật!");
        setModalVisible(false);
    };

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi Tech Store?", [
            { text: "Ở lại", style: "cancel" },
            { text: "Đăng xuất", onPress: logout, style: 'destructive' }
        ]);
    };

    const renderOrderItem = ({ item }: any) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
                <Text style={[styles.statusTag, { 
                    backgroundColor: (item.status === 'Đã giao' || item.status === 'Thành công') ? '#D1FAE5' : '#DBEAFE',
                    color: (item.status === 'Đã giao' || item.status === 'Thành công') ? '#059669' : '#2563EB'
                }]}>
                    {item.status || 'Hoàn thành'}
                </Text>
            </View>
            <Text style={styles.orderDate}>{item.date}</Text>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                <Text style={styles.orderTotal}>{item.total.toLocaleString()}₫</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            <FlatList
                data={orders.slice(0, 3)}
                keyExtractor={item => item.id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.profileHeader}>
                        {/* 1. HEADER PROFILE */}
                        <View style={styles.userInfo}>
                            <TouchableOpacity 
                                activeOpacity={0.8} 
                                onPress={handleAvatarPress}
                                style={styles.avatarWrapper}
                            >
                                <View style={styles.avatarContainer}>
                                    {/* Ảnh đại diện */}
                                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                </View>
                                <View style={styles.cameraIconBadge}>
                                    <Ionicons name="camera" size={12} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.userText}>
                                <Text style={styles.userName}>{tempName}</Text>
                                <View style={styles.roleBadge}>
                                    <Ionicons name="diamond" size={10} color="#fff" style={{marginRight: 4}} />
                                    <Text style={styles.userRole}>Gold Member</Text>
                                </View>
                            </View>
                        </View>

                        {/* 2. BANNER VIP */}
                        <TouchableOpacity 
                            style={styles.vipBanner} 
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('VipRegister')}
                        >
                            <View style={styles.vipContent}>
                                <View style={styles.vipIconBox}>
                                    <Ionicons name="diamond" size={24} color="#F59E0B" />
                                </View>
                                <View style={{marginLeft: 12, flex: 1}}>
                                    <Text style={styles.vipTitle}>Đăng ký Tech VIP</Text>
                                    <Text style={styles.vipDesc}>Nhận Freeship & Ưu đãi đặc biệt</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#BFDBFE" />
                            </View>
                            <View style={styles.vipDecor} />
                        </TouchableOpacity>

                        {/* 3. CARD THÔNG TIN */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Text style={styles.infoTitle}>Thông tin cá nhân</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={styles.editText}>Sửa</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <InfoLine icon="mail-outline" label="Email" value={user?.email || 'admin@techstore.vn'} />
                            <InfoLine icon="call-outline" label="Điện thoại" value={tempPhone} />
                            <InfoLine icon="location-outline" label="Địa chỉ" value={tempAddress} />
                        </View>

                        {/* 4. MENU KHÁC */}
                        <Text style={styles.sectionTitle}>Đơn mua</Text>
                        <View style={styles.statusBox}>
                            <StatusItem icon="wallet-outline" label="Chờ xử lý" onPress={() => navigation.navigate('OrderHistory')} />
                            <StatusItem icon="cube-outline" label="Vận chuyển" onPress={() => navigation.navigate('OrderHistory')} />
                            <StatusItem icon="checkmark-circle-outline" label="Đã giao" onPress={() => navigation.navigate('OrderHistory')} />
                            <StatusItem icon="star-outline" label="Đánh giá" onPress={() => navigation.navigate('OrderHistory')} />
                        </View>

                        <View style={styles.menuGroup}>
                            <MenuOption icon="settings-outline" label="Cài đặt tài khoản" color="#102A43" />
                            <MenuOption icon="shield-checkmark-outline" label="Trung tâm bảo mật" color="#102A43" />
                            <MenuOption icon="help-circle-outline" label="Hỗ trợ khách hàng" color="#102A43" />
                            <MenuOption icon="log-out-outline" label="Đăng xuất" color="#EF4444" onPress={handleLogout} isLast />
                        </View>

                        <Text style={styles.historyTitle}>Đơn hàng gần đây</Text>
                    </View>
                }
            />

            {/* MODAL PREVIEW */}
            <Modal visible={isPreviewVisible} transparent={true} animationType="fade">
                <View style={styles.previewOverlay}>
                    <TouchableOpacity style={styles.closePreview} onPress={() => setPreviewVisible(false)}>
                        <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: avatarUri }} style={styles.fullImage} resizeMode="contain" />
                </View>
            </Modal>

            {/* MODAL EDIT INFO */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.inputLabel}>Họ và tên</Text>
                        <TextInput style={styles.input} value={tempName} onChangeText={setTempName} placeholder="Nhập họ tên" />
                        <Text style={styles.inputLabel}>Số điện thoại</Text>
                        <TextInput style={styles.input} value={tempPhone} onChangeText={setTempPhone} keyboardType="phone-pad" />
                        <Text style={styles.inputLabel}>Địa chỉ nhận hàng</Text>
                        <TextInput style={styles.input} value={tempAddress} onChangeText={setTempAddress} multiline />
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveInfo}>
                            <Text style={styles.saveBtnText}>LƯU THÔNG TIN</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- COMPONENTS & STYLES ---
// (Giữ nguyên phần components con và styles như cũ để code gọn)
const InfoLine = ({ icon, label, value }: any) => (
    <View style={styles.infoRow}>
        <View style={styles.iconBox}><Ionicons name={icon} size={16} color="#2563EB" /></View>
        <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
        </View>
    </View>
);

const StatusItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.statusItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#627D98" />
        <Text style={styles.statusText}>{label}</Text>
    </TouchableOpacity>
);

const MenuOption = ({ icon, label, color, onPress, isLast }: any) => (
    <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.menuText, { color: color === '#EF4444' ? '#EF4444' : '#102A43' }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    listContent: { paddingBottom: 100 },
    profileHeader: { padding: 20, paddingTop: 10 },
    userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatarWrapper: { position: 'relative' },
    avatarContainer: { elevation: 4, shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 5, borderWidth: 2, borderColor: '#fff', borderRadius: 40 },
    avatar: { width: 75, height: 75, borderRadius: 37.5 },
    cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2563EB', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    userText: { marginLeft: 15 },
    userName: { fontSize: 20, fontWeight: 'bold', color: '#102A43' },
    roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4 },
    userRole: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    vipBanner: { backgroundColor: '#102A43', borderRadius: 16, padding: 15, marginBottom: 20, position: 'relative', overflow: 'hidden', elevation: 5, shadowColor: '#102A43', shadowOpacity: 0.4, shadowRadius: 5 },
    vipContent: { flexDirection: 'row', alignItems: 'center', position: 'relative', zIndex: 1 },
    vipIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    vipTitle: { fontSize: 16, fontWeight: 'bold', color: '#F59E0B' },
    vipDesc: { fontSize: 12, color: '#BFDBFE', marginTop: 2 },
    vipDecor: { position: 'absolute', right: -20, bottom: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)' },
    infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 20, elevation: 1 },
    infoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#102A43' },
    editText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconBox: { width: 30, height: 30, backgroundColor: '#EFF6FF', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    infoLabel: { fontSize: 11, color: '#627D98' },
    infoValue: { fontSize: 14, color: '#102A43', fontWeight: '500' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#102A43' },
    statusBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 20, elevation: 1 },
    statusItem: { alignItems: 'center', flex: 1 },
    statusText: { fontSize: 11, color: '#486581', marginTop: 6 },
    menuGroup: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, marginBottom: 25, elevation: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F4F8' },
    menuText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '500' },
    historyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#102A43' },
    orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, marginHorizontal: 20, elevation: 1 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    orderId: { fontWeight: 'bold', fontSize: 13, color: '#102A43' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 11, fontWeight: 'bold', overflow: 'hidden' },
    orderDate: { color: '#94A3B8', fontSize: 11 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
    totalLabel: { color: '#64748B', fontSize: 13 },
    orderTotal: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },
    previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: width, height: width },
    closePreview: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
    inputLabel: { fontSize: 13, color: '#486581', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#F0F4F8', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, color: '#102A43' },
    saveBtn: { backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ProfileScreen;