'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Property = {
  id: string
  city: string
  neighborhood: string | null
  property_type: string | null
  reference: string | null
  legal_status: string
  confidence_score: number
  value_mad: number | null
  net_cost_mad: number | null
  charter_pct: number
}

function formatMAD(n: number) {
  return new Intl.NumberFormat('fr-MA').format(n)
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
      } else {
        setProperties(data || [])
      }
      setLoading(false)
    }

    fetchProperties()
  }, [])

  const totalValue = properties.reduce((sum, p) => sum + (p.value_mad || 0), 0)
  const totalNet = properties.reduce((sum, p) => sum + (p.net_cost_mad || 0), 0)

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
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}
            className="hover:text-black transition-colors"
          >
            Heat Map
          </Link>
          <Link 
            href="/pipeline" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}
            className="hover:text-black transition-colors"
          >
            Pipeline
          </Link>
          <Link 
            href="/dashboard" 
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Portfolio
          </Link>
        </div>
      </nav>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Header */}
      <header style={{ padding: '80px 120px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          Investment Portfolio
        </p>
        <h1 style={{ 
          fontSize: 'clamp(64px, 10vw, 140px)', 
          fontWeight: 700, 
          lineHeight: 0.85, 
          letterSpacing: '-0.04em',
          marginTop: 32
        }}>
          PROPERTY
          <br />
          INTELLIGENCE
        </h1>
      </header>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Stats */}
      <section className="grid grid-cols-2" style={{ padding: '80px 120px' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Portfolio Value
          </p>
          <p style={{ 
            fontSize: 'clamp(36px, 5vw, 64px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            marginTop: 20,
            lineHeight: 1
          }}>
            {loading ? '...' : formatMAD(totalValue)}
            <span style={{ fontSize: 16, fontWeight: 400, color: '#ccc', marginLeft: 12 }}>MAD</span>
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Net Acquisition
          </p>
          <p style={{ 
            fontSize: 'clamp(36px, 5vw, 64px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            marginTop: 20,
            lineHeight: 1
          }}>
            {loading ? '...' : formatMAD(totalNet)}
            <span style={{ fontSize: 16, fontWeight: 400, color: '#ccc', marginLeft: 12 }}>MAD</span>
          </p>
        </div>
      </section>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Count */}
      <div style={{ padding: '40px 120px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          {loading ? '...' : `${properties.length} Properties`}
        </p>
      </div>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Property list */}
      {loading ? (
        <div style={{ padding: '80px 120px' }}>
          <p style={{ fontSize: 14, color: '#999' }}>Loading...</p>
        </div>
      ) : properties.length === 0 ? (
        <div style={{ padding: '80px 120px' }}>
          <p style={{ fontSize: 14, color: '#999' }}>No properties yet.</p>
        </div>
      ) : (
        properties.map((property, index) => (
          <div key={property.id}>
            <Link href={`/property/${property.id}`} className="block hover:bg-gray-50 transition-colors">
              <article 
                className="grid items-start"
                style={{ 
                  padding: '60px 120px',
                  gridTemplateColumns: '60px 1fr 180px 180px 200px'
                }}
              >
                {/* Index */}
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc' }}>
                  {String(index + 1).padStart(2, '0')}
                </p>

                {/* Main */}
                <div>
                  <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {property.city}
                  </h2>
                  <p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>
                    {property.neighborhood} · {property.property_type}
                  </p>
                  <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc', marginTop: 12 }}>
                    {property.reference}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                    Status
                  </p>
                  <p style={{ fontSize: 14 }}>
                    {property.legal_status}
                  </p>
                  <div className="flex items-center gap-3" style={{ marginTop: 16 }}>
                    <div style={{ width: 80, height: 3, background: '#f0f0f0' }}>
                      <div style={{ width: `${property.confidence_score}%`, height: '100%', background: '#000' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#ccc' }}>{property.confidence_score}%</span>
                  </div>
                </div>

                {/* Value */}
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                    Value
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {formatMAD(property.value_mad || 0)}
                  </p>
                  <p style={{ fontSize: 11, color: '#ccc', marginTop: 4 }}>MAD</p>
                </div>

                {/* Net */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                    Net Acquisition
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {formatMAD(property.net_cost_mad || 0)}
                  </p>
                  <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                    -{property.charter_pct}% charter
                  </p>
                </div>
              </article>
            </Link>

            {/* Rule */}
            <div style={{ margin: '0 120px', height: 1, background: '#f0f0f0' }} />
          </div>
        ))
      )}

      {/* Spacer */}
      <div style={{ height: 120 }} />

      {/* Footer */}
      <footer 
        className="flex items-center justify-between"
        style={{ padding: '48px 120px', borderTop: '1px solid #f0f0f0' }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc' }}>
          © 2026 The Morocco Oracle
        </p>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc' }}>
          Connected to Supabase
        </p>
      </footer>

      {/* Bottom breathing */}
      <div style={{ height: 60 }} />

    </main>
  )
}
