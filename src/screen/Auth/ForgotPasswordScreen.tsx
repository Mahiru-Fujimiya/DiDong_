import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ActivityIndicator, Keyboard, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; 

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    const { loginSuccess } = useAuth();

    // --- XỬ LÝ GỬI MÃ OTP ---
    const handleSendOTP = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ!');
            return;
        }
        setIsLoading(true);
        Keyboard.dismiss(); 

        setTimeout(() => {
            setIsLoading(false);
            // Tạo mã ngẫu nhiên 6 số
            const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(randomCode);
            setStep(2);

            // 🔔 Thông báo phong cách Tech
            Alert.alert(
                '📩 Mã xác thực Tech Store',
                `Mã bảo mật OTP của bạn là: ${randomCode}`,
                [{ text: 'Sao chép mã' }]
            );
        }, 1500);
    };

    // --- XỬ LÝ XÁC THỰC MÃ OTP ---
    const handleVerifyOTP = () => {
        if (otpInput === generatedOtp) {
            Alert.alert(
                '✅ Xác thực thành công',
                'Chào mừng bạn quay trở lại Tech Store! Đang đăng nhập...',
                [{ 
                    text: 'Vào mua sắm ngay 🚀', 
                    onPress: () => {
                        // 👇 ĐĂNG NHẬP THẲNG với thông tin Tech Store
                        loginSuccess({ 
                            id: Date.now(),
                            email: phoneNumber + '@techstore.vn', 
                            name: 'Khách hàng Tech',
                            role: 'USER',
                            // Avatar robot công nghệ
                            avatar: 'https://ui-avatars.com/api/?name=Tech+User&background=0D8ABC&color=fff&size=150'
                        });
                    } 
                }]
            );
        } else {
            Alert.alert('❌ Sai mã OTP', 'Mã xác thực không đúng. Vui lòng kiểm tra lại tin nhắn!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Nút Quay lại */}
            <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#2D3748" />
            </TouchableOpacity>

            <View style={styles.header}>
                {/* 👇 Đổi icon chân chó thành CHIP ĐIỆN TỬ */}
                <View style={styles.iconCircle}>
                    <Ionicons name="hardware-chip" size={42} color="#FF9F1C" />
                </View>
                <Text style={styles.title}>Quên mật khẩu?</Text>
                <Text style={styles.subTitle}>
                    {step === 1
                        ? 'Nhập số điện thoại gắn với tài khoản Tech Store để lấy lại mật khẩu.'
                        : `Vui lòng nhập mã OTP 6 số vừa gửi tới: ${phoneNumber}`}
                </Text>
            </View>

            <View style={styles.form}>
                {/* BƯỚC 1: NHẬP SỐ ĐIỆN THOẠI */}
                {step === 1 && (
                    <>
                        <View style={styles.inputContainer}>
                            <Ionicons name="phone-portrait-outline" size={20} color="#A0AEC0" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Số điện thoại đăng ký"
                                placeholderTextColor="#A0AEC0"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSendOTP}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.btnText}>GỬI MÃ XÁC THỰC</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {/* BƯỚC 2: NHẬP MÃ OTP */}
                {step === 2 && (
                    <>
                        <View style={[styles.inputContainer, styles.otpContainerActive]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#FF9F1C" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.otpInput]}
                                placeholder="- - - - - -"
                                placeholderTextColor="#CBD5E0"
                                value={otpInput}
                                onChangeText={setOtpInput}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus={true}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                            <Text style={styles.btnText}>XÁC NHẬN & ĐĂNG NHẬP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.resendBtn}
                            onPress={() => { setStep(1); setOtpInput(''); }}
                        >
                            <Text style={styles.resendText}>
                                Nhập sai số? <Text style={styles.resendLink}>Thay đổi số điện thoại</Text>
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FAFC', paddingHorizontal: 25 }, // Nền xám nhạt hiện đại
    iconBack: { marginTop: 10, marginBottom: 10, padding: 5 },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    iconCircle: {
        width: 80, height: 80, backgroundColor: '#FFF', // Nền trắng nổi bật
        borderRadius: 25, // Bo góc vuông nhẹ kiểu công nghệ (thay vì tròn xoe)
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        elevation: 5, shadowColor: '#FF9F1C', shadowOpacity: 0.2, shadowRadius: 10
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginBottom: 10 },
    subTitle: { color: '#718096', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
    form: { width: '100%' },
    inputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF',
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#E2E8F0', 
        marginBottom: 20, 
        paddingHorizontal: 15,
        height: 55,
        elevation: 1
    },
    otpContainerActive: {
        borderColor: '#FF9F1C',
        backgroundColor: '#FFF'
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#2D3748', fontWeight: '500' },
    otpInput: {
        letterSpacing: 8, // Giãn cách số rộng ra cho dễ nhìn
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center'
    },
    button: {
        height: 55, 
        backgroundColor: '#FF9F1C', 
        borderRadius: 12,
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10,
        elevation: 3, 
        shadowColor: '#FF9F1C', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 5
    },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    resendBtn: { marginTop: 30, alignItems: 'center' },
    resendText: { color: '#718096', fontSize: 14 },
    resendLink: { color: '#FF9F1C', fontWeight: 'bold' }
});

export default ForgotPasswordScreen;