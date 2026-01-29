'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Project = {
  id: string
  name: string
  developer: string | null
  category: string | null
  city: string | null
  status: string
  rooms: number | null
  investment_mad: number | null
  expected_opening: number | null
}

function formatMAD(n: number) {
  return new Intl.NumberFormat('fr-MA').format(n)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'construction': return '#000'
    case 'confirmed': return '#666'
    case 'rumored': return '#ccc'
    case 'open': return '#22c55e'
    default: return '#999'
  }
}

export default function Pipeline() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('pipeline')
        .select('*')
        .order('expected_opening', { ascending: true })

      if (error) {
        console.error('Error fetching pipeline:', error)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const totalInvestment = projects.reduce((sum, p) => sum + (p.investment_mad || 0), 0)
  const totalRooms = projects.reduce((sum, p) => sum + (p.rooms || 0), 0)

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
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Pipeline
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
      <header style={{ padding: '80px 120px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          Development Tracker
        </p>
        <h1 style={{ 
          fontSize: 'clamp(64px, 10vw, 140px)', 
          fontWeight: 700, 
          lineHeight: 0.85, 
          letterSpacing: '-0.04em',
          marginTop: 32
        }}>
          THE FUTURE,
          <br />
          TRACKED
        </h1>
      </header>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Stats */}
      <section className="grid grid-cols-3" style={{ padding: '80px 120px' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Total Investment
          </p>
          <p style={{ 
            fontSize: 'clamp(32px, 4vw, 56px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            marginTop: 20,
            lineHeight: 1
          }}>
            {loading ? '...' : `${(totalInvestment / 1000000000).toFixed(1)}B`}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#ccc', marginLeft: 8 }}>MAD</span>
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Projects
          </p>
          <p style={{ 
            fontSize: 'clamp(32px, 4vw, 56px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            marginTop: 20,
            lineHeight: 1
          }}>
            {loading ? '...' : projects.length}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            New Rooms
          </p>
          <p style={{ 
            fontSize: 'clamp(32px, 4vw, 56px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            marginTop: 20,
            lineHeight: 1
          }}>
            {loading ? '...' : formatMAD(totalRooms)}
          </p>
        </div>
      </section>

      {/* Rule */}
      <div style={{ margin: '0 120px', height: 1, background: '#e5e5e5' }} />

      {/* Project list */}
      {loading ? (
        <div style={{ padding: '80px 120px' }}>
          <p style={{ fontSize: 14, color: '#999' }}>Loading...</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <div key={project.id}>
            <article 
              className="grid items-start"
              style={{ 
                padding: '60px 120px',
                gridTemplateColumns: '60px 1fr 140px 140px 160px'
              }}
            >
              {/* Index */}
              <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc' }}>
                {String(index + 1).padStart(2, '0')}
              </p>

              {/* Main */}
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {project.name}
                </h2>
                <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>
                  {project.developer}
                </p>
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc', marginTop: 8 }}>
                  {project.city} · {project.category}
                </p>
              </div>

              {/* Status */}
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                  Status
                </p>
                <p style={{ 
                  fontSize: 12, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: getStatusColor(project.status)
                }}>
                  {project.status}
                </p>
              </div>

              {/* Rooms */}
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                  Rooms
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {project.rooms || '—'}
                </p>
              </div>

              {/* Opening */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: 12 }}>
                  Expected
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {project.expected_opening || '—'}
                </p>
              </div>
            </article>

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
          Live Data
        </p>
      </footer>

    </main>
  )
}
