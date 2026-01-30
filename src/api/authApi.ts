// src/api/authApi.ts
export const authApi = {
    // --- 1. ĐĂNG NHẬP ---
    login: async (payload: { email: string; password?: string }) => {
        console.log('⚡ [API] Login Payload:', payload);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (payload.email === 'error@gmail.com') {
                    reject({ message: 'Tài khoản không tồn tại!' });
                } else {
                    resolve({
                        data: {
                            token: 'tech_token_123',
                            user: {
                                id: 1,
                                email: payload.email,
                                name: 'Sen Công Nghệ',
                                role: 'ADMIN',
                                avatar: 'https://ui-avatars.com/api/?name=Sen+Tech&background=2563EB&color=fff'
                            },
                            message: 'Đăng nhập thành công!'
                        }
                    });
                }
            }, 1000); 
        });
    },

    // --- 2. ĐĂNG KÝ ---
    register: async (payload: { fullName: string; email: string; password?: string }) => {
        console.log('⚡ [API] Register Payload:', payload);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        token: 'new_token_456',
                        user: {
                            id: Date.now(),
                            email: payload.email,
                            name: payload.fullName,
                            role: 'USER',
                            avatar: `https://ui-avatars.com/api/?name=${payload.fullName}&background=random`
                        },
                        message: 'Đăng ký thành công!'
                    }
                });
            }, 1500);
        });
    }
};