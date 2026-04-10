import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()

  const supabase = createClient(cookieStore)
  // Standardised British English dates and strictly raw numerical values.
  
  const csvHeader = 'Date (DD/MM/YYYY),Horse ID,Brix (%),Conductivity (C),Urine pH,Saliva pH,Trainer Observation\n'
  const csvRow1 = '27/03/2026,H-1001,3.5,15.50,6.5,6.6,"Increased water intake by 5 Litres."\n'
  const csvRow2 = '26/03/2026,H-1001,3.8,16.20,6.8,6.8,"No Observation Logged. No Guessing."\n'
  
  const csvData = csvHeader + csvRow1 + csvRow2

  const response = new NextResponse(csvData)
  
  // Set headers to force download as a direct CSV file natively
  response.headers.set('Content-Type', 'text/csv; charset=utf-8')
  response.headers.set('Content-Disposition', 'attachment; filename="Clinical_History_Export.csv"')

  return response
}
