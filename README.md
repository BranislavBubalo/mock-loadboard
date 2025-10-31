# 🚛 Mock Load Board

Test environment for TruckFlow AI freight matching platform.

## 🎯 Purpose

This mock load board simulates real load board APIs (DAT, Truckstop, 123Loadboard) for testing AI scoring algorithms without paying for API subscriptions.

## 🚀 Features

- **Public Load Board** - View available loads (mimics DAT interface)
- **Admin Panel** - Add/manage test loads
- **API Endpoint** - Mock DAT API format for AI agent testing
- **Random Generator** - Create realistic test data instantly

## 📦 Setup

### 1. Neon Database

Create a new Neon project:
```
https://console.neon.tech
```

Run the SQL schema from `DATABASE.sql`

### 2. Environment Variables
```bash
cp .env.example .env.local
```

Add your Neon connection string to `.env.local`:
```
DATABASE_URL=postgres://username:password@host.neon.tech/dbname
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit:
- Public Board: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API Endpoint: http://localhost:3000/api/loads/search

## 🔌 API Usage

### Search Loads
```bash
curl 'http://localhost:3000/api/loads/search?origin=Los%20Angeles&equipment=Van&limit=10'
```

Response format (matches DAT API):
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "MOCK0123",
      "origin": "Los Angeles, CA",
      "destination": "Phoenix, AZ",
      "distance": 373,
      "rate": 2500.00,
      "rate_per_mile": 6.70,
      "equipment": "Van",
      "broker": "TQL",
      "pickup_date": "2025-11-01"
    }
  ]
}
```

### AI Agent Integration

In TruckFlow, simply change the API URL:
```typescript
// Test environment
const LOAD_BOARD_API = 'https://mock-loadboard.vercel.app/api/loads/search'

// Production
const LOAD_BOARD_API = 'https://api.dat.com/v1/loads/search'
```

## 🎲 Generate Test Data

1. Go to Admin Panel: `/admin`
2. Click "🎲 Generate Random Load"
3. Submit form
4. Repeat 50-100 times for realistic dataset

## 📊 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Database:** Neon PostgreSQL (serverless)
- **Deployment:** Vercel
- **API:** RESTful JSON (DAT-compatible format)

## 🔗 Links

- Live Site: https://mock-loadboard.vercel.app
- GitHub: https://github.com/BranislavBubalo/mock-loadboard
- Main Project: https://github.com/BranislavBubalo/TruckFlow

---

Built for TruckFlow AI Platform 🚀
