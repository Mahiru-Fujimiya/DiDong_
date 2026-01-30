import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 👇 1. IMPORT CÁC HOOK QUAN TRỌNG
import { useNavigation } from '@react-navigation/native'; // Tự động lấy quyền điều hướng
import { useCart } from '../context/CartContext';        // Lấy hàm thêm giỏ hàng

// Dữ liệu giả lập
const FLASH_SALE_ITEMS = [
    { 
        id: 'fs1', 
        name: 'Chuột Gaming Logitech G304', 
        price: 450000, 
        oldPrice: 900000, 
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 
        sold: 85,
        rating: 4.8,
        breed: 'Phụ kiện' 
    },
    { 
        id: 'fs2', 
        name: 'Tai nghe Sony WH-1000XM5', 
        price: 5200000, 
        oldPrice: 6500000, 
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', 
        sold: 40,
        rating: 5.0,
        breed: 'Âm thanh'
    },
    { 
        id: 'fs3', 
        name: 'Sạc dự phòng Anker 20W', 
        price: 300000, 
        oldPrice: 600000, 
        image: 'https://images.unsplash.com/photo-1609592424369-a937a09c39cc?w=500', 
        sold: 92,
        rating: 4.9,
        breed: 'Phụ kiện'
    },
    { 
        id: 'fs4', 
        name: 'Phím cơ Keychron K2 Pro', 
        price: 1800000, 
        oldPrice: 2200000, 
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', 
        sold: 15,
        rating: 4.7,
        breed: 'Phụ kiện'
    },
];

const FlashSale = () => {
    // 👇 2. KHỞI TẠO HOOK
    const navigation = useNavigation<any>(); 
    const { addToCart } = useCart();

    const [timeLeft, setTimeLeft] = useState(7200); 

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    };

    // 👇 HÀM XỬ LÝ MUA NHANH
    const handleQuickBuy = (item: any) => {
        addToCart(item);
        Alert.alert("Đã thêm", `Đã thêm ${item.name} vào giỏ!`);
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            // 👉 Bấm vào card thì xem chi tiết
            onPress={() => navigation.navigate('ProductDetail', { 
                product: item,
                allProducts: FLASH_SALE_ITEMS 
            })}
        >
            <View style={styles.discountBadge}><Text style={styles.discountText}>-50%</Text></View>
            
            <Image source={{ uri: item.image }} style={styles.img} />
            
            <View style={{alignItems: 'flex-start', width: '100%'}}>
                <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
                <Text style={styles.oldPrice}>{item.oldPrice.toLocaleString()}đ</Text>
            </View>

            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: `${item.sold}%` }]} />
                <Text style={styles.soldText}>Đã bán {item.sold}</Text>
                <View style={styles.fireIcon}>
                    <Ionicons name="flame" size={10} color="#fff" />
                </View>
            </View>

            {/* 👇 NÚT ADD TO CART TRỰC TIẾP */}
            <TouchableOpacity 
                style={styles.addCartBtn} 
                onPress={() => handleQuickBuy(item)}
            >
                <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>

        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.title}>FLASH SALE</Text>
                    <View style={styles.timerBox}>
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
                    <Text style={styles.seeAll}>Xem tất cả {'>'}</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList 
                data={FLASH_SALE_ITEMS}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 15, backgroundColor: '#fff', paddingVertical: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 15, alignItems: 'center' },
    
    title: { fontSize: 20, fontWeight: '900', color: '#EF4444', fontStyle: 'italic', letterSpacing: 0.5 },
    timerBox: { backgroundColor: '#102A43', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 10 },
    timerText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    seeAll: { color: '#627D98', fontSize: 13, fontWeight: '500' },
    
    // Card Style
    card: { 
        width: 140, marginRight: 12, alignItems: 'center', 
        backgroundColor: '#fff', borderRadius: 12, padding: 8, 
        borderWidth: 1, borderColor: '#F0F4F8',
        position: 'relative' // Để đặt nút AddCart tuyệt đối
    },
    img: { width: 120, height: 120, borderRadius: 8, backgroundColor: '#F0F4F8', marginBottom: 8 },
    
    discountBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderTopRightRadius: 8, borderBottomLeftRadius: 8, zIndex: 1 },
    discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    
    price: { fontSize: 15, fontWeight: 'bold', color: '#EF4444' },
    oldPrice: { fontSize: 11, color: '#94A3B8', textDecorationLine: 'line-through', marginBottom: 6 },
    
    // Progress Bar
    progressBarBg: { width: '100%', height: 16, backgroundColor: '#FFEDD5', borderRadius: 10, overflow: 'hidden', justifyContent: 'center', position: 'relative' },
    progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#EF4444' },
    soldText: { fontSize: 9, color: '#fff', textAlign: 'center', fontWeight: 'bold', zIndex: 2, width: '100%', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 1 },
    fireIcon: { position: 'absolute', left: 4, zIndex: 3 },

    // Nút Add Cart mới
    addCartBtn: {
        position: 'absolute',
        top: 85, // Vị trí góc ảnh
        right: 5,
        backgroundColor: '#2563EB',
        width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center',
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.2
    }
});

export default FlashSale;