import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu vận chuyển
interface ShippingMethod {
  id: string;
  name: string;
  fee: number;
  time: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: any[];
  status: string;
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
  minOrder: number;
  desc: string;
  type: 'fixed' | 'percent';
  value: number;
}

interface CartContextType {
  cart: any[];
  totalAmount: number;
  orders: Order[];
  wishlist: any[];
  notifications: any[];
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  shippingMethods: ShippingMethod[];
  selectedShipping: ShippingMethod;
  setSelectedShipping: (method: ShippingMethod) => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  addOrder: (orderInfo: any) => void;
  toggleWishlist: (product: any) => void;
  setAppliedVoucher: (voucher: Voucher | null) => void;
  getDiscountAmount: (total: number) => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  
  // 👇 1. DANH SÁCH VẬN CHUYỂN (Cập nhật giá và tên cho chuẩn Tech)
  const shippingMethods: ShippingMethod[] = [
    { id: 'saving', name: 'Tiết kiệm', fee: 15000, time: '3-5 ngày' },
    { id: 'fast', name: 'Nhanh', fee: 30000, time: '1-2 ngày' },
    { id: 'express', name: 'Hỏa tốc 2H', fee: 100000, time: '2 giờ' }, // Sửa giá 500k -> 100k cho hợp lý
  ];
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(shippingMethods[1]); 

  // 👇 2. THÔNG BÁO (Đổi giọng văn sang công nghệ)
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'Chào mừng đến Tech Store! 🚀', body: 'Khám phá thế giới công nghệ đỉnh cao ngay.', date: 'Vừa xong' }
  ]);

  // 👇 3. MÃ GIẢM GIÁ (Đổi Code sang TECH...)
  const [vouchers] = useState<Voucher[]>([
    { id: '1', code: 'TECHNEW', discount: 50000, value: 50000, minOrder: 1000000, desc: 'Giảm 50k cho đơn từ 1 triệu', type: 'fixed' },
    { id: '2', code: 'TECHVIP', discount: 0, value: 0.05, minOrder: 5000000, desc: 'Giảm 5% cho đơn từ 5 triệu', type: 'percent' }, // Giảm % cho đồ công nghệ giá trị cao
    { id: '3', code: 'FREESHIP', discount: 30000, value: 30000, minOrder: 0, desc: 'Miễn phí vận chuyển 30k', type: 'fixed' },
  ]);

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getDiscountAmount = (total: number) => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === 'percent') {
      return total * appliedVoucher.value;
    }
    return appliedVoucher.value;
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    setSelectedShipping(shippingMethods[1]);
  };

  const addOrder = (orderInfo: any) => {
    const newOrder: Order = {
      id: orderInfo.id || 'TS' + Math.floor(Math.random() * 1000000), // TS = Tech Store
      date: orderInfo.date || new Date().toLocaleDateString('vi-VN'),
      total: orderInfo.total,
      items: orderInfo.items,
      status: orderInfo.status || 'Chờ xác nhận'
    };
    setOrders(prev => [newOrder, ...prev]);

    const newNotify = {
      id: Date.now().toString(),
      title: 'Đặt hàng thành công! 📦',
      body: `Đơn hàng công nghệ ${newOrder.id} đang được xử lý.`,
      date: 'Vừa xong'
    };
    setNotifications(prev => [newNotify, ...prev]);
  };

  const toggleWishlist = (product: any) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, totalAmount, orders, wishlist, notifications, vouchers, appliedVoucher,
        shippingMethods, selectedShipping, setSelectedShipping,
        addToCart, removeFromCart, clearCart, addOrder, toggleWishlist, setAppliedVoucher, getDiscountAmount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};