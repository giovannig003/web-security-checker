import React, { useState } from 'react';
import { ShieldCheck, Search, Lock, FileText } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('Errore durante la scansione del sito web.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Impossibile connettersi al server Backend.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4ade80';
    if (score >= 50) return '#facc15';
    return '#f87171';
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2.2rem', margin: '0 0 8px 0' }}>
          <ShieldCheck size={42} color="#3b82f6" /> Web Security Checker
        </h1>
        <p style={{ color: '#9ca3af', margin: 0 }}>Analizza il livello di protezione SSL/TLS ed Header HTTP di qualsiasi sito web</p>
      </header>

      <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', marginBottom: '2.5rem' }}>
        <input
          type="text"
          placeholder="Inserisci un URL (es. repubblica.it o poliba.it)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: '14px 18px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #374151',
            backgroundColor: '#1f2937',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Analisi...' : <><Search size={18} /> Scansiona</>}
        </button>
      </form>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#7f1d1d', color: '#fca5a5', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #ef4444' }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          {/* Card Punteggio */}
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            border: '1px solid #374151', 
            backgroundColor: '#111827', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#9ca3af', fontWeight: '500' }}>Punteggio Finale di Sicurezza</h2>
            <div style={{ fontSize: '56px', fontWeight: '800', color: getScoreColor(result.score), lineHeight: '1' }}>
              {result.score} <span style={{ fontSize: '24px', color: '#6b7280', fontWeight: '400' }}>/ 100</span>
            </div>
          </div>

          {/* Dettagli Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* SSL Box */}
            <div style={{ padding: '1.5rem', border: '1px solid #374151', backgroundColor: '#111827', borderRadius: '14px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.2rem 0', color: '#f3f4f6', fontSize: '1.1rem' }}>
                <Lock size={22} color="#3b82f6" /> Certificato SSL/TLS
              </h3>
              {result.ssl.valid ? (
                <div style={{ lineHeight: '1.8', color: '#d1d5db', fontSize: '0.95rem' }}>
                  <p style={{ margin: '6px 0' }}><strong>Stato:</strong> <span style={{ color: '#4ade80' }}>✅ Valido</span></p>
                  <p style={{ margin: '6px 0' }}><strong>Emittente:</strong> {result.ssl.issuer}</p>
                  <p style={{ margin: '6px 0' }}><strong>Scadenza:</strong> {result.ssl.expire_date}</p>
                  <p style={{ margin: '6px 0' }}><strong>Giorni rimasti:</strong> {result.ssl.days_until_expire}</p>
                </div>
              ) : (
                <p style={{ color: '#f87171' }}>❌ Certificato non valido o non presente: {result.ssl.error}</p>
              )}
            </div>

            {/* Headers Box */}
            <div style={{ padding: '1.5rem', border: '1px solid #374151', backgroundColor: '#111827', borderRadius: '14px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.2rem 0', color: '#f3f4f6', fontSize: '1.1rem' }}>
                <FileText size={22} color="#3b82f6" /> Header di Sicurezza
              </h3>
              {result.headers.status_code ? (
                <div style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Status HTTP:</strong> <span style={{ color: '#60a5fa' }}>{result.headers.status_code}</span></p>
                  
                  {result.headers.final_url && (
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#9ca3af' }}>
                      <strong>URL Risolto:</strong> <code style={{ color: '#60a5fa', backgroundColor: '#1f2937', padding: '2px 6px', borderRadius: '4px' }}>{result.headers.final_url}</code>
                    </p>
                  )}

                  <p style={{ margin: '8px 0 4px 0', fontWeight: 'bold' }}>Presenti ({Object.keys(result.headers.present_headers).length}):</p>
                  <ul style={{ listStyle: 'none', paddingLeft: '0', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                    {Object.keys(result.headers.present_headers).length > 0 ? (
                      Object.keys(result.headers.present_headers).map((h) => (
                        <li key={h} style={{ color: '#4ade80' }}>✅ {h}</li>
                      ))
                    ) : (
                      <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nessuno</li>
                    )}
                  </ul>

                  <p style={{ margin: '8px 0 4px 0', fontWeight: 'bold' }}>Mancanti ({result.headers.missing_headers.length}):</p>
                  <ul style={{ listStyle: 'none', paddingLeft: '0', margin: '0', lineHeight: '1.6' }}>
                    {result.headers.missing_headers.map((h) => (
                      <li key={h} style={{ color: '#f87171' }}>❌ {h}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ color: '#f87171' }}>❌ Impossibile analizzare gli header.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;