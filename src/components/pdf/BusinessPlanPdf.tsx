import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: 'Helvetica', color: '#1A0A00' },
  brand: { fontSize: 10, color: '#D4920A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 22, marginBottom: 24, color: '#3D1C02' },
  heading: { fontSize: 14, marginTop: 18, marginBottom: 8, color: '#C84B2F' },
  paragraph: { fontSize: 11, lineHeight: 1.6, marginBottom: 6, color: '#3D1C02' },
})

interface Section {
  heading: string
  lines: string[]
}

/** Parsea el markdown simple que genera el prompt del CFO/Emprendedor IA (## encabezados + párrafos). */
function parseSections(markdown: string): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('##')) {
      current = { heading: line.replace(/^#+\s*/, ''), lines: [] }
      sections.push(current)
    } else if (current) {
      current.lines.push(line.replace(/^[-*]\s*/, '• '))
    } else {
      current = { heading: '', lines: [line] }
      sections.push(current)
    }
  }
  return sections
}

export function BusinessPlanPdf({ title, content }: { title: string; content: string }) {
  const sections = parseSections(content)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Kuska — Emprendedor IA</Text>
        <Text style={styles.title}>{title}</Text>
        {sections.map((section, i) => (
          <View key={i}>
            {section.heading ? <Text style={styles.heading}>{section.heading}</Text> : null}
            {section.lines.map((line, j) => (
              <Text key={j} style={styles.paragraph}>{line}</Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}
