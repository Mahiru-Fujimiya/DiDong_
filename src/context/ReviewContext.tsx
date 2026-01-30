import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewContext = createContext<any>(null);

export const ReviewProvider = ({ children }: any) => {
  // NẠP ĐÁNH GIÁ ẢO Ở ĐÂY ĐỂ TEST GIAO DIỆN
  const [allReviews, setAllReviews] = useState<any[]>([
    {
      id: "1001",
      user: "Minh Quân",
      productName: "iPhone 15 Pro Max",
      content: "Máy cầm rất đầm tay, hiệu năng tuyệt vời, shop đóng gói cực kỳ cẩn thận và giao nhanh.",
      star: 5,
      date: '20/01/2026'
    },
    {
      id: "1002",
      user: "Thanh Hằng",
      productName: "Tai nghe AirPods Pro 2",
      content: "Chống ồn tốt, nghe nhạc rất phê. Shop tư vấn nhiệt tình, sẽ ủng hộ tiếp!",
      star: 5,
      date: '22/01/2026'
    },
    {
      id: "1003",
      user: "Hoàng Long",
      productName: "Củ sạc nhanh 20W",
      content: "Sạc nhanh nhưng dây hơi ngắn một chút, bù lại giá tốt nhất thị trường.",
      star: 4,
      date: '23/01/2026'
    }
  ]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await AsyncStorage.getItem('@all_reviews');
        if (data) {
          const parsedData = JSON.parse(data);
          // Gộp dữ liệu ảo với dữ liệu thật từ máy (nếu có)
          setAllReviews(prev => [...prev, ...parsedData]);
        }
      } catch (e) { 
        console.log("Lỗi tải review"); 
      }
    };
    loadReviews();
  }, []);

  const addReview = async (newEntry: any) => {
    try {
      // Đảm bảo ID luôn là chuỗi để không lỗi toString()
      const entryWithSafeId = {
        ...newEntry,
        id: String(newEntry.id || Date.now())
      };

      const updated = [entryWithSafeId, ...allReviews];
      setAllReviews(updated);
      await AsyncStorage.setItem('@all_reviews', JSON.stringify(updated));
      return true;
    } catch (e) { 
      return false; 
    }
  };

  return (
    <ReviewContext.Provider value={{ allReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);