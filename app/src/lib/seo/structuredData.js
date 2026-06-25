const BASE_URL = 'https://ley21719.cl';

export const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Ley N° 21.719: Regulación del Tratamiento y Protección de Datos Personales en Chile',
  description: 'Portal completo de cumplimiento de la Ley N° 21.719 de Protección de Datos Personales de Chile. Casos prácticos por sector, brechas de seguridad, guías de certificación MPI y auditor interactivo de cumplimiento TI.',
  author: {
    '@type': 'Organization',
    name: 'Ecosistema Ley 21.719 Chile',
    url: BASE_URL
  },
  publisher: {
    '@type': 'Organization',
    name: 'Ecosistema Ley 21.719 Chile',
    url: BASE_URL
  },
  datePublished: '2024-12-13',
  dateModified: '2026-06-24',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': BASE_URL
  },
  about: {
    '@type': 'Law',
    name: 'Ley N° 21.719',
    alternateName: 'Ley de Protección de Datos Personales de Chile',
    jurisdiction: {
      '@type': 'Country',
      name: 'Chile'
    },
    datePublished: '2024-12-13',
    dateValidFrom: '2024-12-13',
    dateValidThrough: '2026-12-01'
  },
  inLanguage: 'es',
  keywords: ['Ley 21719', 'Protección de Datos', 'Chile', 'APDP', 'RGPD', 'DPD', 'MPI', 'cumplimiento', 'ciberseguridad', 'datos personales', 'ARCO-P']
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es la Ley 21.719 de Protección de Datos Personales de Chile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Ley N° 21.719 es la normativa chilena que regula el tratamiento y protección de datos personales. Publicada el 13 de diciembre de 2024, moderniza la antigua Ley N° 19.628 (1999) y alinea los estándares chilenos con el Reglamento General de Protección de Datos (RGPD) europeo. Entra en plena vigencia el 1 de diciembre de 2026.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuándo entra en vigencia la Ley 21.719?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Ley 21.719 fue publicada el 13 de diciembre de 2024 y entrará en plena vigencia el 1 de diciembre de 2026. Desde esa fecha, la Agencia de Protección de Datos Personales (APDP) podrá aplicar multas de hasta 20.000 UTM o el 4% de los ingresos anuales.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son los derechos ARCO-P de los ciudadanos bajo la Ley 21.719?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los derechos ARCO-P son: Acceso (saber qué datos se tratan), Rectificación (corregir datos inexactos), Cancelación/Supresión (eliminar datos innecesarios), Oposición (oponerse al tratamiento) y Portabilidad (recibir datos en formato estructurado y transferirlos). Estos derechos son obligatorios para todas las organizaciones que traten datos personales en Chile.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuánto es la multa máxima por no cumplir la Ley 21.719?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las multas varían según la gravedad: Leve hasta 5.000 UTM (amonestación), Grave hasta 10.000 UTM o el 2% de ingresos anuales, y Gravísima hasta 20.000 UTM o el 4% de ingresos anuales. En caso de reincidencia en infracciones gravísimas, la multa puede triplicarse hasta 60.000 UTM o suspenderse la actividad de tratamiento.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es el Delegado de Protección de Datos (DPD) en la Ley 21.719?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El DPD (o DPO en inglés) es la persona designada por la organización para supervisar el cumplimiento interno de la ley. Debe tener autonomía funcional, recursos suficientes y reportar directamente a la alta dirección. Puede ser interno o externo (persona natural o jurídica). Es obligatorio para organizaciones de alto riesgo.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es el Modelo de Prevención de Infracciones (MPI)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El MPI es un programa de compliance voluntario que demuestra que la organización ha implementado medidas para prevenir infracciones. Incluye 7 elementos: designación del DPD, inventario de datos (RAT), matriz de riesgos, protocolos ARCO-P, canal de denuncia, capacitación continua y auditoría anual. La certificación funciona como atenuante ante sanciones y tiene vigencia de 3 años.'
      }
    },
    {
      '@type': 'Question',
      name: '¿En cuánto tiempo se debe notificar una brecha de datos a la APDP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El plazo máximo es de 72 horas desde que la organización toma conocimiento de la brecha. Debe notificar a la APDP y, si el riesgo es alto, también a los titulares afectados. La notificación debe incluir: naturaleza de la brecha, datos comprometidos, número de afectados, medidas adoptadas y datos de contacto del DPD.'
      }
    },
    {
      '@type': 'Question',
      name: '¿A qué sectores aplica la Ley 21.719 de Chile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La ley aplica a todos los sectores que traten datos personales en Chile: educación, salud, redes sociales, e-commerce, finanzas/Fintech, recursos humanos, transporte/delivery, IoT/wearables, sector público, seguros, telecomunicaciones, AdTech, gaming, inmobiliario y ONGs. Todos deben adecuarse antes del 1 de diciembre de 2026.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son las bases legales de licitud bajo la Ley 21.719?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las bases legales son: consentimiento del titular, ejecución de un contrato, obligación legal, interés público, interés legítimo del responsable, y tutela de vitalidad del titular o de otra persona. Para datos sensibles se requiere consentimiento explícito o las excepciones legales específicas.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué diferencia tiene la Ley 21.719 con el RGPD europeo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Ley 21.719 chilena está inspirada en el RGPD europeo y comparte principios similares: bases legales de licitud, derechos ARCO-P, obligación de designar un DPD, notificación de brechas en 72 horas y régimen de multas. Las principales diferencias incluyen: la APDP como autoridad (vs. autoridades nacionales europeas), las UTM como unidad de multa (vs. euros) y algunas adaptaciones al contexto chileno.'
      }
    }
  ]
};

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auditor de Cumplimiento TI — Ley 21.719',
  description: 'Herramienta interactiva de autodiagnóstico del sistema de software frente a los 24 controles técnicos de la Ley N° 21.719 de Protección de Datos Personales de Chile.',
  url: `${BASE_URL}/#auditor`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CLP'
  },
  featureList: [
    'Auditoría de 24 controles técnicos',
    '6 dimensiones de cumplimiento',
    'Generación de informes en PDF',
    'Ejemplos de código en Python, JavaScript, PHP y Go',
    'Guías de refactorización',
    'Análisis de gobernanza y ley'
  ],
  inLanguage: 'es'
};

export const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo Adecuar tu Organización a la Ley 21.719 de Protección de Datos de Chile',
  description: 'Guía paso a paso para adecuar los sistemas de información de tu organización a la nueva Ley N° 21.719 de Protección de Datos Personales.',
  totalTime: 'P6M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'CLP',
    value: '0'
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Inventario de datos personales'
    },
    {
      '@type': 'HowToSupply',
      name: 'Política de privacidad'
    },
    {
      '@type': 'HowToSupply',
      name: 'Protocolo de respuesta a incidentes'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Auditor de Cumplimiento TI Ley 21.719'
    }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Diagnóstico',
      text: 'Realiza un inventario completo de todos los datos personales que trata tu organización. Identifica flujos de datos, bases legales y categorías de datos (generales y sensibles).',
      position: 1
    },
    {
      '@type': 'HowToStep',
      name: 'Diseño de Políticas',
      text: 'Elabora la política de privacidad, ajusta contratos con proveedores (DPA) y diseña los mecanismos de consentimiento granular.',
      position: 2
    },
    {
      '@type': 'HowToStep',
      name: 'Implementación Técnica',
      text: 'Implementa controles de seguridad: cifrado en reposo y tránsito, autenticación multifactor, logs de auditoría, endpoints ARCO-P y.hash de contraseñas con bcrypt/argon2.',
      position: 3
    },
    {
      '@type': 'HowToStep',
      name: 'Modelo de Prevención (MPI)',
      text: 'Designa al DPD, crea la matriz de riesgos, establece el canal de denuncia interna y programa capacitaciones continuas.',
      position: 4
    },
    {
      '@type': 'HowToStep',
      name: 'Auditoría y Certificación',
      text: 'Ejecuta el auditor de cumplimiento TI, corrige las brechas identificadas y solicita la certificación MPI ante la APDP.',
      position: 5
    }
  ]
};

export function getBreadcrumbSchema(currentSection) {
  const sectionNames = {
    overview: 'Información General',
    cases: 'Casos por Sector',
    vulnerabilities: 'Brechas de Seguridad',
    guides: 'Guías y Plantillas',
    auditor: 'Auditor de Cumplimiento'
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: BASE_URL
      },
      ...(currentSection !== 'overview' ? [{
        '@type': 'ListItem',
        position: 2,
        name: sectionNames[currentSection] || currentSection,
        item: `${BASE_URL}/#${currentSection}`
      }] : [])
    ]
  };
}

export function getSectionSchema(section) {
  const schemas = {
    overview: articleSchema,
    cases: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Casos de Cumplimiento por Sector — Ley 21.719',
      description: '15 casos prácticos de cumplimiento de la Ley 21.719 en sectores reales: educación, salud, finanzas, e-commerce, redes sociales, gaming, sector público y más.',
      url: `${BASE_URL}/#cases`,
      inLanguage: 'es',
      isPartOf: { '@id': `${BASE_URL}#website` }
    },
    vulnerabilities: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Brechas de Seguridad Reales — Ley 21.719 Chile',
      description: 'Análisis de ciberataques y brechas de seguridad reales en Chile e internacionalmente a la luz de la Ley 21.719: Caja Los Andes, GTD, BancoEstado, Clínica Dávila, Meta, TikTok y más.',
      url: `${BASE_URL}/#vulnerabilities`,
      inLanguage: 'es'
    },
    guides: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Guías y Plantillas de Cumplimiento — Ley 21.719',
      description: 'Guías prácticas de certificación MPI, respuesta a incidentes de ciberseguridad, directorio de emergencia y plantillas de cumplimiento legal descargables.',
      url: `${BASE_URL}/#guides`,
      inLanguage: 'es'
    },
    auditor: webApplicationSchema
  };

  return schemas[section] || articleSchema;
}
