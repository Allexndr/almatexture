import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthCheck() {
  const [email, setEmail] = useState('admin@almatexture.kz');
  const [password, setPassword] = useState('almaty2023');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Ошибка запроса',
        error: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Проверка аутентификации</title>
      </Head>

      <div style={{
        maxWidth: '600px',
        margin: '100px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Проверка аутентификации</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Пароль:
            </label>
            <input
              type="text" // Намеренно текстовое поле для отладки
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Проверка...' : 'Проверить учетные данные'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: result.success ? '#d4edda' : '#f8d7da',
            color: result.success ? '#155724' : '#721c24',
            borderRadius: '4px'
          }}>
            <h3>{result.message}</h3>
            {result.reason && <p>Причина: {result.reason}</p>}
            {result.user && (
              <div>
                <p>Данные пользователя:</p>
                <pre>{JSON.stringify(result.user, null, 2)}</pre>
              </div>
            )}
            {result.error && <p>Ошибка: {result.error}</p>}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
} 