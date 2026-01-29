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
  city: string | null
  status: string
  rooms: number | null
  investment_mad: number | null
  lat: number | null
  lng: number | null
}

type Property = {
  id: string
  city: string
  value_mad: number | null
  lat: number | null
  lng: number | null
}

// Flight waypoints: Tangier → Rabat → Casablanca → Marrakech
const waypoints = [
  { name: 'Tangier', center: [-5.8340, 35.7595], zoom: 11, pitch: 60, bearing: 180 },
  { name: 'Rabat', center: [-6.8416, 34.0209], zoom: 13, pitch: 65, bearing: 160 },
  { name: 'Casablanca', center: [-7.5898, 33.5731], zoom: 13.5, pitch: 70, bearing: 140 },
  { name: 'Marrakech', center: [-7.9811, 31.6295], zoom: 12.5, pitch: 60, bearing: 120 },
]

export default function Flight() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([])
  const [pipeline, setPipeline] = useState<Pipeline[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [currentCity, setCurrentCity] = useState<string>('Tangier')
  const [currentData, setCurrentData] = useState<{
    stadiums: number
    hotels: number
    rooms: number
    investment: number
  } | null>(null)
  const [isFlying, setIsFlying] = useState(false)
  const [flightComplete, setFlightComplete] = useState(false)

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
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: waypoints[0].center as [number, number],
      zoom: 6,
      pitch: 45,
      bearing: 0,
      antialias: true,
    })

    map.current.on('load', () => {
      // Add terrain
      map.current!.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
      
      map.current!.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      // Add sky
      map.current!.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      })

      // Add 3D buildings
      map.current!.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 10,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      })
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  // Add markers when data loads
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return

    // Stadium markers (large pulsing circles)
    infrastructure.filter(i => i.category === 'stadium').forEach(stadium => {
      const el = document.createElement('div')
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.9);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        ">
          <span style="color: white; font-size: 10px; font-weight: bold;">⬢</span>
        </div>
      `
      new mapboxgl.Marker(el)
        .setLngLat([stadium.lng, stadium.lat])
        .addTo(map.current!)
    })

    // Hotel markers
    pipeline.forEach(hotel => {
      if (!hotel.lat || !hotel.lng) return
      const el = document.createElement('div')
      el.style.cssText = `
        width: 16px;
        height: 16px;
        background: white;
        border: 2px solid #000;
        transform: rotate(45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `
      new mapboxgl.Marker(el)
        .setLngLat([hotel.lng, hotel.lat])
        .addTo(map.current!)
    })

    // Property markers (red)
    properties.forEach(prop => {
      if (!prop.lat || !prop.lng) return
      const el = document.createElement('div')
      el.style.cssText = `
        width: 14px;
        height: 14px;
        background: #f43f5e;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(244,63,94,0.6);
        animation: pulse 1.5s infinite;
      `
      new mapboxgl.Marker(el)
        .setLngLat([prop.lng, prop.lat])
        .addTo(map.current!)
    })
  }, [infrastructure, pipeline, properties])

  const getCityData = (cityName: string) => {
    const cityCoords: Record<string, { lat: number; lng: number; radius: number }> = {
      'Tangier': { lat: 35.7595, lng: -5.8340, radius: 0.5 },
      'Rabat': { lat: 34.0209, lng: -6.8416, radius: 0.3 },
      'Casablanca': { lat: 33.5731, lng: -7.5898, radius: 0.4 },
      'Marrakech': { lat: 31.6295, lng: -7.9811, radius: 0.5 },
    }

    const coords = cityCoords[cityName]
    if (!coords) return null

    const nearbyStadiums = infrastructure.filter(i => 
      i.category === 'stadium' &&
      Math.abs(i.lat - coords.lat) < coords.radius &&
      Math.abs(i.lng - coords.lng) < coords.radius
    ).length

    const nearbyHotels = pipeline.filter(p =>
      p.city?.toLowerCase().includes(cityName.toLowerCase())
    )

    const totalRooms = nearbyHotels.reduce((sum, h) => sum + (h.rooms || 0), 0)
    const totalInvestment = nearbyHotels.reduce((sum, h) => sum + (h.investment_mad || 0), 0)

    return {
      stadiums: nearbyStadiums,
      hotels: nearbyHotels.length,
      rooms: totalRooms,
      investment: totalInvestment,
    }
  }

  const startFlight = async () => {
    if (!map.current || isFlying) return
    
    setIsFlying(true)
    setFlightComplete(false)

    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i]
      setCurrentCity(wp.name)
      setCurrentData(getCityData(wp.name))

      await new Promise<void>((resolve) => {
        map.current!.flyTo({
          center: wp.center as [number, number],
          zoom: wp.zoom,
          pitch: wp.pitch,
          bearing: wp.bearing,
          duration: i === 0 ? 3000 : 6000,
          essential: true,
        })

        map.current!.once('moveend', () => {
          // Pause at each city
          setTimeout(resolve, 3000)
        })
      })
    }

    setIsFlying(false)
    setFlightComplete(true)
  }

  const resetFlight = () => {
    if (!map.current) return
    
    setFlightComplete(false)
    setCurrentCity('Tangier')
    setCurrentData(null)
    
    map.current.flyTo({
      center: waypoints[0].center as [number, number],
      zoom: 6,
      pitch: 45,
      bearing: 0,
      duration: 2000,
    })
  }

  return (
    <main className="min-h-screen bg-black text-white relative">
      
      {/* Map fills entire screen */}
      <div 
        ref={mapContainer} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw', 
          height: '100vh',
        }} 
      />

      {/* Overlay UI */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        
        {/* Nav */}
        <nav 
          className="flex items-center justify-between"
          style={{ 
            padding: '40px 60px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
            pointerEvents: 'auto',
          }}
        >
          <Link href="/" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
            The Morocco Oracle
          </Link>
          <div className="flex items-center gap-10">
            <Link 
              href="/infrastructure" 
              style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}
              className="hover:opacity-100 transition-opacity"
            >
              Map
            </Link>
            <Link 
              href="/flight" 
              style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              Flight
            </Link>
            <Link 
              href="/pipeline" 
              style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}
              className="hover:opacity-100 transition-opacity"
            >
              Pipeline
            </Link>
            <Link 
              href="/dashboard" 
              style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}
              className="hover:opacity-100 transition-opacity"
            >
              Portfolio
            </Link>
          </div>
        </nav>

        {/* Current city indicator */}
        <div 
          style={{ 
            position: 'fixed', 
            top: '50%', 
            left: 60,
            transform: 'translateY(-50%)',
          }}
        >
          <p style={{ 
            fontSize: 11, 
            letterSpacing: '0.3em', 
            textTransform: 'uppercase',
            opacity: 0.5,
            marginBottom: 16,
          }}>
            Now Viewing
          </p>
          <h1 style={{ 
            fontSize: 'clamp(48px, 8vw, 96px)', 
            fontWeight: 700, 
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            {currentCity.toUpperCase()}
          </h1>

          {/* City data */}
          {currentData && isFlying && (
            <div style={{ marginTop: 40 }}>
              {currentData.stadiums > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>
                    Stadiums
                  </p>
                  <p style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    {currentData.stadiums}
                  </p>
                </div>
              )}
              {currentData.hotels > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>
                    Hotel Pipeline
                  </p>
                  <p style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    {currentData.hotels}
                    <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.5, marginLeft: 12 }}>
                      projects
                    </span>
                  </p>
                </div>
              )}
              {currentData.rooms > 0 && (
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>
                    New Rooms
                  </p>
                  <p style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    {currentData.rooms.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Start button */}
        {!isFlying && (
          <div 
            style={{ 
              position: 'fixed', 
              bottom: 80, 
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={flightComplete ? resetFlight : startFlight}
              style={{
                background: 'white',
                color: 'black',
                border: 'none',
                padding: '20px 48px',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)'
              }}
            >
              {flightComplete ? 'Fly Again' : 'Begin Flight'}
            </button>
          </div>
        )}

        {/* Flight progress */}
        {isFlying && (
          <div 
            style={{ 
              position: 'fixed', 
              bottom: 60, 
              left: 60,
              right: 60,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {waypoints.map((wp, i) => (
              <div 
                key={wp.name}
                style={{ 
                  opacity: currentCity === wp.name ? 1 : 0.3,
                  transition: 'opacity 0.5s',
                }}
              >
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {wp.name}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>

    </main>
  )
}
