import { useSupabaseConnection } from '@/hooks/useSupabaseConnection'
import { useState } from 'react'

/**
 * Componente de teste de conexão com Supabase
 * Adicione este componente temporariamente ao App.tsx para testar
 */
export function TestSupabaseConnection() {
    const { testConnection, isConnected, error, loading } = useSupabaseConnection()
    const [showTest, setShowTest] = useState(false)

    if (!showTest) {
        return (
            <div style={{
                position: 'fixed',
                bottom: 24,
                right: 100,
                zIndex: 9999
            }}>
                <button
                    onClick={() => setShowTest(true)}
                    style={{
                        background: '#00C9A7',
                        color: '#0A0F1C',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0, 201, 167, 0.3)'
                    }}
                >
                    🔌 Testar Conexão Supabase
                </button>
            </div>
        )
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            right: 100,
            background: 'rgba(19, 27, 44, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '320px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 9999
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>
                    🔌 Teste de Conexão
                </h3>
                <button
                    onClick={() => setShowTest(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        fontSize: '20px',
                        padding: 0
                    }}
                >
                    ✕
                </button>
            </div>

            <button
                onClick={testConnection}
                disabled={loading}
                style={{
                    width: '100%',
                    background: loading ? '#555' : '#00C9A7',
                    color: loading ? '#aaa' : '#0A0F1C',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    marginBottom: '16px'
                }}
            >
                {loading ? 'Testando...' : 'Testar Conexão'}
            </button>

            {isConnected !== null && (
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: isConnected
                        ? 'rgba(0, 201, 167, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isConnected ? '#00C9A7' : '#EF4444'}`
                }}>
                    <div style={{
                        fontWeight: 600,
                        color: isConnected ? '#00C9A7' : '#EF4444',
                        marginBottom: '4px'
                    }}>
                        {isConnected ? '✅ Conectado!' : '❌ Falha na Conexão'}
                    </div>
                    {error && (
                        <div style={{
                            fontSize: '12px',
                            color: '#EF4444',
                            marginTop: '8px'
                        }}>
                            {error}
                        </div>
                    )}
                    {isConnected && (
                        <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginTop: '8px'
                        }}>
                            Cliente Supabase inicializado corretamente! ✨
                        </div>
                    )}
                </div>
            )}

            <div style={{
                marginTop: '12px',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)'
            }}>
                URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 30)}...
            </div>
        </div>
    )
}
