'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      
      {/* Nav */}
      <nav className="flex items-center justify-between" style={{ padding: '40px 120px' }}>
        <div className="flex items-center gap-12">
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            English
          </span>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc' }}>
            Français
          </span>
        </div>
        <div className="flex items-center gap-12">
          <Link 
            href="/infrastructure" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            className="hover:opacity-40 transition-opacity"
          >
            Infrastructure
          </Link>
          <Link 
            href="/heat" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            className="hover:opacity-40 transition-opacity"
          >
            Heat Map
          </Link>
          <Link 
            href="/dashboard" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            className="hover:opacity-40 transition-opacity"
          >
            Portfolio
          </Link>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
          The Morocco Oracle
        </span>
      </nav>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Subhead */}
      <div style={{ padding: '50px 120px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          Investment Intelligence
        </p>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginTop: 12 }}>
          2030 World Cup · Morocco
        </p>
      </div>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Hero */}
      <section style={{ padding: '100px 120px 120px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontSize: 'clamp(120px, 14vw, 1120px)', 
            fontWeight: 700, 
            lineHeight: 0.85, 
            letterSpacing: '-0.04em' 
          }}
        >
          WHERE THE
          <br />
          MONEY MOVES
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ 
            fontSize: 12, 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            color: '#999',
            marginTop: 80 
          }}
        >
          National Investment Intelligence
        </motion.p>
      </section>

      {/* Full bleed image placeholder */}
      <div 
        style={{ 
          width: '100%', 
          aspectRatio: '21/9', 
          background: 'linear-gradient(to bottom, #e5e5e5, #d0d0d0)',
          position: 'relative'
        }}
      >
        <p style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 120, 
          fontSize: 11, 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase',
          color: '#666'
        }}>
          Casablanca · Grand Theatre
        </p>
      </div>

      {/* Stats */}
      <section style={{ padding: '120px 120px' }}>
        <div className="grid grid-cols-3 gap-20">
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              Capital Deployed
            </p>
            <p style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', marginTop: 24, lineHeight: 1 }}>
              €4.2B
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              Active Projects
            </p>
            <p style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', marginTop: 24, lineHeight: 1 }}>
              247
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              2030 Readiness
            </p>
            <p style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', marginTop: 24, lineHeight: 1 }}>
              87%
            </p>
          </div>
        </div>
      </section>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Infrastructure section */}
      <section style={{ padding: '120px 120px' }}>
        <Link href="/infrastructure" className="block group">
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            01 · Infrastructure
          </p>
          <h2 
            className="group-hover:opacity-40 transition-opacity"
            style={{ 
              fontSize: 'clamp(48px, 9vw, 120px)', 
              fontWeight: 700, 
              lineHeight: 0.9, 
              letterSpacing: '-0.04em',
              marginTop: 40
            }}
          >
            THE SKELETON
            <br />
            OF 2030
          </h2>
          <p style={{ 
            fontSize: 14, 
            lineHeight: 1.8, 
            color: '#666', 
            maxWidth: 480,
            marginTop: 48
          }}>
            Six stadiums. 1,300 kilometers of high-speed rail. 
            Desalination plants. Solar farms. Everything that 
            must exist before 26 million visitors arrive.
          </p>
        </Link>
      </section>

      {/* Image placeholder */}
      <div 
        style={{ 
          margin: '0 120px', 
          aspectRatio: '16/7', 
          background: '#f0f0f0',
          position: 'relative'
        }}
      >
        <p style={{ 
          position: 'absolute', 
          bottom: 32, 
          left: 32, 
          fontSize: 11, 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase',
          color: '#666'
        }}>
          Grand Stade de Casablanca · 115,000 capacity
        </p>
      </div>

      {/* Spacer */}
      <div style={{ height: 120 }} />

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Heat Map section */}
      <section style={{ padding: '120px 120px' }}>
        <Link href="/heat" className="block group">
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            02 · Heat Map
          </p>
          <h2 
            className="group-hover:opacity-40 transition-opacity"
            style={{ 
              fontSize: 'clamp(48px, 9vw, 120px)', 
              fontWeight: 700, 
              lineHeight: 0.9, 
              letterSpacing: '-0.04em',
              marginTop: 40
            }}
          >
            FOLLOW THE
            <br />
            CAPITAL
          </h2>
          <p style={{ 
            fontSize: 14, 
            lineHeight: 1.8, 
            color: '#666', 
            maxWidth: 480,
            marginTop: 48
          }}>
            Transaction volume. Price appreciation. Foreign buyer 
            concentration. See where the money flows before 
            it flows there.
          </p>
        </Link>
      </section>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Pipeline section */}
      <section style={{ padding: '120px 120px' }}>
        <Link href="/pipeline" className="block group">
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            03 · Pipeline
          </p>
          <h2 
            className="group-hover:opacity-40 transition-opacity"
            style={{ 
              fontSize: 'clamp(48px, 9vw, 120px)', 
              fontWeight: 700, 
              lineHeight: 0.9, 
              letterSpacing: '-0.04em',
              marginTop: 40
            }}
          >
            THE FUTURE,
            <br />
            TRACKED
          </h2>
          <p style={{ 
            fontSize: 14, 
            lineHeight: 1.8, 
            color: '#666', 
            maxWidth: 480,
            marginTop: 48
          }}>
            Every hotel, resort, and development project. 
            Confirmed, under construction, rumored. 
            247 projects. €4.2 billion in value.
          </p>
        </Link>
      </section>

      {/* Dark section */}
      <section style={{ background: '#000', color: '#fff', padding: '160px 120px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666' }}>
          For Machines
        </p>
        <h2 style={{ 
          fontSize: 'clamp(40px, 6vw, 120px)', 
          fontWeight: 700, 
          lineHeight: 0.9, 
          letterSpacing: '-0.03em',
          marginTop: 40
        }}>
          API ACCESS
        </h2>
        <p style={{ 
          fontSize: 14, 
          lineHeight: 1.8, 
          color: '#666', 
          maxWidth: 480,
          marginTop: 48
        }}>
          The beauty is for humans. The API is for machines. 
          Clean JSON. Real-time data. The toll road to Morocco intelligence.
        </p>
        <a 
          href="/api"
          style={{ 
            display: 'inline-block',
            marginTop: 64,
            fontSize: 11, 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            paddingBottom: 8
          }}
          className="hover:opacity-50 transition-opacity"
        >
          Request Access →
        </a>
      </section>

      {/* Footer */}
      <footer 
        className="flex items-center justify-between"
        style={{ padding: '48px 120px' }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc' }}>
          © 2026 The Morocco Oracle
        </p>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc' }}>
          Casablanca · London · Singapore
        </p>
      </footer>

    </main>
  )
}
