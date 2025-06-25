import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'SafeTable - Transparence Alimentaire en France'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            marginBottom: '30px',
          }}
        >
          🍽️🔍
        </div>
        
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            letterSpacing: '-2px',
          }}
        >
          SafeTable
        </div>
        
        <div
          style={{
            fontSize: '32px',
            color: '#cbd5e1',
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: '500',
          }}
        >
          Transparence Alimentaire en France
        </div>
        
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Explorez les contrôles sanitaires officiels • Alim&apos;confiance • 70k+ établissements
        </div>
        
        <div
          style={{
            marginTop: '40px',
            padding: '12px 24px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid #3b82f6',
            borderRadius: '30px',
            color: '#60a5fa',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          🇫🇷 Données officielles du Ministère de l&apos;Agriculture
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 