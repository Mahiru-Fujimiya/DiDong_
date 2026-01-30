import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorite } from '../../context/FavoriteContext';

const FavoriteScreen = ({ navigation }: any) => {
  const { favorites, toggleFavorite } = useFavorite();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.image} 
      />
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Chính hãng</Text>
        </View>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}đ</Text>
      </View>
      
      <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.heartBtn}>
        <Ionicons name="heart" size={24} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách quan tâm ({favorites.length})</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-outline" size={60} color="#CBD5E0" />
            </View>
            <Text style={styles.emptyTitle}>Danh sách đang trống</Text>
            <Text style={styles.emptyText}>Lưu lại những món đồ công nghệ bạn thích để xem sau nhé!</Text>
            
            <TouchableOpacity 
              style={styles.shopBtn} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
            >
              <Text style={styles.shopBtnText}>Khám phá công nghệ ngay</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// --- STYLES TECH STORE (#2563EB) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' }, // Nền xám xanh
  
  header: { 
      padding: 16, backgroundColor: '#fff', 
      borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
      elevation: 2 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#102A43' },
  
  // CARD SẢN PHẨM
  card: { 
      flexDirection: 'row', backgroundColor: '#fff', 
      borderRadius: 16, padding: 12, marginBottom: 15, 
      alignItems: 'center', 
      elevation: 2, shadowColor: '#2563EB', shadowOpacity: 0.08, shadowRadius: 4
  },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F0F4F8' },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 15, fontWeight: '600', color: '#102A43', marginBottom: 4 },
  
  tagContainer: { 
      backgroundColor: '#E3F2FD', alignSelf: 'flex-start', 
      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 6 
  },
  tagText: { fontSize: 10, color: '#2563EB', fontWeight: 'bold' },
  
  price: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' }, // Giá màu xanh
  
  heartBtn: { padding: 8, backgroundColor: '#FFF5F5', borderRadius: 20 }, // Nền đỏ nhạt quanh tim
  
  // EMPTY STATE
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 30 },
  emptyIconCircle: {
      width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
      justifyContent: 'center', alignItems: 'center', marginBottom: 20,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43', marginBottom: 10 },
  emptyText: { marginTop: 5, color: '#627D98', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  
  shopBtn: { 
      backgroundColor: '#2563EB', // Nút màu xanh
      paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30,
      elevation: 5, shadowColor: '#2563EB', shadowOpacity: 0.3
  },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default FavoriteScreen;