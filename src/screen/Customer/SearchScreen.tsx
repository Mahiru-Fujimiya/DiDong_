import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. DỮ LIỆU SẢN PHẨM MẪU (Tech Store)
const ALL_PRODUCTS = [
    { id: '1', name: 'MacBook Air M2 2023', price: 24500000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500', breed: 'Laptop' },
    { id: '2', name: 'iPhone 15 Pro Max Titanium', price: 34990000, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500', breed: 'Điện thoại' },
    { id: '3', name: 'Sony WH-1000XM5', price: 6490000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', breed: 'Âm thanh' },
    { id: '4', name: 'iPad Pro M2 11 inch', price: 19500000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', breed: 'Tablet' },
    { id: '5', name: 'Samsung S24 Ultra', price: 29990000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', breed: 'Điện thoại' },
    { id: '6', name: 'Apple Watch Ultra 2', price: 21000000, image: 'https://images.unsplash.com/photo-1434493789847-2f02ea6ca920?w=500', breed: 'Đồng hồ' },
    { id: '7', name: 'Bàn phím Keychron K2', price: 1850000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', breed: 'Phụ kiện' },
    { id: '8', name: 'Chuột Logitech MX Master 3S', price: 2100000, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', breed: 'Phụ kiện' },
    { id: '9', name: 'Laptop Gaming ASUS ROG', price: 32000000, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', breed: 'Laptop' },
    { id: '10', name: 'Loa Marshall Stanmore III', price: 9500000, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', breed: 'Âm thanh' },
];

const SearchScreen = ({ navigation }: any) => {
    const [keyword, setKeyword] = useState('');

    // Logic lọc sản phẩm
    const filteredProducts = ALL_PRODUCTS.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.breed.toLowerCase().includes(keyword.toLowerCase())
    );

    const renderProductItem = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.resultItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProductDetail', { product: item, allProducts: ALL_PRODUCTS })}
        >
            <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                style={styles.productImage} 
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.tagContainer}>
                    <Text style={styles.productBreed}>{item.breed}</Text>
                </View>
                <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* SEARCH HEADER */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#627D98" />
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm Laptop, iPhone, Phụ kiện..."
                        value={keyword}
                        onChangeText={setKeyword}
                        autoFocus={false}
                        placeholderTextColor="#9AA5B1"
                    />
                    {keyword.length > 0 && (
                        <TouchableOpacity onPress={() => setKeyword('')}>
                            <Ionicons name="close-circle" size={18} color="#CBD5E0" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 10}}>
                    <Text style={styles.cancelText}>Đóng</Text>
                </TouchableOpacity>
            </View>

            {/* BODY KẾT QUẢ */}
            <View style={styles.body}>
                {keyword.length === 0 ? (
                    // Trạng thái chưa nhập gì
                    <View style={styles.emptyContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="search-outline" size={50} color="#CBD5E0" />
                        </View>
                        <Text style={styles.emptyTitle}>Tìm kiếm sản phẩm</Text>
                        <Text style={styles.emptyText}>Nhập tên thiết bị bạn đang tìm kiếm...</Text>
                    </View>
                ) : filteredProducts.length > 0 ? (
                    // Có kết quả
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={item => item.id}
                        renderItem={renderProductItem}
                        contentContainerStyle={{ padding: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    // Không tìm thấy
                    <View style={styles.emptyContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="file-tray-outline" size={50} color="#CBD5E0" />
                        </View>
                        <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
                        <Text style={styles.emptyText}>Thử từ khóa khác như "MacBook", "Sony"...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 15, 
        height: 45,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#102A43' },
    cancelText: { color: '#2563EB', fontSize: 15, fontWeight: '600' },

    body: { flex: 1, backgroundColor: '#fff' },
    
    // Empty State
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
    iconCircle: { 
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4F8', 
        justifyContent: 'center', alignItems: 'center', marginBottom: 20 
    },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43', marginBottom: 5 },
    emptyText: { color: '#627D98', fontSize: 14 },
    
    // Product Item
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F4F8',
        // Shadow
        elevation: 2,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    productImage: { width: 65, height: 65, borderRadius: 8, marginRight: 15, backgroundColor: '#F0F4F8' },
    productInfo: { flex: 1 },
    productName: { fontSize: 15, fontWeight: 'bold', color: '#102A43', marginBottom: 4 },
    
    tagContainer: { 
        backgroundColor: '#EFF6FF', alignSelf: 'flex-start', 
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 
    },
    productBreed: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
    
    productPrice: { fontSize: 15, fontWeight: 'bold', color: '#2563EB' } // Giá màu xanh
});

export default SearchScreen;