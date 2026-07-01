'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface SalesPoint {
  date: string
  total: number
}

interface ProductPoint {
  name: string
  sales: number
}

export function SalesLineChart({ data }: { data: SalesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(61,28,2,0.08)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B4C35' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6B4C35' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid rgba(61,28,2,0.12)', fontFamily: 'var(--font-inter)' }}
          formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, 'Ventas']}
        />
        <Line type="monotone" dataKey="total" stroke="#C84B2F" strokeWidth={2.5} dot={{ fill: '#D4920A', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function TopProductsBarChart({ data }: { data: ProductPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(61,28,2,0.08)" />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#6B4C35' }} />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#6B4C35' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(61,28,2,0.12)' }} />
        <Bar dataKey="sales" fill="#2E7A6E" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
