'use client';

import { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(userName, password);
      if (data.success) {
        onLoginSuccess({ userId: data.userId, userName: data.userName, role: data.role });
      } else {
        alert('Giriş başarısız!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>Fatura Sistemi Giriş</h2>
        <input type="text" placeholder="Kullanıcı Adı" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setUserName(e.target.value)} />
        <input type="password" placeholder="Şifre" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Giriş Yap</button>
      </form>
    </div>
  );
}
