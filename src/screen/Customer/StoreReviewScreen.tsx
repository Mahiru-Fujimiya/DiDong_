import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviews } from '../../context/ReviewContext';

const StoreReviewScreen = ({ navigation }: any) => {
  const { allReviews } = useReviews();

  // Hàm render từng thẻ đánh giá
  const renderReviewItem = ({ item }: any) => {
    // Tạo mảng sao dựa trên số star (ví dụ star = 5 thì hiện 5 sao vàng)
    const renderStars = (count: number) => {
      let stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <Ionicons 
            key={i} 
            name={i <= count ? "star" : "star-outline"} 
            size={16} 
            color="#F59E0B" 
          />
        );
      }
      return stars;
    };

    return (
      <View style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userIcon}>
            <Text style={styles.userInitial}>
              {item?.user ? item.user.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item?.user ?? 'Khách hàng Tech Store'}</Text>
            <View style={styles.starRow}>{renderStars(item?.star ?? 5)}</View>
          </View>
          <Text style={styles.reviewDate}>{item?.date ?? 'Vừa xong'}</Text>
        </View>

        <View style={styles.productTag}>
          <Ionicons name="cube-outline" size={14} color="#64748B" />
          <Text style={styles.productName}> {item?.productName ?? 'Sản phẩm công nghệ'}</Text>
        </View>

        <Text style={styles.commentText}>{item?.content ?? 'Không có nội dung đánh giá.'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#102A43" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phản hồi khách hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* DANH SÁCH ĐÁNH GIÁ */}
      <FlatList
        data={allReviews}
        // 👇 FIX LỖI TOSTRING TẠI ĐÂY: Dùng String() an toàn + index dự phòng
        keyExtractor={(item, index) => (item?.id ? String(item.id) : `review-${index}`)}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={80} color="#CBD5E0" />
            <Text style={styles.emptyText}>Chưa có đánh giá nào cho cửa hàng.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#102A43' },
  backBtn: { width: 40 },
  listContent: { padding: 16, paddingBottom: 40 },
  
  reviewCard: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userIcon: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center' 
  },
  userInitial: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontWeight: 'bold', color: '#102A43', fontSize: 15 },
  starRow: { flexDirection: 'row', marginTop: 2 },
  reviewDate: { fontSize: 12, color: '#94A3B8' },
  
  productTag: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start',
    marginBottom: 10
  },
  productName: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  commentText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 16 }
});

export default StoreReviewScreen;