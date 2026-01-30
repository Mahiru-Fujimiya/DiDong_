import React, { useState, useRef, useEffect } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
    Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

// --- 1. KHO LINH KIỆN (DATA) ---
const PC_PARTS = {
    cpu: [
        { name: 'Intel Core i3 12100F', price: 2200000, score: 30 },
        { name: 'Intel Core i5 12400F', price: 3500000, score: 50 },
        { name: 'Intel Core i5 13600K', price: 7800000, score: 80 },
        { name: 'Intel Core i9 14900K', price: 14500000, score: 100 },
    ],
    vga: [
        { name: 'Không VGA (Onboard)', price: 0, score: 10 },
        { name: 'NVIDIA GTX 1650 4GB', price: 3600000, score: 30 },
        { name: 'NVIDIA RTX 3060 12GB', price: 7200000, score: 60 },
        { name: 'NVIDIA RTX 4070 Super', price: 17500000, score: 85 },
        { name: 'NVIDIA RTX 4090 24GB', price: 48000000, score: 100 },
    ],
    ram: [
        { name: '8GB DDR4 3200MHz', price: 550000, score: 20 },
        { name: '16GB DDR4 3200MHz', price: 950000, score: 50 },
        { name: '32GB DDR5 5600MHz RGB', price: 2800000, score: 90 },
    ],
    main: [
        { name: 'Mainboard H610M', price: 1900000 },
        { name: 'Mainboard B760M Pro', price: 3500000 },
        { name: 'Mainboard Z790 Gaming', price: 7200000 },
    ],
    ssd: [
        { name: 'SSD 256GB NVMe', price: 700000 },
        { name: 'SSD 512GB Gen4', price: 1400000 },
        { name: 'SSD 1TB Samsung 980', price: 2500000 },
    ],
    psu: [
        { name: 'Nguồn 550W Công suất thực', price: 850000 },
        { name: 'Nguồn 750W Bronze', price: 1600000 },
        { name: 'Nguồn 1000W Gold Modular', price: 3500000 },
    ],
    case: [
        { name: 'Vỏ Case Văn Phòng', price: 350000 },
        { name: 'Vỏ Case Gaming Kính Cường Lực', price: 900000 },
        { name: 'Vỏ Case Bể Cá View Vô Cực', price: 2100000 },
    ]
};

const PCBuilderScreen = ({ navigation }: any) => {
    const { addToCart } = useCart();
    
    // State tin nhắn
    const [messages, setMessages] = useState<any[]>([
        { 
            id: '1', 
            text: 'Chào Sen! Em là AI Tech Assistant 🤖.\nSen muốn build PC để làm gì và ngân sách khoảng bao nhiêu ạ?\n(Ví dụ: "Build máy chơi game 20 triệu")', 
            sender: 'bot', 
            type: 'text' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // --- 2. BỘ NÃO XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP MOCK) ---
    const analyzeMessage = (text: string) => {
        setIsTyping(true);
        const lowerText = text.toLowerCase();

        // Giả lập thời gian suy nghĩ của AI (1.5s - 2.5s)
        const thinkingTime = Math.floor(Math.random() * 1000) + 1500;

        setTimeout(() => {
            let responseText = "";
            let buildData = null;

            // 1. Phân tích Intent (Ý định)
            if (isGreeting(lowerText)) {
                responseText = getRandomResponse(['greeting']);
            } 
            else if (isThanks(lowerText)) {
                responseText = getRandomResponse(['thanks']);
            }
            else {
                // 2. Phân tích Thực thể (Entity): Ngân sách & Nhu cầu
                const budget = extractBudget(lowerText);
                const usage = extractUsage(lowerText); // 'gaming', 'office', 'design', 'default'

                if (budget > 0) {
                    if (budget < 5000000) {
                        responseText = `Hic, ngân sách ${budget.toLocaleString()}đ hơi khó để build PC mới ạ. Sen cố gắng lên tầm 6-7 triệu để có bộ máy ổn định nhé! 😅`;
                    } else if (budget > 100000000) {
                        responseText = `Wow! ${budget.toLocaleString()}đ là ngân sách khủng đấy! Em đã chọn những linh kiện cao cấp nhất cho Sen đây. 😎`;
                        buildData = generatePC(budget, usage);
                    } else {
                        // Tạo câu trả lời dựa trên nhu cầu
                        if (usage === 'gaming') responseText = `Với ${budget.toLocaleString()}đ chiến Game, em ưu tiên VGA mạnh cho Sen nhé! 🎮`;
                        else if (usage === 'office') responseText = `Tầm ${budget.toLocaleString()}đ làm văn phòng thì em chọn CPU mạnh, RAM nhiều cho mượt ạ. 💼`;
                        else if (usage === 'design') responseText = `Dạ ${budget.toLocaleString()}đ làm đồ họa em sẽ cân đối CPU và Card rời để render nhanh nhất. 🎨`;
                        else responseText = `Dạ, đây là cấu hình tối ưu nhất trong tầm giá ${budget.toLocaleString()}đ em build cho Sen:`;
                        
                        buildData = generatePC(budget, usage);
                    }
                } else {
                    // Không tìm thấy số tiền
                    responseText = getRandomResponse(['ask_budget']);
                }
            }

            // Gửi tin nhắn phản hồi
            addBotMessage(responseText, 'text');
            if (buildData) {
                addBotMessage('', 'build', buildData);
            }
            
            setIsTyping(false);
        }, thinkingTime);
    };

    // --- CÁC HÀM BỔ TRỢ NLP ---
    const isGreeting = (txt: string) => txt.includes('hi') || txt.includes('hello') || txt.includes('chào') || txt === 'alo';
    const isThanks = (txt: string) => txt.includes('cảm ơn') || txt.includes('thank') || txt.includes('ok') || txt.includes('tuyệt');
    
    const extractBudget = (txt: string): number => {
        // Xử lý các từ lóng: k, tr, triệu, củ, m
        let tempTxt = txt.replace(/k/g, '000').replace(/tr/g, '000000').replace(/triệu/g, '000000').replace(/củ/g, '000000').replace(/m/g, '000000');
        const numbers = tempTxt.match(/\d+/g);
        if (!numbers) return 0;
        
        let num = parseInt(numbers[0]); // Lấy số đầu tiên tìm thấy
        
        // Logic đoán đơn vị nếu người dùng chỉ nhập số (ví dụ: 15 -> 15tr, 15000 -> 15tr)
        if (num < 100) return num * 1000000; 
        if (num < 100000) return num * 1000;
        return num;
    };

    const extractUsage = (txt: string): 'gaming' | 'office' | 'design' | 'default' => {
        if (txt.includes('game') || txt.includes('gêm') || txt.includes('lol') || txt.includes('pubg')) return 'gaming';
        if (txt.includes('văn phòng') || txt.includes('office') || txt.includes('word') || txt.includes('học')) return 'office';
        if (txt.includes('đồ họa') || txt.includes('design') || txt.includes('render') || txt.includes('video')) return 'design';
        return 'default';
    };

    const getRandomResponse = (type: string[]) => {
        const dictionary: any = {
            greeting: ["Chào Sen! Em có thể giúp gì cho bộ PC mơ ước của Sen?", "Hello! Hôm nay Sen muốn build máy gì nè?", "Chào bạn, mình là AI Build PC. Cho mình xin ngân sách nhé!"],
            thanks: ["Dạ không có chi! Cần gì Sen cứ ới em nhé ❤️", "Rất vui được hỗ trợ Sen! 🤖", "Chúc Sen sớm có máy ngon nhé!"],
            ask_budget: ["Sen cho em xin ngân sách dự kiến để em lựa linh kiện chuẩn nhất nha!", "Mình chưa rõ ngân sách của bạn. Ví dụ: 'Tầm 15 triệu'?", "Sen muốn đầu tư khoảng bao nhiêu lúa cho vụ này?"]
        };
        const list = dictionary[type[0]];
        return list[Math.floor(Math.random() * list.length)];
    };

    // --- 3. ALGORITHM BUILD PC THÔNG MINH ---
    const generatePC = (budget: number, usage: string) => {
        // Phân bổ ngân sách theo nhu cầu
        let ratio = { cpu: 0, vga: 0 }; // Tỷ lệ điểm số ưu tiên

        if (usage === 'gaming') ratio = { cpu: 0.3, vga: 0.5 }; // Ưu tiên VGA
        else if (usage === 'office') ratio = { cpu: 0.6, vga: 0 }; // Ưu tiên CPU, VGA onboard
        else ratio = { cpu: 0.4, vga: 0.4 }; // Cân bằng

        // Logic chọn Tier (Phân khúc)
        let tierIdx = 0; // 0: Thấp, 1: Trung, 2: Cao, 3: Vip
        if (budget > 35000000) tierIdx = 3;
        else if (budget > 20000000) tierIdx = 2;
        else if (budget > 12000000) tierIdx = 1;
        
        // Hàm lấy linh kiện an toàn
        const getPart = (list: any[], idx: number) => list[Math.min(idx, list.length - 1)];

        // Chọn linh kiện
        let vga = getPart(PC_PARTS.vga, tierIdx);
        // Nếu là Office và ngân sách thấp -> Dùng VGA onboard (index 0)
        if (usage === 'office' && budget < 15000000) vga = PC_PARTS.vga[0];
        // Nếu là Gaming và ngân sách cao -> Cố gắng lấy VGA xịn hơn 1 bậc
        if (usage === 'gaming' && tierIdx < 3) vga = getPart(PC_PARTS.vga, tierIdx + 1);

        const cpu = getPart(PC_PARTS.cpu, tierIdx);
        const main = getPart(PC_PARTS.main, Math.min(tierIdx, 2));
        const ram = getPart(PC_PARTS.ram, Math.min(tierIdx, 2));
        const ssd = getPart(PC_PARTS.ssd, Math.min(tierIdx, 2));
        const psu = getPart(PC_PARTS.psu, tierIdx);
        const casePc = getPart(PC_PARTS.case, Math.min(tierIdx, 2));

        const components = [cpu, main, ram, ssd, vga, psu, casePc].filter(c => c.price > 0);
        const totalPrice = components.reduce((sum, item) => sum + item.price, 0);

        return { components, totalPrice };
    };

    const addBotMessage = (text: string, type: 'text' | 'build' = 'text', data: any = null) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'bot', type, data }]);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userText = input;
        setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, sender: 'user', type: 'text' }]);
        setInput('');
        analyzeMessage(userText); // Gọi bộ não AI
    };

    const handleAddAllToCart = (buildData: any) => {
        buildData.components.forEach((item: any) => {
            addToCart({
                id: Math.random().toString(),
                name: item.name,
                price: item.price,
                image: 'https://cdn-icons-png.flaticon.com/512/9664/9664267.png',
                quantity: 1,
                breed: 'PC Build'
            });
        });
        Alert.alert("Thành công", "Đã thêm trọn bộ linh kiện vào giỏ hàng! 🛒");
    };

    // --- RENDER UI ---
    const renderMessage = ({ item }: any) => {
        const isBot = item.sender === 'bot';

        if (item.type === 'build' && item.data) {
            return (
                <View style={[styles.msgContainer, { alignSelf: 'flex-start' }]}>
                    <View style={styles.botAvatar}>
                        <Ionicons name="desktop-outline" size={18} color="#fff" />
                    </View>
                    <View style={styles.buildCard}>
                        <View style={styles.buildHeader}>
                            <Text style={styles.buildTitle}>CẤU HÌNH ĐỀ XUẤT</Text>
                            <Ionicons name="hardware-chip" size={18} color="#fff" />
                        </View>
                        {item.data.components.map((comp: any, index: number) => (
                            <View key={index} style={styles.compRow}>
                                <Text style={styles.compName}>• {comp.name}</Text>
                                <Text style={styles.compPrice}>{comp.price.toLocaleString()}đ</Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TỔNG CỘNG:</Text>
                            <Text style={styles.totalValue}>{item.data.totalPrice.toLocaleString()}đ</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.addToCartBtn}
                            onPress={() => handleAddAllToCart(item.data)}
                        >
                            <Text style={styles.addToCartText}>MUA TRỌN BỘ NGAY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.msgContainer, { alignSelf: isBot ? 'flex-start' : 'flex-end' }]}>
                {isBot && (
                    <View style={styles.botAvatar}>
                        <Ionicons name="logo-android" size={18} color="#fff" />
                    </View>
                )}
                <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={[styles.msgText, isBot ? styles.botText : styles.userText]}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#102A43" />
                </TouchableOpacity>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.headerTitle}>AI Tech Consultant 🧠</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={{width:8, height:8, borderRadius:4, backgroundColor: '#10B981', marginRight: 4}} />
                        <Text style={styles.headerSub}>Online • Sẵn sàng tư vấn</Text>
                    </View>
                </View>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            {isTyping && (
                <View style={styles.typingBox}>
                    <ActivityIndicator size="small" color="#627D98" />
                    <Text style={{ color: '#627D98', fontSize: 12, marginLeft: 8 }}>AI đang suy nghĩ...</Text>
                </View>
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="VD: Máy 25 triệu chơi game..."
                        value={input}
                        onChangeText={setInput}
                        placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="arrow-up" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#102A43' },
    headerSub: { fontSize: 11, color: '#10B981', fontWeight: '500' },

    msgContainer: { flexDirection: 'row', marginBottom: 15, maxWidth: '85%' },
    botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginRight: 8, marginTop: 4, elevation: 2 },
    
    bubble: { padding: 12, borderRadius: 18, elevation: 1 },
    botBubble: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
    userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
    
    msgText: { fontSize: 15, lineHeight: 22 },
    botText: { color: '#102A43' },
    userText: { color: '#fff' },

    // BUILD CARD
    buildCard: { backgroundColor: '#fff', borderRadius: 16, width: width * 0.75, overflow: 'hidden', borderWidth: 1, borderColor: '#BFDBFE', elevation: 3 },
    buildHeader: { backgroundColor: '#2563EB', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buildTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },
    compRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F0F4F8' },
    compName: { fontSize: 13, color: '#334E68', flex: 1, marginRight: 5 },
    compPrice: { fontSize: 13, fontWeight: 'bold', color: '#102A43' },
    divider: { height: 1, backgroundColor: '#E2E8F0' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#F0F9FF' },
    totalLabel: { fontWeight: 'bold', color: '#102A43' },
    totalValue: { fontWeight: 'bold', color: '#EF4444', fontSize: 16 },
    addToCartBtn: { backgroundColor: '#F59E0B', padding: 14, alignItems: 'center' },
    addToCartText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

    // Typing
    typingBox: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginBottom: 10 },

    // Input
    inputArea: { flexDirection: 'row', padding: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E2E8F0' },
    input: { flex: 1, backgroundColor: '#F0F4F8', borderRadius: 24, paddingHorizontal: 20, height: 48, color: '#102A43', fontSize: 15 },
    sendBtn: { width: 48, height: 48, backgroundColor: '#2563EB', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 10, elevation: 2 },
});

export default PCBuilderScreen;