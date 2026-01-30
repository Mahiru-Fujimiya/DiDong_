const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH ---
const PORT = 3000;
// Thay API Key của Sen vào đây hoặc để trong file .env
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; 

// API ENDPOINT: App Mobile sẽ gọi vào đây
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    console.log(`📩 Nhận tin nhắn: "${userMessage}"`);

    try {
        // Gọi lên Google Gemini API (Bản 1.5 Flash ổn định nhất)
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: `Bạn là trợ lý AI của Tech Store. Hãy tư vấn công nghệ nhiệt tình, vui vẻ, xưng Em và gọi khách là Sen. Câu hỏi: ${userMessage}` }]
                    }
                ]
            }
        );

        // Trích xuất câu trả lời từ Google
        if (response.data && response.data.candidates) {
            const aiReply = response.data.candidates[0].content.parts[0].text;
            console.log(`🤖 AI trả lời: "${aiReply.substring(0, 50)}..."`);
            res.json({ reply: aiReply });
        } else {
            res.status(500).json({ error: "AI không nhả chữ nào rồi Sen ơi!" });
        }

    } catch (error) {
        console.error("❌ Lỗi Google API:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Lỗi kết nối Gemini!",
            details: error.response?.data?.error?.message || error.message 
        });
    }
});

// Trang chủ để kiểm tra Server có sống không
app.get('/', (req, res) => {
    res.send('🚀 Server Tech Store đang chạy cực mượt!');
});

// Lắng nghe cổng 3000 trên tất cả địa chỉ IP (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Server đang sống tại cổng ${PORT}`);
    console.log(`📡 URL cho App: http://10.69.91.110:${PORT}/api/chat`);
    console.log('-------------------------------------------');
});