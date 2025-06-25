import { ImageResponse } from 'next/og'

// Apple icon metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Apple icon generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '36px',
        }}
      >
        {/* Food emoji */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 8,
          }}
        >
          🍽️
        </div>
        
        {/* Small text */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: '-1px',
          }}
        >
          Safe
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 