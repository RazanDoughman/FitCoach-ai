import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'


// GET: Fetch all progress logs
export async function GET() {
  const { data, error } = await supabase.from('ProgressLog').select('*')

  if (error) {
    console.error('Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

