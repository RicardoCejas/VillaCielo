// Banco de preguntas progresivo por niveles para Niños y Adultos en Villa Cielo

export const KIDS_TRIVIA_LEVELS = [
  {
    level: 1,
    title: 'Nivel 1: Animalitos del Sendero',
    requiredExp: 0,
    questions: [
      {
        id: 'k1_1',
        q: '¿Qué animalito construye su casita redonda de barro en las ramas?',
        options: ['El Hornero', 'El Cóndor', 'El Zorro'],
        answer: 0,
        explanation: '¡El Hornero es el ave nacional y construye su nido con barro, pasto y ramitas!',
        points: 50,
        timeLimit: 20
      },
      {
        id: 'k1_2',
        q: '¿De qué color es la cola del Zorro Gris Pampeano?',
        options: ['Grisácea con punta negra', 'Blanca como la nieve', 'Verde brillante'],
        answer: 0,
        explanation: 'Tiene pelaje gris ceniciento con manchas rojizas en las patas y punta de cola negra.',
        points: 50,
        timeLimit: 20
      },
      {
        id: 'k1_3',
        q: '¿Qué animalito vuela rápido y toma el néctar de las flores serranas?',
        options: ['El Picaflor Común', 'El Búho', 'El Cuervo'],
        answer: 0,
        explanation: '¡El picaflor bate sus alas a toda velocidad para alimentarse del néctar!',
        points: 50,
        timeLimit: 20
      }
    ]
  },
  {
    level: 2,
    title: 'Nivel 2: Plantas y Sabores del Monte',
    requiredExp: 50,
    questions: [
      {
        id: 'k2_1',
        q: '¿Qué plantita perfumada usamos en Córdoba para agregarle al mate?',
        options: ['La Peperina', 'El Ombú', 'La Lechuga'],
        answer: 0,
        explanation: 'La Peperina serrana es aromática y muy querida. ¡Hay que protegerla y no arrancarla de raíz!',
        points: 60,
        timeLimit: 18
      },
      {
        id: 'k2_2',
        q: '¿Qué árbol tiene flores amarillas en forma de pompones perfumados?',
        options: ['El Espinillo', 'El Ceibo', 'La Palmera'],
        answer: 0,
        explanation: 'El Espinillo florece al final del invierno llenando el monte de pompones amarillos llamados aromas.',
        points: 60,
        timeLimit: 18
      },
      {
        id: 'k2_3',
        q: '¿Cómo cuidamos a los animalitos cuando caminamos por la reserva?',
        options: ['Caminando por los senderos sin tirar basura', 'Gritando y corriendo', 'Arrancando ramas'],
        answer: 0,
        explanation: 'Respetar el silencio y llevarse los residuos ayuda a mantener seguros a los animales.',
        points: 60,
        timeLimit: 18
      }
    ]
  },
  {
    level: 3,
    title: 'Nivel 3: Guardianes del Cerro Uritorco',
    requiredExp: 120,
    questions: [
      {
        id: 'k3_1',
        q: '¿Qué ciervo pequeño y tímido vive en el monte cerrado de Villa Cielo?',
        options: ['La Corzuela Parda', 'El Ciervo de los Pantanos', 'La Jirafa'],
        answer: 0,
        explanation: 'La Corzuela Parda es el ciervo autóctono serrano de Villa Cielo.',
        points: 70,
        timeLimit: 15
      },
      {
        id: 'k3_2',
        q: '¿Qué debemos hacer si vemos humo o fuego en la montaña?',
        options: ['Avisar urgente a los bomberos y guardaparques', 'Echarle ramas secas', 'Ignorarlo'],
        answer: 0,
        explanation: '¡El fuego es el mayor peligro en Córdoba! Siempre hay que avisar a los bomberos (100 o 911).',
        points: 70,
        timeLimit: 15
      },
      {
        id: 'k3_3',
        q: '¿Qué río fresco bordea a Capilla del Monte desde las sierras?',
        options: ['Río Calabalumba', 'Río Amazonas', 'Río Nilo'],
        answer: 0,
        explanation: 'El Río Calabalumba nace en las vertientes protegidas de nuestras sierras.',
        points: 70,
        timeLimit: 15
      }
    ]
  }
];

export const ADULT_TRIVIA_LEVELS = [
  {
    level: 1,
    title: 'Nivel 1: Ecorregión Chaqueña Serrana',
    requiredExp: 0,
    questions: [
      {
        id: 'a1_1',
        q: '¿Qué cérvido autóctono y tímido habita el bosque cerrado de Villa Cielo?',
        options: ['Corzuela Parda (Mazama gouazoubira)', 'Ciervo Colorado exótico', 'Guanaco serrano'],
        answer: 0,
        explanation: 'La Corzuela Parda es el ciervo autóctono de las sierras cordobesas, vulnerable a los desmontes y perros asilvestrados.',
        points: 80,
        timeLimit: 15
      },
      {
        id: 'a1_2',
        q: '¿Cuál es la altitud de la cumbre del Cerro Uritorco?',
        options: ['1.949 msnm', '1.250 msnm', '2.800 msnm'],
        answer: 0,
        explanation: 'Con 1.949 metros sobre el nivel del mar, es la cumbre más alta de las Sierras Chicas.',
        points: 80,
        timeLimit: 15
      },
      {
        id: 'a1_3',
        q: '¿Qué especie arbórea leguminosa fija nitrógeno en los suelos degradados de Punilla?',
        options: ['Espinillo (Vachellia caven)', 'Pino elliottii', 'Siempreverde invasor'],
        answer: 0,
        explanation: 'El Espinillo es pionero en la sucesión ecológica, fijando nitrógeno y reteniendo el suelo pedregoso.',
        points: 80,
        timeLimit: 15
      }
    ]
  },
  {
    level: 2,
    title: 'Nivel 2: Cadenas Tróficas y Sanidad Ecológica',
    requiredExp: 100,
    questions: [
      {
        id: 'a2_1',
        q: '¿Qué rol ecológico primordial cumple el Jote Cabeza Negra en las sierras?',
        options: ['Sanitarista y reciclador de nutrientes', 'Polinizador de espinillos', 'Dispersor primario de semillas'],
        answer: 0,
        explanation: 'Al ser carroñero estricto, neutraliza patógenos mortales como el ántrax y evita brotes epidémicos.',
        points: 90,
        timeLimit: 15
      },
      {
        id: 'a2_2',
        q: '¿Por qué el sobrepastoreo y extracción de Peperina desestabilizan el suelo serrano?',
        options: ['Remueven la cubierta protectora que evita la escorrentía torrencial', 'Aumentan la humedad del suelo', 'Generan sombra excesiva'],
        answer: 0,
        explanation: 'Al perder el tapiz herbáceo, las lluvias estivales lavan la delgada capa de humus serrano.',
        points: 90,
        timeLimit: 15
      },
      {
        id: 'a2_3',
        q: '¿Qué felino nativo actúa como depredador tope controlando roedores y liebres?',
        options: ['Puma (Puma concolor)', 'León africano', 'Lince europeo'],
        answer: 0,
        explanation: 'El puma regula las poblaciones de herbívoros y mesodepredadores, manteniendo el equilibrio del bosque.',
        points: 90,
        timeLimit: 15
      }
    ]
  },
  {
    level: 3,
    title: 'Nivel 3: Gestión de Cuencas e Incendios Forestales',
    requiredExp: 220,
    questions: [
      {
        id: 'a3_1',
        q: '¿Cuál es el principal factor de riesgo en la propagación de incendios en las sierras cordobesas?',
        options: ['Viento norte seco, baja humedad y acumulación de pastizal seco (regla 30-30-30)', 'Caída de nieve tardía', 'Niebla persistente'],
        answer: 0,
        explanation: 'La regla del 30 (temperatura >30°C, humedad <30%, viento >30 km/h) crea condiciones extremas para el fuego.',
        points: 100,
        timeLimit: 15
      },
      {
        id: 'a3_2',
        q: '¿Qué impacto genera el fuego en la cuenca del Río Calabalumba?',
        options: ['Impermeabiliza el suelo con cenizas y provoca crecidas violentas con arrastre de sedimentos', 'Purifica las napas freáticas', 'Mejora la retención de agua'],
        answer: 0,
        explanation: 'El suelo calcinado repele el agua, provocando aluviones que colmatan diques y arroyos.',
        points: 100,
        timeLimit: 15
      },
      {
        id: 'a3_3',
        q: '¿Qué ley provincial protege el bosque nativo categorizando las zonas en rojo, amarillo y verde en Córdoba?',
        options: ['Ley 9.814 de Ordenamiento Territorial de Bosques Nativos', 'Ley de Minería 1.000', 'Decreto Municipal 42'],
        answer: 0,
        explanation: 'La Ley 9.814 establece zonas rojas de máxima conservación donde el cambio de uso de suelo está estrictamente prohibido.',
        points: 100,
        timeLimit: 15
      }
    ]
  }
];

export const KIDS_TRIVIA_QUESTIONS = KIDS_TRIVIA_LEVELS[0].questions;
export const ADULT_TRIVIA_QUESTIONS = ADULT_TRIVIA_LEVELS[0].questions;
export const SERRANA_TRIVIA_QUESTIONS = ADULT_TRIVIA_QUESTIONS;
export const TRIVIA_QUESTIONS = ADULT_TRIVIA_QUESTIONS;
