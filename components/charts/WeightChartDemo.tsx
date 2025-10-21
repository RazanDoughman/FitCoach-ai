'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts'

const sampleData = [
    { date: 'Mon', weight: 70 },
    { date: 'Tue', weight: 69.8 },
    { date: 'Wed', weight: 69.7 },
    { date: 'Thu', weight: 69.5 },
    { date: 'Fri', weight: 69.3 },
    { date: 'Sat', weight: 69.2 },
    { date: 'Sun', weight: 69.1 },
]

export default function WeightChartDemo() {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Weekly Weight Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
