'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Load = {
  id: string
  origin: string
  destination: string
  distance: number
  rate: number
  rate_per_mile: string | number  // ✅ Može biti string iz DB!
  equipment: string
  broker: string
  pickup_date: string
  commodity: string
  status: string
}

export default function LoadBoardPage() {
  const [loads, setLoads] = useState<Load[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchLoads()
  }, [])

  const fetchLoads = async () => {
    try {
      const res = await fetch('/api/loads/search?status=available')
      const data = await res.json()
      if (data.success) {
        setLoads(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const filteredLoads = loads.filter(load =>
    load.origin.toLowerCase().includes(filter.toLowerCase()) ||
    load.destination.toLowerCase().includes(filter.toLowerCase()) ||
    load.broker.toLowerCase().includes(filter.toLowerCase())
  )

  // ✅ Helper function to safely convert rate_per_mile
  const getRatePerMile = (load: Load) => {
    return typeof load.rate_per_mile === 'string' 
      ? parseFloat(load.rate_per_mile) 
      : load.rate_per_mile
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-2xl">Loading loads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">🚛 Mock Load Board</h1>
            <p className="text-blue-200">Test environment for AI freight matching</p>
          </div>
          <Link
            href="/admin"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all">
            Admin Panel
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by origin, destination, or broker..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-blue-200 text-lg"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm">Total Loads</div>
            <div className="text-white text-3xl font-bold">{loads.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm">Avg Rate/Mile</div>
            <div className="text-white text-3xl font-bold">
              ${loads.length > 0 ? (loads.reduce((sum, l) => sum + getRatePerMile(l), 0) / loads.length).toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm">Total Value</div>
            <div className="text-white text-3xl font-bold">
              ${loads.reduce((sum, l) => sum + Number(l.rate), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm">Total Miles</div>
            <div className="text-white text-3xl font-bold">
              {loads.reduce((sum, l) => sum + Number(l.distance), 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left px-6 py-4 text-blue-200 font-semibold">Load ID</th>
                <th className="text-left px-6 py-4 text-blue-200 font-semibold">Route</th>
                <th className="text-right px-6 py-4 text-blue-200 font-semibold">Rate</th>
                <th className="text-right px-6 py-4 text-blue-200 font-semibold">$/Mile</th>
                <th className="text-right px-6 py-4 text-blue-200 font-semibold">Miles</th>
                <th className="text-left px-6 py-4 text-blue-200 font-semibold">Equipment</th>
                <th className="text-left px-6 py-4 text-blue-200 font-semibold">Broker</th>
                <th className="text-left px-6 py-4 text-blue-200 font-semibold">Pickup</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoads.map((load) => (
                <tr key={load.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-blue-300 font-mono text-sm">{load.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{load.origin}</div>
                    <div className="text-blue-300 text-sm">→ {load.destination}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-400 font-bold text-lg">
                      ${Number(load.rate).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-200 font-semibold">
                      ${getRatePerMile(load).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-white">{load.distance}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-200">{load.equipment}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{load.broker}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-200">{load.pickup_date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLoads.length === 0 && (
          <div className="text-center py-20">
            <div className="text-blue-200 text-xl">No loads found</div>
          </div>
        )}
      </div>
    </div>
  )
}
