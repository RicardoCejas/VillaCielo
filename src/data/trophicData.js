// Red Trófica e Interacciones Ecológicas Reales de Villa Cielo y las Sierras de Córdoba

export const TROPHIC_LEVELS = [
  {
    id: 'apex',
    name: 'Depredadores Tope & Carroñeros',
    subtitle: 'Nivel Trófico 4 · Reguladores del Ecosistema',
    color: 'bg-rose-950 text-rose-200 border-rose-800',
    badgeBg: 'bg-rose-500/20 text-rose-300',
    description: 'Controlan poblaciones de herbívoros y limpian los restos orgánicos de las sierras, impidiendo epidemias en los arroyos.'
  },
  {
    id: 'carnivores',
    name: 'Depredadores Intermedios (Mesodepredadores)',
    subtitle: 'Nivel Trófico 3 · Controladores biológicos',
    color: 'bg-amber-950 text-amber-200 border-amber-800',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    description: 'Cazan roedores, reptiles e insectos, además de alimentarse de frutos silvestres y actuar como dispersores de semillas.'
  },
  {
    id: 'herbivores',
    name: 'Consumidores Primarios (Herbívoros & Frugívoros)',
    subtitle: 'Nivel Trófico 2 · Transformadores de biomasa',
    color: 'bg-emerald-950 text-emerald-200 border-emerald-800',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    description: 'Consumen hojas, pastizales, néctar y frutos. Regulan la biomasa vegetal combustible y son presa vital de los depredadores.'
  },
  {
    id: 'producers',
    name: 'Productores Primarios (Flora Autóctona)',
    subtitle: 'Nivel Trófico 1 · Creadores de vida y suelo',
    color: 'bg-teal-950 text-teal-200 border-teal-800',
    badgeBg: 'bg-teal-500/20 text-teal-300',
    description: 'Fijan la energía solar, generan suelo fértil, captan la humedad de las neblinas del Uritorco y alimentan a toda la red.'
  }
];

export const TROPHIC_SPECIES = [
  // 🦅 NIVEL 4: TOP PREDATORS & SCAVENGERS
  {
    id: 'puma',
    name: 'Puma Serrano',
    scientific: 'Puma concolor',
    level: 'apex',
    x: 20,
    y: 12,
    role: 'Superdepredador tope',
    image: '/images/puma.jpg',
    eats: ['corzuela', 'cuis', 'zorro'],
    eatenBy: [],
    ecologicalService: 'Regula las poblaciones de herbívoros para evitar el sobrepastoreo de renovales de árboles serranos.',
    collapseEffect: 'Al desaparecer, proliferan sin control los herbívoros y zorros, destruyendo los brotes tiernos de algarrobos y molles.',
    status: 'Casi amenazado en Córdoba'
  },
  {
    id: 'condor',
    name: 'Cóndor Andino',
    scientific: 'Vultur gryphus',
    level: 'apex',
    x: 50,
    y: 10,
    role: 'Carroñero mayor de altura',
    image: '/images/condor.jpg',
    eats: ['corzuela', 'cuis'], // Carroña de estos
    eatenBy: [],
    ecologicalService: 'Sanea el ecosistema al consumir restos de animales caídos antes de que contaminen las vertientes de agua del Uritorco.',
    collapseEffect: 'Su ausencia por cebos tóxicos provoca brotes de bacterias patógenas (ántrax, botulismo) en las cuencas hídricas.',
    status: 'Amenazado'
  },
  {
    id: 'jote',
    name: 'Jote Cabeza Negra',
    scientific: 'Coragyps atratus',
    level: 'apex',
    x: 80,
    y: 12,
    role: 'Limpiador ecológico serrano',
    image: '/images/jote.jpg',
    eats: ['corzuela', 'cuis', 'lagarto'],
    eatenBy: [],
    ecologicalService: 'Patrulla las quebradas consumiendo despojos con su sistema digestivo inmune a toxinas letales.',
    collapseEffect: 'Aumenta el riesgo de zoonosis y descomposición no regulada en zonas turísticas y senderos.',
    status: 'Común'
  },

  // 🦊 NIVEL 3: MESODEPREDADORES
  {
    id: 'zorro',
    name: 'Zorro Gris Pampeano',
    scientific: 'Lycalopex gymnocercus',
    level: 'carnivores',
    x: 22,
    y: 36,
    role: 'Sembrador del monte & Controlador',
    image: '/images/zorro.jpg',
    eats: ['cuis', 'piquillin', 'lagarto'],
    eatenBy: ['puma'],
    ecologicalService: 'Principal dispersor biológico de semillas de tala, algarrobo y piquillín; al digerirlas escarifica la semilla para su germinación.',
    collapseEffect: 'Si desaparece, las semillas caen bajo la copa del árbol progenitor y mueren por hongos; el monte pierde su capacidad de regeneración.',
    status: 'Preocupación menor'
  },
  {
    id: 'halconcito',
    name: 'Halconcito Colorado',
    scientific: 'Falco sparverius',
    level: 'carnivores',
    x: 50,
    y: 36,
    role: 'Controlador aéreo de roedores e insectos',
    image: '/images/halconcito.jpg',
    eats: ['cuis', 'lagarto', 'picaflor'],
    eatenBy: ['puma'],
    ecologicalService: 'Caza velozmente saltamontes, roedores y pequeñas culebras, impidiendo plagas agrícolas en los valles.',
    collapseEffect: 'Proliferan roedores portadores de virus hantavirus y orugas defoliadoras del bosque nativo.',
    status: 'Común'
  },
  {
    id: 'lagarto',
    name: 'Lagarto Overo',
    scientific: 'Salvator merianae',
    level: 'carnivores',
    x: 78,
    y: 36,
    role: 'Reptil omnívoro de suelo',
    image: '/images/lagarto.jpg',
    eats: ['cuis', 'piquillin', 'peperina'],
    eatenBy: ['zorro', 'puma', 'jote', 'halconcito'],
    ecologicalService: 'Controla caracoles, roedores y dispersa semillas de frutos caídos en las laderas pedregosas.',
    collapseEffect: 'Desequilibrio en la fauna del suelo y exceso de invertebrados depredadores de raíces.',
    status: 'Protegido'
  },

  // 🦌 NIVEL 2: CONSUMIDORES PRIMARIOS (Herbívoros)
  {
    id: 'corzuela',
    name: 'Corzuela Parda',
    scientific: 'Mazama gouazoubira',
    level: 'herbivores',
    x: 20,
    y: 62,
    role: 'Herbívoro ramoneador clave',
    image: '/images/corzuela.jpg',
    eats: ['espinillo', 'pajaBrava'],
    eatenBy: ['puma', 'condor', 'jote'],
    ecologicalService: 'Poda natural de vegetación arbustiva, reduciendo la acumulación de pasto seco que alimenta incendios voraces.',
    collapseEffect: 'La biomasa seca se acumula de forma explosiva, volviendo cualquier foco de incendio incontrolable para los bomberos.',
    status: 'Vulnerable en Córdoba'
  },
  {
    id: 'cuis',
    name: 'Cuis Serrano',
    scientific: 'Microcavia australis',
    level: 'herbivores',
    x: 50,
    y: 62,
    role: 'Ingeniero de pastizales & Presa base',
    image: '/images/cuis.jpg',
    eats: ['pajaBrava', 'peperina', 'piquillin'],
    eatenBy: ['puma', 'zorro', 'halconcito', 'lagarto', 'condor', 'jote'],
    ecologicalService: 'Crea galerías que airean la tierra serrana e infiltran agua; es la presa nutricional fundamental para aves y carnívoros.',
    collapseEffect: 'Al faltar el cuis, colapsan las poblaciones de zorros y halcones que se quedan sin su alimento diario.',
    status: 'Común'
  },
  {
    id: 'picaflor',
    name: 'Picaflor Común',
    scientific: 'Chlorostilbon lucidus',
    level: 'herbivores',
    x: 80,
    y: 62,
    role: 'Polinizador supremo',
    image: '/images/picaflor.jpg',
    eats: ['peperina'],
    eatenBy: ['halconcito'],
    ecologicalService: 'Poliniza flores silvestres con néctar de alta energía en quebradas inaccesibles.',
    collapseEffect: 'Plantas como la peperina y el ceibo reducen drásticamente su fecundación y producción de semillas fértiles.',
    status: 'Común'
  },

  // 🌿 NIVEL 1: PRODUCTORES PRIMARIOS (Flora)
  {
    id: 'peperina',
    name: 'Peperina Serrana',
    scientific: 'Minthostachys mollis',
    level: 'producers',
    x: 15,
    y: 86,
    role: 'Aromática endémica & Esponja de quebrada',
    image: '/images/peperina.jpg',
    eats: [],
    eatenBy: ['picaflor', 'cuis', 'lagarto'],
    ecologicalService: 'Retiene la humedad en laderas sombrías y aporta aceites esenciales antibacterianos al suelo de la reserva.',
    collapseEffect: 'La sobre-recolección desprotege el suelo frente a las lluvias torrenciales, provocando cárcavas y erosión hídrica.',
    status: 'Vulnerable por sobre-recolección'
  },
  {
    id: 'espinillo',
    name: 'Espinillo (Caven)',
    scientific: 'Vachellia caven',
    level: 'producers',
    x: 38,
    y: 86,
    role: 'Pionero fijador de nitrógeno',
    image: '/images/espinillo.jpg',
    eats: [],
    eatenBy: ['corzuela'],
    ecologicalService: 'Soporta sequías extremas y fija nitrógeno atmosférico en el suelo pobre y pedregoso de las sierras.',
    collapseEffect: 'El suelo se empobrece y se descalcifica, impidiendo el asentamiento de árboles mayores como el algarrobo.',
    status: 'Resistente'
  },
  {
    id: 'piquillin',
    name: 'Piquillín',
    scientific: 'Condalia microphylla',
    level: 'producers',
    x: 62,
    y: 86,
    role: 'Despensa invernal del monte',
    image: '/images/piquillin.jpg',
    eats: [],
    eatenBy: ['zorro', 'lagarto', 'cuis'],
    ecologicalService: 'Sus bayas dulces nutren a toda la fauna en época estival y sus espinas protegen nidos de aves pequeñas.',
    collapseEffect: 'Aves y zorros se quedan sin su alimento energético clave de verano, reduciendo sus camadas.',
    status: 'Típico serrano'
  },
  {
    id: 'pajaBrava',
    name: 'Paja Brava (Pastizal de Altura)',
    scientific: 'Festuca hieronymi',
    level: 'producers',
    x: 85,
    y: 86,
    role: 'La gran esponja de las Sierras',
    image: '/images/pajaBrava.jpg',
    eats: [],
    eatenBy: ['corzuela', 'cuis'],
    ecologicalService: 'Absorbe las precipitaciones como una esponja gigante en los Balcones del Uritorco, dosificando el agua limpia todo el año.',
    collapseEffect: 'Al quemarse por incendios, el agua no se absorbe: baja en inundaciones destructivas y en invierno los ríos se secan por completo.',
    status: 'Esencial para cuencas hídricas'
  }
];

// 🚨 Escenarios Críticos de Simulación de Impacto Humano y Climático
export const CRISIS_SCENARIOS = [
  {
    id: 'incendios',
    title: 'Incendio Forestal en las Sierras',
    subtitle: 'El desastre más recurrente de Capilla del Monte y el Uritorco',
    icon: '🔥',
    severity: 'Crítica (Catástrofe Ecosistémica)',
    disabledSpeciesIds: ['pajaBrava', 'peperina', 'piquillin', 'espinillo', 'cuis'],
    description: 'El fuego avanza avivado por el viento zonda y pastizales secos. Quema la biomasa vegetal hasta la roca desnuda.',
    causes: '95% provocados por negligencia humana (quemas de basura, fogatas mal apagadas, colillas o especulación inmobiliaria).',
    immediateEffects: [
      'Pérdida instantánea de la "esponja vegetal": las lluvias de verano generan aludes de ceniza hacia el Río Calabalumba.',
      'Destrucción de madrigueras de animales terrestres (cuis, lagarto, corzuelas acorraladas).',
      'Desaparición de poblaciones vírgenes de Peperina y frutos de Piquillín.'
    ],
    chainReaction: 'Sin cobertura vegetal, la radiación solar calcina el sustrato bacteriano; los herbívoros huyen o mueren por inanición y los depredadores bajan a zonas urbanas buscando comida.',
    actionGuide: '🚫 Jamás encender fuego en zonas no habilitadas. 📞 Ante una columna de humo, llamar inmediatamente al 911 o a los Bomberos Voluntarios de Capilla del Monte (03548-481333).'
  },
  {
    id: 'caza_puma',
    title: 'Persecución del Puma Serrano',
    subtitle: 'Conflicto por ganadería y desbalance trófico',
    icon: '🐾',
    severity: 'Grave (Pérdida de Depredador Clave)',
    disabledSpeciesIds: ['puma'],
    description: 'La caza o trampeo ilegal del puma elimina la cúspide de la pirámide trófica de las Sierras de Córdoba.',
    causes: 'Retaliación ganadera sin medidas disuasorias (perros protectores o boyeros eléctricos).',
    immediateEffects: [
      'Explosión demográfica de herbívoros y mesodepredadores sin control natural.',
      'Sobrepastoreo severo de brotes y plántulas de árboles autóctonos.',
      'Debilitamiento genético de las poblaciones de corzuelas al no haber selección natural sobre animales enfermos.'
    ],
    chainReaction: 'El bosque serrano envejece y no nacen nuevos árboles, transformando monte denso en un matorral degradado.',
    actionGuide: 'Fomentar la coexistencia con boyeros solares y respetar los corredores biológicos de la Reserva Villa Cielo.'
  },
  {
    id: 'mascotas_sueltas',
    title: 'Perros y Gatos Domésticos Sueltos',
    subtitle: 'Depredación y transmisión de sarna y moquillo',
    icon: '🐕',
    severity: 'Moderada-Alta (Impacto Silencioso)',
    disabledSpeciesIds: ['corzuela', 'cuis', 'picaflor'],
    description: 'Mascotas sin correa dentro o cerca de la reserva cazan fauna autóctona por instinto lúdico.',
    causes: 'Tenencia irresponsable de pobladores y turistas en senderos naturales.',
    immediateEffects: [
      'Jaurías de perros atacan y matan crías de Corzuela Parda.',
      'Gatos domésticos diezman picaflores, aves de nido bajo y lagartos overos.',
      'Transmisión de parásitos y rabia a la fauna silvestre.'
    ],
    chainReaction: 'Disminuye la polinización y los herbívoros abandonan las áreas de senderismo por estrés constante.',
    actionGuide: 'Pasear mascotas siempre con correa y bozal de ser necesario, y jamás abandonarlas en el monte.'
  },
  {
    id: 'sobrexplotacion_peperina',
    title: 'Extracción Comercial de Peperina de Raíz',
    subtitle: 'Depredación de la hierba emblema de Córdoba',
    icon: '🌿',
    severity: 'Alta (Erosión y Pérdida de Biodiversidad)',
    disabledSpeciesIds: ['peperina'],
    description: 'Arrancar la planta entera de raíz para venta de atados impide su floración y regeneración.',
    causes: 'Comercialización desregulada en rutas y puestos turísticos sin planes de cultivo sustentable.',
    immediateEffects: [
      'Desaparición de poblaciones genéticas únicas de la Reserva Villa Cielo.',
      'Pérdida de néctar para picaflores y polinizadores nativos.',
      'Desmoronamiento del sustrato vegetal en quebradas sombrías.'
    ],
    chainReaction: 'Las laderas se vuelven infértiles y proliferan malezas exóticas invasoras como el siempreverde y la acacia negra.',
    actionGuide: 'Nunca arrancar plantas de raíz en la reserva. Consumir sólo peperina de cultivo sustentable certificado.'
  }
];
