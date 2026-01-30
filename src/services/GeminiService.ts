// 👇 ĐỊA CHỈ IP MÁY TÍNH CỦA SEN (Dựa trên ipconfig sen đã kiểm tra)
const SERVER_IP = "10.69.91.110"; 
const PORT = "3000";
const SERVER_URL = `http://${SERVER_IP}:${PORT}/api/chat`;

export const sendMessageToGemini = async (userMessage: string) => {
  try {
    console.log("📡 Đang gửi tin nhắn tới Server:", SERVER_URL);

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage, // Gửi tin nhắn của Sen lên Server
      }),
    });

    // Kiểm tra nếu Server phản hồi lỗi (404, 500...)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Lỗi từ Server:", errorData);
      return `Lỗi Server: ${errorData.error || "Không xác định"}`;
    }

    const data = await response.json();

    // Trả về câu trả lời của AI từ Server gửi về
    if (data.reply) {
      return data.reply;
    }

    return "Hic, Server phản hồi nhưng không có nội dung trả lời. 😶";

  } catch (error) {
    console.error("❌ Lỗi kết nối mạng:", error);
    return "Không kết nối được với Server. Sen nhớ bật Server và bắt chung Wifi nhé! 📶";
  }
};