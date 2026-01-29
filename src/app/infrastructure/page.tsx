'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { supabase } from '@/lib/supabase'

mapboxgl.accessToken = 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg'

type Infrastructure = {
  id: string
  name: string
  category: string
  status: string
  capacity: string | null
  lat: number
  lng: number
  completion_year: number | null
}

type Pipeline = {
  id: string
  name: string
  developer: string | null
  category: string
  city: string | null
  status: string
  rooms: number | null
  lat: number | null
  lng: number | null
  expected_opening: number | null
}

type Property = {
  id: string
  city: string
  neighborhood: string | null
  legal_status: string
  value_mad: number | null
  lat: number | null
  lng: number | null
}

const categoryColors: Record<string, string> = {
  stadium: '#000000',
  tgv: '#666666',
  water: '#0ea5e9',
  energy: '#f59e0b',
  hotel: '#000000',
  resort: '#666666',
  'mixed-use': '#999999',
}

const statusColors: Record<string, string> = {
  operational: '#22c55e',
  construction: '#000000',
  planned: '#999999',
  confirmed: '#666666',
  rumored: '#cccccc',
}

export default function InfrastructureMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([])
  const [pipeline, setPipeline] = useState<Pipeline[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [activeLayer, setActiveLayer] = useState<'all' | 'infrastructure' | 'pipeline' | 'properties'>('all')
  const [selected, setSelected] = useState<Infrastructure | Pipeline | Property | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [infraRes, pipeRes, propRes] = await Promise.all([
        supabase.from('infrastructure').select('*'),
        supabase.from('pipeline').select('*'),
        supabase.from('properties').select('*'),
      ])
      if (infraRes.data) setInfrastructure(infraRes.data)
      if (pipeRes.data) setPipeline(pipeRes.data)
      if (propRes.data) setProperties(propRes.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-6.8, 31.8],
      zoom: 5.5,
      pitch: 0,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach(m => m.remove())

    // Infrastructure markers
    if (activeLayer === 'all' || activeLayer === 'infrastructure') {
      infrastructure.forEach(item => {
        const el = document.createElement('div')
        el.className = 'infrastructure-marker'
        el.style.cssText = `
          width: ${item.category === 'stadium' ? 32 : 20}px;
          height: ${item.category === 'stadium' ? 32 : 20}px;
          background: ${categoryColors[item.category] || '#000'};
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `
        el.onmouseenter = () => el.style.transform = 'scale(1.2)'
        el.onmouseleave = () => el.style.transform = 'scale(1)'
        el.onclick = () => {
          setSelected(item)
          setSelectedType('infrastructure')
        }

        new mapboxgl.Marker(el)
          .setLngLat([item.lng, item.lat])
          .addTo(map.current!)
      })
    }

    // Pipeline markers
    if (activeLayer === 'all' || activeLayer === 'pipeline') {
      pipeline.forEach(item => {
        if (!item.lat || !item.lng) return
        const el = document.createElement('div')
        el.className = 'pipeline-marker'
        el.style.cssText = `
          width: 16px;
          height: 16px;
          background: white;
          border: 3px solid ${statusColors[item.status] || '#000'};
          border-radius: 2px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        `
        el.onmouseenter = () => el.style.transform = 'scale(1.3)'
        el.onmouseleave = () => el.style.transform = 'scale(1)'
        el.onclick = () => {
          setSelected(item)
          setSelectedType('pipeline')
        }

        new mapboxgl.Marker(el)
          .setLngLat([item.lng, item.lat])
          .addTo(map.current!)
      })
    }

    // Property markers
    if (activeLayer === 'all' || activeLayer === 'properties') {
      properties.forEach(item => {
        if (!item.lat || !item.lng) return
        const el = document.createElement('div')
        el.className = 'property-marker'
        el.style.cssText = `
          width: 12px;
          height: 12px;
          background: #f43f5e;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `
        el.onmouseenter = () => el.style.transform = 'scale(1.4)'
        el.onmouseleave = () => el.style.transform = 'scale(1)'
        el.onclick = () => {
          setSelected(item)
          setSelectedType('property')
        }

        new mapboxgl.Marker(el)
          .setLngLat([item.lng, item.lat])
          .addTo(map.current!)
      })
    }
  }, [infrastructure, pipeline, properties, activeLayer])

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
            style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
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
      <header className="flex items-end justify-between" style={{ padding: '60px 120px 40px' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            2030 World Cup
          </p>
          <h1 style={{ 
            fontSize: 'clamp(48px, 8vw, 100px)', 
            fontWeight: 700, 
            lineHeight: 0.9, 
            letterSpacing: '-0.04em',
            marginTop: 20
          }}>
            WHERE IT'S
            <br />
            HAPPENING
          </h1>
        </div>

        {/* Layer toggles */}
        <div className="flex gap-6" style={{ paddingBottom: 10 }}>
          {['all', 'infrastructure', 'pipeline', 'properties'].map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer as typeof activeLayer)}
              style={{
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: activeLayer === layer ? '#000' : '#ccc',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeLayer === layer ? '1px solid #000' : '1px solid transparent',
                paddingBottom: 4,
              }}
            >
              {layer}
            </button>
          ))}
        </div>
      </header>

      {/* Map container */}
      <div style={{ position: 'relative', margin: '0 120px', height: '70vh' }}>
        <div 
          ref={mapContainer} 
          style={{ 
            width: '100%', 
            height: '100%',
            border: '1px solid #e5e5e5',
          }} 
        />

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          background: 'white',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>
            Legend
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div style={{ width: 16, height: 16, background: '#000', borderRadius: '50%' }} />
              <span style={{ fontSize: 11 }}>Stadium</span>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ width: 16, height: 16, background: '#666', borderRadius: '50%' }} />
              <span style={{ fontSize: 11 }}>TGV</span>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ width: 12, height: 12, background: 'white', border: '3px solid #000', borderRadius: 2 }} />
              <span style={{ fontSize: 11 }}>Hotel Development</span>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ width: 12, height: 12, background: '#f43f5e', borderRadius: '50%' }} />
              <span style={{ fontSize: 11 }}>Your Property</span>
            </div>
          </div>
        </div>

        {/* Selected detail panel */}
        {selected && (
          <div style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'white',
            padding: '32px',
            width: 320,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                color: '#999',
              }}
            >
              ×
            </button>

            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>
              {selectedType}
            </p>

            {'name' in selected && (
              <>
                <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {selected.name}
                </h3>
                {'category' in selected && (
                  <p style={{ fontSize: 12, color: '#666', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {selected.category}
                  </p>
                )}
                {'developer' in selected && selected.developer && (
                  <p style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
                    {selected.developer}
                  </p>
                )}
              </>
            )}

            {'city' in selected && !('name' in selected) && (
              <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {selected.city}
              </h3>
            )}

            <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
              {'status' in selected && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.status}</span>
                </div>
              )}
              {'capacity' in selected && selected.capacity && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Capacity</span>
                  <span style={{ fontSize: 13 }}>{selected.capacity}</span>
                </div>
              )}
              {'completion_year' in selected && selected.completion_year && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Completion</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.completion_year}</span>
                </div>
              )}
              {'rooms' in selected && selected.rooms && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rooms</span>
                  <span style={{ fontSize: 13 }}>{selected.rooms}</span>
                </div>
              )}
              {'expected_opening' in selected && selected.expected_opening && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Opening</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.expected_opening}</span>
                </div>
              )}
              {'value_mad' in selected && selected.value_mad && (
                <div className="flex justify-between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Value</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{new Intl.NumberFormat('fr-MA').format(selected.value_mad)} MAD</span>
                </div>
              )}
              {'legal_status' in selected && (
                <div className="flex justify-between">
                  <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal</span>
                  <span style={{ fontSize: 13 }}>{selected.legal_status}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div 
        className="grid grid-cols-4"
        style={{ 
          margin: '0 120px',
          borderTop: '1px solid #e5e5e5',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <div style={{ padding: '32px 0', borderRight: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>Stadiums</p>
          <p style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {infrastructure.filter(i => i.category === 'stadium').length}
          </p>
        </div>
        <div style={{ padding: '32px 24px', borderRight: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>TGV Projects</p>
          <p style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {infrastructure.filter(i => i.category === 'tgv').length}
          </p>
        </div>
        <div style={{ padding: '32px 24px', borderRight: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>Hotel Pipeline</p>
          <p style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {pipeline.length}
          </p>
        </div>
        <div style={{ padding: '32px 24px' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>Your Properties</p>
          <p style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {properties.length}
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 80 }} />

    </main>
  )
}
