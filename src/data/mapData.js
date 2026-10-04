export const MAP_LANDMARKS = [
  {
    id: 'sendero-bosque-serrano',
    title: 'Sendero del Bosque Serrano',
    subtitle: 'Corredor biológico y flora nativa',
    type: 'Sendero Interpretativo',
    difficulty: 'Baja · Familiar',
    distance: '2.1 km',
    elevation: '+85 m',
    time: '45 min',
    coords: { x: 28, y: 64 },
    image: 'https://images.unsplash.com/photo-1733063670581-cb44b1c807ec?auto=format&fit=crop&w=1200&q=85',
    description: 'Atraviesa el corazón boscoso de la Reserva Villa Cielo flanqueado por molles, talas, piquillines y aromáticos espinillos. Es el hábitat predilecto de la corzuela parda y refugio de aves canoras serranas.',
    highlights: [
      'Monte nativo bien conservado',
      'Plantas aromáticas y medicinales (peperina, poleo)',
      'Sombra fresca y suelo de hojarasca natural'
    ],
    actionText: 'Explorar sendero',
    targetScreen: 'wiki'
  },
  {
    id: 'mirador-balcones',
    title: 'Mirador de los Balcones',
    subtitle: 'Balcones del Uritorco (1.150 msnm)',
    type: 'Punto Panorámico',
    difficulty: 'Moderada',
    distance: '3.4 km ida y vuelta',
    elevation: '+180 m',
    time: '35 min de ascenso',
    coords: { x: 74, y: 26 },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    description: 'Impresionante balcón natural de roca granítica con vista directa y panorámica de 360° hacia la cumbre del Místico Cerro Uritorco (1.949 msnm), el dique El Cajón y los cordones serranos del Valle de Punilla.',
    highlights: [
      'Vista privilegiada del Cerro Uritorco',
      'Avistaje térmico de Jotes y Halconcitos',
      'Formaciones de granito rosado erosionado'
    ],
    actionText: 'Ver especies del mirador',
    targetScreen: 'wiki'
  },
  {
    id: 'estacion-qr',
    title: 'Estación de Cartelería QR',
    subtitle: 'Posta 03 · Sendero de los Molles',
    type: 'Estación Interactiva',
    difficulty: 'Accesible',
    distance: 'A 500 m del ingreso',
    elevation: '+20 m',
    time: 'Inmediato',
    coords: { x: 42, y: 44 },
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85',
    description: 'Señalética ecológica con códigos QR interactivos diseñada para registrar avistamientos botánicos y faunísticos en tiempo real, desbloqueando insignias de guardián ambiental en la aplicación.',
    highlights: [
      'Identificación interactiva con cámara',
      'Registro de fauna en la colección',
      'Misiones ecológicas guiadas'
    ],
    actionText: 'Abrir escáner QR',
    targetScreen: 'scan'
  },
  {
    id: 'observatorio-estrellas',
    title: 'Área de Observatorio de Estrellas',
    subtitle: 'Cielo Limpio de Capilla del Monte',
    type: 'Astroturismo y Cielo Oscuro',
    difficulty: 'Baja · Nocturno',
    distance: 'A 800 m del centro de visitantes',
    elevation: '1.080 msnm',
    time: 'Visita nocturna sugerida',
    coords: { x: 64, y: 74 },
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85',
    description: 'Espacio despejado en altura libre de contaminación lumínica. Las noches serranas de Capilla del Monte son reconocidas internacionalmente por su nitidez para avistar la Cruz del Sur, nebulosas y constelaciones australes.',
    highlights: [
      'Cielo oscuro de alta transparencia',
      'Punto de encuentro para puzle astronómico',
      'Identificación de constelaciones del sur'
    ],
    actionText: 'Jugar al Observatorio de Estrellas',
    targetScreen: 'stargazing'
  }
];
