import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      origin,
      destination,
      distance,
      rate,
      equipment,
      broker,
      broker_email,
      pickup_date,
      commodity
    } = body
    
    // Validate required fields
    if (!origin || !destination || !distance || !rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Insert into database
    const result = await sql`
      INSERT INTO mock_loads (
        origin, destination, distance, rate, equipment,
        broker, broker_email, pickup_date, commodity, status
      ) VALUES (
        ${origin}, ${destination}, ${parseInt(distance)}, ${parseFloat(rate)}, ${equipment || 'Van'},
        ${broker || 'Unknown'}, ${broker_email || ''}, ${pickup_date || null}, ${commodity || ''}, 'available'
      )
      RETURNING *
    `
    
    console.log('✅ Load created:', result[0].id)
    
    return NextResponse.json({
      success: true,
      data: result[0]
    })
    
  } catch (error: any) {
    console.error('❌ Error creating load:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
