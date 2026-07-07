'use client'

import dynamic from 'next/dynamic'
import { Icon } from '@/components/ui/Icon'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <CatalogButtonSkeleton /> },
)
const CatalogPdfLazy = dynamic(() => import('@/components/pdf/CatalogPdf').then((mod) => mod.CatalogPdf), { ssr: false })

interface CatalogProduct {
  name: string
  price: number
  stock: number
  technique: string
  region: string
  image: string | null
}

function CatalogButtonSkeleton() {
  return (
    <span className="inline-flex items-center gap-2 rounded-btn border border-kuska-border bg-white px-4 py-2.5 font-body text-sm font-bold text-kuska-text-mid opacity-60">
      <Icon name="download" className="h-4 w-4" />
      Preparando PDF…
    </span>
  )
}

export function DownloadCatalogButton({ artisanName, products }: { artisanName: string; products: CatalogProduct[] }) {
  if (products.length === 0) return null

  return (
    <PDFDownloadLink
      document={<CatalogPdfLazy artisanName={artisanName} products={products} />}
      fileName={`catalogo-${artisanName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
      className="inline-flex items-center gap-2 rounded-btn border border-kuska-border bg-white px-4 py-2.5 font-body text-sm font-bold text-kuska-text transition-all hover:-translate-y-0.5 hover:border-kuska-gold hover:text-kuska-gold"
    >
      {({ loading }) => (
        <>
          <Icon name="download" className="h-4 w-4" />
          {loading ? 'Generando…' : 'Descargar catálogo PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}
