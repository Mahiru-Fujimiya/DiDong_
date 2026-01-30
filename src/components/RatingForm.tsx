import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RatingForm = ({ orderId, onFinish }: any) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  const handleSendReview = async () => {
    // Gửi dữ liệu khách nhập lên Server của Sen
    try {
      const response = await fetch(`http://10.69.91.110:3000/api/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, stars, comment, date: new Date() })
      });
      
      if (response.ok) {
        Alert.alert("Cảm ơn Sen!", "Đánh giá của Sen giúp shop hoàn thiện hơn.");
        onFinish(); // Đóng form
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không gửi được đánh giá, Sen kiểm tra mạng nhé!");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sen thấy sản phẩm thế nào?</Text>
      
      {/* Chọn sao thủ công */}
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setStars(num)}>
            <Ionicons 
              name={num <= stars ? "star" : "star-outline"} 
              size={32} 
              color="#F59E0B" 
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mời Sen viết cảm nhận tại đây..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleSendReview}>
        <Text style={styles.btnText}>Gửi Đánh Giá</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 5 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, height: 80, textAlignVertical: 'top' },
  btn: { backgroundColor: '#2563EB', marginTop: 15, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default RatingForm;