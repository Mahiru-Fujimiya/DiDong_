import React, { useState, useRef } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
    KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// 👇 Import Service vừa tạo
import { sendMessageToGemini } from '../../services/GeminiService'; 

const ChatScreen = ({ navigation }: any) => {
    const [messages, setMessages] = useState<any[]>([
        { 
            id: '1', 
            text: 'Chào Sen! Em là AI Tech Store 🤖.\nEm có thể tư vấn so sánh máy, build PC hoặc săn deal. Sen cần gì cứ hỏi nhé!', 
            sender: 'bot' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        
        // 1. Hiện tin nhắn của User ngay lập tức
        const newUserMsg = { id: Date.now().toString(), text: userText, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // 2. Gọi AI suy nghĩ
        const aiResponseText = await sendMessageToGemini(userText);

        // 3. Hiện tin nhắn của Bot
        const newBotMsg = { 
            id: (Date.now() + 1).toString(), 
            text: aiResponseText, 
            sender: 'bot' 
        };
        
        setMessages(prev => [...prev, newBotMsg]);
        setIsTyping(false);
    };

    const renderMessage = ({ item }: any) => {
        const isBot = item.sender === 'bot';
        return (
            <View style={[styles.msgContainer, { alignSelf: isBot ? 'flex-start' : 'flex-end' }]}>
                {isBot && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="sparkles" size={16} color="#fff" />
                        </View>
                    </View>
                )}
                <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={[styles.msgText, isBot ? styles.botText : styles.userText]}>
                        {item.text}
                    </Text>
                </View>
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
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.headerTitle}>Trợ lý AI Tech Store</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.statusText}>Đang hoạt động</Text>
                    </View>
                </View>
                <View style={{ width: 28 }} />
            </View>

            {/* DANH SÁCH TIN NHẮN */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            {/* TRẠNG THÁI ĐANG GÕ */}
            {isTyping && (
                <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#2563EB" />
                    <Text style={styles.typingText}>AI đang suy nghĩ...</Text>
                </View>
            )}

            {/* KHUNG NHẬP LIỆU */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Hỏi gì đi Sen ơi..."
                        placeholderTextColor="#94A3B8"
                        value={input}
                        onChangeText={setInput}
                        multiline
                    />
                    <TouchableOpacity 
                        style={[styles.sendBtn, !input.trim() && { backgroundColor: '#CBD5E0' }]} 
                        onPress={handleSend}
                        disabled={!input.trim()}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#102A43' },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 5 },
    statusText: { fontSize: 11, color: '#10B981', fontWeight: '500' },

    msgContainer: { flexDirection: 'row', marginBottom: 15, maxWidth: '80%' },
    avatarContainer: { marginRight: 8, alignSelf: 'flex-end', marginBottom: 5 },
    avatarCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
    
    bubble: { padding: 12, borderRadius: 18, elevation: 1 },
    botBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
    
    msgText: { fontSize: 15, lineHeight: 22 },
    botText: { color: '#334E68' },
    userText: { color: '#fff' },

    typingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 50, marginBottom: 10 },
    typingText: { fontSize: 12, color: '#627D98', marginLeft: 8, fontStyle: 'italic' },

    inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E2E8F0' },
    input: { flex: 1, backgroundColor: '#F0F4F8', borderRadius: 20, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, maxHeight: 100, fontSize: 15, color: '#102A43' },
    sendBtn: { width: 44, height: 44, backgroundColor: '#2563EB', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 0 },
});

export default ChatScreen;