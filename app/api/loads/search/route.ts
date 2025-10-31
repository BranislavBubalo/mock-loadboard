import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Query params (mock DAT API format)
    const origin = searchParams.get('origin') || ''
    const destination = searchParams.get('destination') || ''
    const equipment = searchParams.get('equipment') || ''
    const status = searchParams.get('status') || 'available'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log('🔍 Mock Load Board API called:', { origin, destination, equipment, limit })
    
    // Build WHERE conditions
    let whereConditions = [`status = '${status}'`]
    
    if (origin) {
      whereConditions.push(`origin ILIKE '%${origin}%'`)
    }
    
    if (destination) {
      whereConditions.push(`destination ILIKE '%${destination}%'`)
    }
    
    if (equipment) {
      whereConditions.push(`equipment = '${equipment}'`)
    }
    
    const whereClause = whereConditions.join(' AND ')
    
    // Execute query using tagged template
    const loads = await sql`
      SELECT 
        id, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng,
        distance, rate, rate_per_mile, equipment, weight, length, commodity,
        broker, broker_email, broker_phone,
        pickup_date, pickup_time, delivery_date, delivery_time,
        status, created_at
      FROM mock_loads
      WHERE ${sql(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    
    console.log(`✅ Found ${loads.length} loads`)
    
    // Return in DAT-like format
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
