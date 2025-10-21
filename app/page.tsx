'use client'
import WeightChartDemo from '@/components/charts/WeightChartDemo'
import { useQuery } from '@tanstack/react-query'

export default function ChartPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <WeightChartDemo />
        </main>
    )
}

