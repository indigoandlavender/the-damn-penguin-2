'use client'

import Link from 'next/link'

export default function Heat() {
  return (
    <main className="min-h-screen bg-white text-black">
      
      {/* Nav */}
      <nav className="flex items-center justify-between" style={{ padding: '40px 120px' }}>
        <Link href="/" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
          The Morocco Oracle
        </Link>
        <div className="flex items-center gap-12">
          <Link 
            href="/infrastructure" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}
            className="hover:text-black transition-colors"
          >
            Infrastructure
          </Link>
          <Link 
            href="/heat" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Heat Map
          </Link>
          <Link 
            href="/dashboard" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}
            className="hover:text-black transition-colors"
          >
            Portfolio
          </Link>
        </div>
      </nav>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Header */}
      <header style={{ padding: '120px 120px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          Market Intelligence
        </p>
        <h1 style={{ 
          fontSize: 'clamp(64px, 10vw, 140px)', 
          fontWeight: 700, 
          lineHeight: 0.85, 
          letterSpacing: '-0.04em',
          marginTop: 32
        }}>
          FOLLOW THE
          <br />
          CAPITAL
        </h1>
      </header>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Coming soon */}
      <section style={{ padding: '120px 120px' }}>
        <p style={{ fontSize: 14, color: '#999', maxWidth: 480, lineHeight: 1.8 }}>
          Transaction velocity. Price appreciation. Foreign buyer concentration.
          <br /><br />
          Heat map visualization coming soon.
        </p>
      </section>

    </main>
  )
}
