import axios from 'axios';

// ⚠️ LƯU Ý QUAN TRỌNG VỀ ĐỊA CHỈ IP:
// - Nếu chạy trên Android Emulator: Dùng 'http://10.0.2.2:3000/api'
// - Nếu chạy trên Máy thật: Dùng IP LAN máy tính (VD: 'http://192.168.1.15:3000/api')
// - Cổng (Port) phải khớp với server.js (thường là 3000)

const baseURL = 'http://192.168.1.15:3000/api'; // 👈 THAY SỐ IP MỚI NHẤT CỦA BẠN VÀO ĐÂY

const axiosClient = axios.create({
    baseURL: baseURL,
    timeout: 10000, // Ngắt kết nối nếu server không phản hồi sau 10 giây
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- BỘ CHẶN (INTERCEPTORS) ĐỂ XỬ LÝ LỖI TỰ ĐỘNG ---

// Trước khi gửi yêu cầu lên server
axiosClient.interceptors.request.use(
    (config) => {
        // Bạn có thể thêm Token vào header ở đây nếu sau này có dùng JWT
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Sau khi nhận phản hồi từ server
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về thẳng dữ liệu bên trong để code ở các file khác ngắn gọn hơn
        return response.data;
    },
    (error) => {
        // Xử lý các lỗi mạng chung
        if (!error.response) {
            console.error("❌ Lỗi mạng: Hãy kiểm tra IP và Server!");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;