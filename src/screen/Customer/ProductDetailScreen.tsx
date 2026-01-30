import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useFavorite } from '../../context/FavoriteContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
    // 1. Nhận dữ liệu
    const { product, allProducts = [] } = route.params || {}; 
    const { addToCart, cart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorite();
    
    // 2. LOGIC GỢI Ý (AI Recommendation)
    const suggestedProducts = useMemo(() => {
        if (!allProducts || allProducts.length === 0) return [];

        // Lấy từ khóa dựa trên Tên hoặc Danh mục (Breed)
        const rawKeyword = product?.breed || product?.name || "";
        const keyword = rawKeyword.split(' ')[0].toLowerCase();

        const related = allProducts.filter((item: any) => {
            if (!item || item.id === product?.id) return false;
            const itemBreed = (item?.breed || "").toLowerCase();
            const itemName = (item?.name || "").toLowerCase();
            return itemBreed.includes(keyword) || itemName.includes(keyword);
        });

        const others = allProducts.filter((item: any) => 
            item?.id !== product?.id && !related.find((r: any) => r.id === item.id)
        ).sort(() => 0.5 - Math.random());

        return [...related, ...others].slice(0, 10);
    }, [product?.id, allProducts]);

    if (!product) return null;

    // Xử lý ảnh (Link online hoặc local)
    const imageSource = typeof product.image === 'string' ? { uri: product.image } : product.image;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* HEADER TRONG SUỐT */}
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => toggleFavorite(product)} style={[styles.circleBtn, { marginRight: 12 }]}>
                        <Ionicons 
                            name={isFavorite(product.id) ? "heart" : "heart-outline"} 
                            size={24} 
                            color={isFavorite(product.id) ? "#EF4444" : "#fff"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'CartTab' })} style={styles.circleBtn}>
                        <Ionicons name="cart-outline" size={24} color="#fff" />
                        {cart.length > 0 && (
                            <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* ẢNH SẢN PHẨM */}
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.image} resizeMode="cover" />
                    <View style={styles.overlay} />
                </View>

                <View style={styles.content}>
                    {/* GIÁ & TÊN */}
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.price}>{product.price.toLocaleString('vi-VN')}đ</Text>
                            <View style={styles.tagContainer}>
                                <Ionicons name="shield-checkmark" size={12} color="#fff" style={{marginRight: 4}} />
                                <Text style={styles.tagText}>Chính hãng 100%</Text>
                            </View>
                        </View>
                        <View style={styles.ratingBox}>
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingNum}>{product.rating || '5.0'}</Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{product.name}</Text>
                    
                    {/* 👇 NÚT SO SÁNH (MỚI THÊM) */}
                    <TouchableOpacity 
                        style={styles.compareBtn} 
                        onPress={() => navigation.navigate('Compare', { 
                            product1: product, 
                            product2: null // Để null, màn hình Compare sẽ tự lấy demo hoặc cho chọn sp khác
                        })}
                    >
                        <Ionicons name="git-compare-outline" size={20} color="#2563EB" />
                        <Text style={styles.compareText}>So sánh cấu hình</Text>
                    </TouchableOpacity>

                    {/* --- ĐÁNH GIÁ & REVIEW --- */}
                    <TouchableOpacity 
                        style={styles.reviewSection}
                        onPress={() => navigation.navigate('StoreReviewScreen', { product: product, showHistory: true })}
                    >
                        <View style={styles.reviewLeft}>
                            <View style={styles.reviewAvatars}>
                                <View style={[styles.avatarDot, {backgroundColor: '#FF5733'}]} />
                                <View style={[styles.avatarDot, {backgroundColor: '#33FF57', marginLeft: -8}]} />
                                <View style={[styles.avatarDot, {backgroundColor: '#3357FF', marginLeft: -8}]} />
                            </View>
                            <Text style={styles.reviewText}>Xem 128 đánh giá</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#627D98" />
                    </TouchableOpacity>

                    <View style={styles.divider} />
                    
                    {/* --- MÔ TẢ SẢN PHẨM --- */}
                    <Text style={styles.sectionTitle}>Đặc điểm nổi bật</Text>
                    <Text style={styles.descContent}>
                        Sản phẩm thuộc dòng {product.breed} cao cấp. 
                        Thiết kế hiện đại, hiệu năng mạnh mẽ đáp ứng mọi nhu cầu công việc và giải trí. 
                        {"\n\n"}
                        ✅ Bảo hành chính hãng 12 tháng.
                        {"\n"}
                        ✅ Lỗi 1 đổi 1 trong 30 ngày.
                        {"\n"}
                        ✅ Hỗ trợ kỹ thuật trọn đời tại Tech Store.
                    </Text>

                    {/* --- GỢI Ý --- */}
                    <View style={styles.similarSection}>
                        <View style={styles.similarHeader}>
                            <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'SearchTab' })}>
                                <Text style={styles.seeMoreText}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {suggestedProducts.map((item: any) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    activeOpacity={0.8}
                                    style={styles.similarCard}
                                    onPress={() => navigation.push('ProductDetail', { 
                                        product: item, 
                                        allProducts: allProducts 
                                    })}
                                >
                                    <Image 
                                        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                                        style={styles.similarImg} 
                                    />
                                    <View style={styles.similarInfo}>
                                        <Text style={styles.similarName} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.similarPrice}>{item.price.toLocaleString()}đ</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* --- BOTTOM BAR --- */}
            <View style={styles.bottomBar}>
                <View style={styles.iconArea}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Chat', { product: product })}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2563EB" />
                        <Text style={styles.iconText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.iconBtn} 
                        onPress={() => {
                            addToCart(product);
                            Alert.alert("Tech Store", "Đã thêm vào giỏ hàng!");
                        }}
                    >
                        <Ionicons name="cart-outline" size={24} color="#2563EB" />
                        <Text style={styles.iconText}>Thêm giỏ</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                    style={styles.buyBtn} 
                    activeOpacity={0.8}
                    onPress={() => {
                        addToCart(product);
                        navigation.navigate('Main', { screen: 'CartTab' });
                    }}
                >
                    <Text style={styles.buyText}>MUA NGAY</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    
    // Header
    header: { 
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, 
        flexDirection: 'row', justifyContent: 'space-between', 
        paddingHorizontal: 15, paddingTop: 10 
    },
    circleBtn: { 
        backgroundColor: 'rgba(0,0,0,0.4)', width: 40, height: 40, 
        borderRadius: 20, justifyContent: 'center', alignItems: 'center' 
    },
    badge: { 
        position: 'absolute', top: -4, right: -4, 
        backgroundColor: '#EF4444', borderRadius: 9, width: 18, height: 18, 
        justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' 
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

    // Image
    imageContainer: { width: width, height: width * 0.8 },
    image: { width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%)' 
    },

    // Content
    content: { 
        flex: 1, backgroundColor: '#fff', marginTop: -20, 
        borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5
    },
    
    // Title Section
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    price: { fontSize: 28, fontWeight: 'bold', color: '#2563EB' }, // Xanh dương
    
    tagContainer: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', 
        alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, 
        borderRadius: 4, marginTop: 5 
    },
    tagText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },

    ratingBox: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', 
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 
    },
    ratingNum: { marginLeft: 4, fontWeight: 'bold', color: '#B45309' },

    name: { fontSize: 22, fontWeight: '700', color: '#102A43', marginTop: 12, lineHeight: 30 },

    // 👇 Styles cho Nút So Sánh (Mới)
    compareBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 12,
        marginTop: 15, borderWidth: 1, borderColor: '#BFDBFE'
    },
    compareText: { marginLeft: 8, color: '#2563EB', fontWeight: 'bold', fontSize: 14 },

    // Review Section
    reviewSection: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        marginTop: 15, backgroundColor: '#F0F4F8', padding: 12, borderRadius: 12 
    },
    reviewLeft: { flexDirection: 'row', alignItems: 'center' },
    reviewAvatars: { flexDirection: 'row', marginRight: 10 },
    avatarDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#fff' },
    reviewText: { fontSize: 13, color: '#102A43', fontWeight: '500' },

    divider: { height: 1, backgroundColor: '#F0F4F8', marginVertical: 20 },

    // Description
    sectionTitle: { fontWeight: 'bold', fontSize: 18, color: '#102A43', marginBottom: 10 },
    descContent: { color: '#486581', lineHeight: 24, fontSize: 15 },

    // Similar Products
    similarSection: { marginTop: 25 },
    similarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    seeMoreText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
    
    similarCard: { 
        width: 150, marginRight: 15, backgroundColor: '#fff', 
        borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', 
        overflow: 'hidden' 
    },
    similarImg: { width: '100%', height: 120, backgroundColor: '#F0F4F8' },
    similarInfo: { padding: 10 },
    similarName: { fontSize: 13, color: '#102A43', height: 36, fontWeight: '600' },
    similarPrice: { fontSize: 14, fontWeight: 'bold', color: '#2563EB', marginTop: 6 },

    // Bottom Bar
    bottomBar: { 
        position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', 
        flexDirection: 'row', alignItems: 'center', 
        paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 20,
        borderTopWidth: 1, borderTopColor: '#E2E8F0',
        elevation: 10 
    },
    iconArea: { flexDirection: 'row', marginRight: 15 },
    iconBtn: { alignItems: 'center', marginRight: 20 },
    iconText: { fontSize: 10, color: '#627D98', marginTop: 2, fontWeight: '500' },
    
    buyBtn: { 
        flex: 1, backgroundColor: '#2563EB', height: 50, 
        borderRadius: 12, justifyContent: 'center', alignItems: 'center',
        shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
    },
    buyText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});

export default ProductDetailScreen;