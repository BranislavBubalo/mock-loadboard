'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distance: '',
    rate: '',
    equipment: 'Van',
    broker: '',
    broker_email: '',
    pickup_date: '',
    commodity: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/loads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setMessage('✅ Load added successfully!')
        // Reset form
        setFormData({
          origin: '',
          destination: '',
          distance: '',
          rate: '',
          equipment: 'Van',
          broker: '',
          broker_email: '',
          pickup_date: '',
          commodity: ''
        })
      } else {
        setMessage('❌ Error: ' + data.error)
      }
    } catch (error) {
      setMessage('❌ Network error')
    }

    setLoading(false)
  }

  const handleGenerateRandom = () => {
    const routes = [
      { origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', distance: 373 },
      { origin: 'Chicago, IL', destination: 'Dallas, TX', distance: 967 },
      { origin: 'Seattle, WA', destination: 'Portland, OR', distance: 173 },
      { origin: 'Miami, FL', destination: 'Boston, MA', distance: 1499 },
      { origin: 'Denver, CO', destination: 'Salt Lake City, UT', distance: 525 }
    ]

    const brokers = ['TQL', 'C.H. Robinson', 'Echo Global', 'Coyote', 'Landstar']
    const equipments = ['Van', 'Reefer', 'Flatbed', 'Stepdeck']
    const commodities = ['Electronics', 'Food', 'Furniture', 'Auto Parts', 'Paper']

    const route = routes[Math.floor(Math.random() * routes.length)]
    const broker = brokers[Math.floor(Math.random() * brokers.length)]
    const equipment = equipments[Math.floor(Math.random() * equipments.length)]
    const commodity = commodities[Math.floor(Math.random() * commodities.length)]

    const ratePerMile = 1.8 + Math.random() * 1.5 // $1.80 - $3.30/mile
    const rate = Math.round(route.distance * ratePerMile)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    setFormData({
      origin: route.origin,
      destination: route.destination,
      distance: route.distance.toString(),
      rate: rate.toString(),
      equipment,
      broker,
      broker_email: `dispatch@${broker.toLowerCase().replace(/\s/g, '')}.com`,
      pickup_date: tomorrow.toISOString().split('T')[0],
      commodity
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">🔧 Admin Panel</h1>
            <p className="text-purple-200">Add loads to Mock Load Board</p>
          </div>
          <Link
            href="/"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all">
            ← Back to Board
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              🎲 Generate Random Load
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Origin & Destination */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Origin *</label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Los Angeles, CA"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Destination *</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Phoenix, AZ"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
            </div>

            {/* Distance & Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Distance (miles) *</label>
                <input
                  type="number"
                  required
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="373"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Rate ($) *</label>
                <input
                  type="number"
                  required
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="2500"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
            </div>

            {/* Equipment & Pickup Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Equipment *</label>
                <select
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option value="Van">Van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Stepdeck">Stepdeck</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Pickup Date</label>
                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>
            </div>

            {/* Broker Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Broker</label>
                <input
                  type="text"
                  value={formData.broker}
                  onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                  placeholder="TQL"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Broker Email</label>
                <input
                  type="email"
                  value={formData.broker_email}
                  onChange={(e) => setFormData({ ...formData, broker_email: e.target.value })}
                  placeholder="dispatch@tql.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
                />
              </div>
            </div>

            {/* Commodity */}
            <div>
              <label className="block text-white font-semibold mb-2">Commodity</label>
              <input
                type="text"
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                placeholder="Electronics"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50">
              {loading ? '⏳ Adding...' : '✅ Add Load'}
            </button>

            {message && (
              <div className={`text-center py-3 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
