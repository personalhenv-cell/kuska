export type EstadoAlianza = 'carta' | 'conversacion' | 'reunion'

export interface Alianza {
  slug: string
  name: string
  estado: EstadoAlianza
  impacto: string
  compromiso: string
  contacto: string
}

// Nota: estados de ejemplo — Kuska aún no tiene un CRM/dato real de alianzas,
// pero las organizaciones y el tipo de colaboración descrita son reales y
// verosímiles para el sector de emprendimiento e innovación peruano.
export const ALIANZAS: Alianza[] = [
  {
    slug: 'scale',
    name: 'Scale',
    estado: 'reunion',
    impacto:
      'Programa de aceleración para emprendimientos peruanos con potencial de crecimiento. Una alianza con Scale conectaría a los artesanos-emprendedores de Kuska con mentoría en escalamiento comercial y acceso a inversionistas.',
    compromiso:
      'Kuska aporta el pipeline de emprendedores artesanales verificados y datos reales de ventas para que Scale evalúe candidatos con información de mercado auténtica, no solo un pitch.',
    contacto: 'Equipo de Alianzas — Scale Perú',
  },
  {
    slug: 'wichay',
    name: 'Wichay',
    estado: 'conversacion',
    impacto:
      'Organización enfocada en innovación social y desarrollo de comunidades rurales. Comparte la misión de Kuska de generar impacto económico real en comunidades artesanas alejadas de los centros urbanos.',
    compromiso:
      'Kuska se compromete a canalizar un porcentaje del Fondo de Solidaridad de cada compra hacia los proyectos de comunidad que Wichay ya tiene identificados en zonas rurales.',
    contacto: 'Coordinación de Proyectos — Wichay Continental',
  },
  {
    slug: 'utec',
    name: 'UTEC',
    estado: 'reunion',
    impacto:
      'Universidad de Ingeniería y Tecnología — potencial colaboración en investigación aplicada: optimización logística para envíos desde zonas rurales, y estudiantes de innovación validando nuevas funciones de la plataforma.',
    compromiso:
      'Kuska ofrece la plataforma como caso de estudio real y datos anonimizados de operación para proyectos de tesis y cursos de innovación de UTEC.',
    contacto: 'UTEC Ventures — Oficina de Vinculación con la Industria',
  },
  {
    slug: 'emprendeup',
    name: 'EmprendeUP',
    estado: 'carta',
    impacto:
      'Centro de emprendimiento de la Universidad del Pacífico. Podría conectar a los clientes que activan el modo "emprendedor" en Kuska con su ecosistema de mentores y talleres de negocio.',
    compromiso:
      'Kuska integraría el directorio de mentores de EmprendeUP directamente en el módulo Emprendedor IA, para que el plan de negocio generado tenga una siguiente conversación humana real.',
    contacto: 'Centro de Emprendimiento — Universidad del Pacífico',
  },
  {
    slug: 'proinnovate',
    name: 'ProInnóvate',
    estado: 'conversacion',
    impacto:
      'Programa del Ministerio de la Producción que financia innovación y emprendimiento en el Perú. Una alianza abriría la puerta a que artesanos de Kuska postulen a fondos concursables reales del Estado.',
    compromiso:
      'Kuska se compromete a listar activamente las convocatorias de ProInnóvate en el Hub de Capitalización, con acompañamiento en la postulación desde la propia plataforma.',
    contacto: 'Unidad de Enlace — ProInnóvate, Ministerio de la Producción',
  },
  {
    slug: 'bcp',
    name: 'BCP',
    estado: 'carta',
    impacto:
      'El banco más grande del Perú. Una alianza con BCP podría traer educación financiera real y, a futuro, acceso a microcréditos formales para artesanos que hoy dependen solo de capital propio.',
    compromiso:
      'Kuska aporta el historial de ventas verificado de cada artesano como respaldo de comportamiento comercial — información que hoy no existe en ningún buró de crédito para este sector.',
    contacto: 'Gerencia de Sostenibilidad — BCP',
  },
  {
    slug: 'intercorp',
    name: 'Intercorp',
    estado: 'conversacion',
    impacto:
      'Uno de los grupos empresariales más grandes del Perú, con presencia en retail, educación y finanzas. Una alianza podría abrir canales de distribución física para piezas artesanales de Kuska.',
    compromiso:
      'Kuska garantiza trazabilidad completa del origen de cada pieza y del porcentaje que llega directamente al artesano, para que cualquier canal físico mantenga la misma transparencia que la plataforma.',
    contacto: 'Relaciones Corporativas — Intercorp',
  },
  {
    slug: 'romero',
    name: 'Fundación Romero',
    estado: 'reunion',
    impacto:
      'Brazo de responsabilidad social del Grupo Romero, con programas de formación técnica y desarrollo de emprendedores en todo el Perú. Alineado directamente con la Academia Kuska.',
    compromiso:
      'Kuska integraría contenido de formación de la Fundación Romero dentro de la Academia, gratuito para todos los artesanos sin importar su plan de membresía.',
    contacto: 'Área de Proyectos Sociales — Fundación Romero',
  },
  {
    slug: 'wiese',
    name: 'Wiese',
    estado: 'carta',
    impacto:
      'Fundación con trayectoria en cultura y patrimonio peruano. Una alianza natural para el Módulo Raíces — preservar y documentar técnicas ancestrales antes de que se pierdan.',
    compromiso:
      'Kuska aporta el archivo audiovisual real que ya recopila en el Módulo Raíces (historia, audio, genealogía del oficio) como material documental compartido.',
    contacto: 'Dirección Cultural — Fundación Wiese',
  },
]
