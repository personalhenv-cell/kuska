import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1A0A00' },
  header: { marginBottom: 24, borderBottom: '2 solid #D4920A', paddingBottom: 12 },
  brand: { fontSize: 10, color: '#D4920A', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 20, marginTop: 4, color: '#3D1C02' },
  subtitle: { fontSize: 10, color: '#6B4C35', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: 150, marginBottom: 16, border: '1 solid #E5DFD3', borderRadius: 4, padding: 8 },
  image: { width: '100%', height: 110, objectFit: 'cover', borderRadius: 2, marginBottom: 6 },
  imagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#EDE8DE',
    borderRadius: 2,
    marginBottom: 6,
  },
  name: { fontSize: 10.5, fontWeight: 700, color: '#1A0A00', marginBottom: 3 },
  meta: { fontSize: 8.5, color: '#6B4C35', marginBottom: 2 },
  price: { fontSize: 12, fontWeight: 700, color: '#C84B2F', marginTop: 3 },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, fontSize: 8, color: '#6B4C35', textAlign: 'center' },
})

interface CatalogProduct {
  name: string
  price: number
  stock: number
  technique: string
  region: string
  image: string | null
}

export function CatalogPdf({ artisanName, products }: { artisanName: string; products: CatalogProduct[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Kuska — Catálogo de productos</Text>
          <Text style={styles.title}>{artisanName}</Text>
          <Text style={styles.subtitle}>{products.length} piezas disponibles</Text>
        </View>

        <View style={styles.grid}>
          {products.map((p, i) => (
            <View key={i} style={styles.card} wrap={false}>
              {/* Image de @react-pdf/renderer, no HTML — jsx-a11y pide alt igual */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {p.image ? <Image src={p.image} style={styles.image} /> : <View style={styles.imagePlaceholder} />}
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.meta}>{p.technique}</Text>
              <Text style={styles.meta}>{p.region} · Stock: {p.stock}</Text>
              <Text style={styles.price}>S/ {p.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer} fixed>
          Generado desde Kuska — kuska-cyan.vercel.app
        </Text>
      </Page>
    </Document>
  )
}
