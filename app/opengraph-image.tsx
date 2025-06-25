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
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #10b981 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* Food emojis */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
              display: 'flex',
              gap: '20px',
            }}
          >
            🍽️🔍
          </div>
          
          {/* Main title */}
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
            <span style={{ color: '#3b82f6' }}>Safe</span>Table
          </div>
          
          {/* Subtitle */}
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
          
          {/* Description */}
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
          
          {/* Bottom accent */}
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
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 