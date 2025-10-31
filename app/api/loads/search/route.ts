import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const origin = searchParams.get('origin') || ''
    const destination = searchParams.get('destination') || ''
    const equipment = searchParams.get('equipment') || ''
    const status = searchParams.get('status') || 'available'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log('🔍 Mock Load Board API:', { origin, destination, equipment, limit })
    
    // Simple approach: Get all matching status, filter in memory if needed
    let loads
    
    if (origin || destination || equipment) {
      // Filtered query
      loads = await sql`
        SELECT 
          id, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng,
          distance, rate, rate_per_mile, equipment, weight, length, commodity,
          broker, broker_email, broker_phone,
          pickup_date, pickup_time, delivery_date, delivery_time,
          status, created_at
        FROM mock_loads
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT 200
      `
      
      // Filter in JavaScript
      loads = loads.filter(load => {
        if (origin && !load.origin.toLowerCase().includes(origin.toLowerCase())) return false
        if (destination && !load.destination.toLowerCase().includes(destination.toLowerCase())) return false
        if (equipment && load.equipment !== equipment) return false
        return true
      }).slice(0, limit)
      
    } else {
      // No filters - direct query
      loads = await sql`
        SELECT 
          id, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng,
          distance, rate, rate_per_mile, equipment, weight, length, commodity,
          broker, broker_email, broker_phone,
          pickup_date, pickup_time, delivery_date, delivery_time,
          status, created_at
        FROM mock_loads
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    }
    
    console.log(`✅ Found ${loads.length} loads`)
    
    return NextResponse.json({
      success: true,
      count: loads.length,
      data: loads,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
