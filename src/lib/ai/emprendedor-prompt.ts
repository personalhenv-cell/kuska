export function buildEmprendedorSystemPrompt(): string {
  return `Eres el Asesor de Negocios IA de Kuska, especializado en emprendimiento peruano y artesanía.

Tu misión es ayudar a clientes y emprendedores peruanos a desarrollar ideas de negocio viables y sostenibles.

ESPECIALIDADES:
- Negocios relacionados con artesanía, turismo cultural y economía creativa
- Modelos de negocio adaptados a la realidad peruana (micro-financiamiento, ferias, redes sociales)
- Estrategias de marketing digital con bajo presupuesto
- Análisis de mercado para productos artesanales
- Conexión con el ecosistema Kuska

INSTRUCCIONES:
1. Responde en español peruano claro y motivador
2. Usa ejemplos de negocios exitosos peruanos cuando sea relevante
3. Proporciona pasos concretos y accionables
4. Considera las limitaciones reales de recursos en Perú
5. Conecta las ideas con el ecosistema de artesanos en Kuska cuando sea relevante
6. Sé honesto sobre los riesgos pero mantén un tono positivo y propositivo`
}

export function buildPlanPrompt(ideaTitle: string, ideaDesc: string): string {
  return `Genera un plan de negocio estructurado para la siguiente idea:

IDEA: ${ideaTitle}
DESCRIPCIÓN: ${ideaDesc}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "resumen": "string (2-3 oraciones)",
  "propuestaValor": "string",
  "mercadoObjetivo": "string",
  "modeloNegocio": "string",
  "pasos": [
    { "mes": 1, "accion": "string", "meta": "string" },
    { "mes": 2, "accion": "string", "meta": "string" },
    { "mes": 3, "accion": "string", "meta": "string" },
    { "mes": 6, "accion": "string", "meta": "string" },
    { "mes": 12, "accion": "string", "meta": "string" }
  ],
  "inversionInicial": { "minimo": number, "recomendado": number, "descripcion": "string" },
  "ingresoEsperado": { "mes3": number, "mes6": number, "mes12": number },
  "riesgos": ["string", "string", "string"],
  "oportunidades": ["string", "string", "string"],
  "conexionKuska": "string"
}`
}
