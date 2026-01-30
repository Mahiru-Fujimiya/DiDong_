import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
    const { login, isLoading } = useAuth();

    // Tài khoản test mặc định cho Tech Store
    const [email, setEmail] = useState('admin@techstore.vn');
    const [password, setPassword] = useState('123456');

    const handleLogin = async () => {
        if (email.trim().length === 0 || password.trim().length === 0) {
            Alert.alert('Thông báo', 'Vui lòng nhập Email và Mật khẩu!');
            return;
        }

        const success = await login(email, password);

        if (success) {
            console.log("⚡ [Tech Store] Đăng nhập thành công!");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* --- HEADER TECH STORE --- */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        {/* 👇 Đổi icon thú cưng thành Laptop */}
                        <Ionicons name="laptop-outline" size={50} color="#FF9F1C" />
                    </View>
                    <Text style={styles.logoText}>TECH STORE</Text>
                    <Text style={styles.subText}>Công nghệ đỉnh cao - Trải nghiệm tuyệt vời</Text>
                </View>

                {/* --- FORM ĐĂNG NHẬP --- */}
                <View style={styles.form}>
                    <Text style={styles.label}>Tài khoản</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#A0AEC0" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email hoặc số điện thoại"
                            placeholderTextColor="#CBD5E0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#A0AEC0" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#CBD5E0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Quên mật khẩu */}
                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Nút Đăng nhập */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                        )}
                    </TouchableOpacity>

                    {/* Chuyển sang Đăng ký */}
                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerTouch}>
                        <View style={styles.registerContainer}>
                            <Text style={{ color: '#718096' }}>Chưa có tài khoản? </Text>
                            <Text style={styles.registerText}>Đăng ký ngay</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' }, // Nền xám xanh nhạt hơn
    scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 25 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 100, height: 100, backgroundColor: '#FFF',
        borderRadius: 25,
        justifyContent: 'center', alignItems: 'center', marginBottom: 15,
        // 👇 Bóng màu xanh
        elevation: 5, shadowColor: '#2563EB', shadowOpacity: 0.15, shadowRadius: 10
    },
    logoText: { fontSize: 30, fontWeight: 'bold', color: '#102A43', letterSpacing: 1 },
    subText: { fontSize: 14, color: '#627D98', marginTop: 5, fontWeight: '500' },
    form: { width: '100%' },
    label: { fontWeight: '600', marginBottom: 8, color: '#334E68', fontSize: 14 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 12, borderWidth: 1, borderColor: '#D9E2EC', marginBottom: 20, paddingHorizontal: 15,
        height: 55, elevation: 1
    },
    icon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#102A43' },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 25 },
    // 👇 Chữ màu xanh
    forgotText: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },
    button: {
        // 👇 Nút nền xanh
        height: 55, backgroundColor: '#2563EB', borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
        // 👇 Bóng nút xanh
        shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    registerTouch: { marginTop: 25 },
    registerContainer: { flexDirection: 'row', justifyContent: 'center' },
    // 👇 Chữ đăng ký xanh
    registerText: { color: '#2563EB', fontWeight: 'bold' }
});

export default LoginScreen;