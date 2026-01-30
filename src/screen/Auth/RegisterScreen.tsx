import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
    // Lấy hàm register và biến loading từ Context
    const { register, isLoading } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        // 1. Validate dữ liệu đầu vào
        if (!fullName || !email || !password || !phone) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin để tạo tài khoản Tech Store!');
            return;
        }

        // Kiểm tra định dạng email đơn giản
        if (!email.includes('@')) {
            Alert.alert('Lỗi', 'Email không hợp lệ!');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi mật khẩu', 'Mật khẩu xác nhận không khớp!');
            return;
        }

        // 2. Gọi hàm đăng ký từ AuthContext
        // Lưu ý: Hàm register trong Context nhận (name, email, password)
        const success = await register(fullName, email, password);

        if (success) {
            console.log("⚡ [Tech Store] Đăng ký thành công!");
            // Không cần navigate thủ công vì AuthContext sẽ tự chuyển màn hình khi user khác null
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                
                {/* Nút Quay lại */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#102A43" />
                </TouchableOpacity>

                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        {/* Icon Thêm người dùng */}
                        <Ionicons name="person-add-outline" size={40} color="#2563EB" />
                    </View>
                    <Text style={styles.title}>Đăng ký tài khoản</Text>
                    <Text style={styles.subTitle}>Trải nghiệm mua sắm công nghệ đỉnh cao</Text>
                </View>

                {/* --- FORM --- */}
                <View style={styles.form}>
                    
                    {/* Họ tên */}
                    <Text style={styles.label}>Họ và tên</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="person-outline" size={20} color="#627D98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập họ tên của bạn"
                            placeholderTextColor="#9AA5B1"
                            value={fullName} onChangeText={setFullName}
                        />
                    </View>

                    {/* Email */}
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="mail-outline" size={20} color="#627D98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="example@techstore.vn"
                            placeholderTextColor="#9AA5B1"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email} onChangeText={setEmail}
                        />
                    </View>

                    {/* Số điện thoại */}
                    <Text style={styles.label}>Số điện thoại</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="call-outline" size={20} color="#627D98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số điện thoại"
                            placeholderTextColor="#9AA5B1"
                            keyboardType="phone-pad"
                            value={phone} onChangeText={setPhone}
                        />
                    </View>

                    {/* Mật khẩu */}
                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="lock-closed-outline" size={20} color="#627D98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Tối thiểu 6 ký tự"
                            placeholderTextColor="#9AA5B1"
                            secureTextEntry
                            value={password} onChangeText={setPassword}
                        />
                    </View>

                    {/* Nhập lại mật khẩu */}
                    <Text style={styles.label}>Xác nhận mật khẩu</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#627D98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu trên"
                            placeholderTextColor="#9AA5B1"
                            secureTextEntry
                            value={confirmPassword} onChangeText={setConfirmPassword}
                        />
                    </View>

                    {/* Nút Đăng ký */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer chuyển sang Đăng nhập */}
                    <View style={styles.loginLink}>
                        <Text style={{ color: '#627D98' }}>Bạn đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' }, // Nền xám xanh nhạt
    scrollContainer: { padding: 25, paddingTop: 20, paddingBottom: 50 },
    
    backButton: { 
        marginBottom: 10, alignSelf: 'flex-start', padding: 5 
    },
    
    header: { alignItems: 'center', marginBottom: 30 },
    logoCircle: {
        width: 80, height: 80, backgroundColor: '#FFF',
        borderRadius: 20, // Bo góc kiểu công nghệ
        justifyContent: 'center', alignItems: 'center', marginBottom: 15,
        // Bóng đổ xanh
        elevation: 5, shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 8
    },
    title: { fontSize: 26, fontWeight: 'bold', color: '#102A43', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#627D98', textAlign: 'center' },
    
    form: { width: '100%' },
    label: { fontWeight: '600', marginBottom: 6, color: '#334E68', fontSize: 14 },
    
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 12, borderWidth: 1, borderColor: '#D9E2EC', marginBottom: 15, paddingHorizontal: 15,
        height: 52, 
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.05
    },
    icon: { marginRight: 10 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#102A43' },
    
    button: {
        height: 55, backgroundColor: '#2563EB', borderRadius: 12, // Màu xanh dương đậm
        justifyContent: 'center', alignItems: 'center', marginTop: 15,
        elevation: 4, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    
    loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, marginBottom: 20 },
    linkText: { color: '#2563EB', fontWeight: 'bold', fontSize: 15 }
});

export default RegisterScreen;