// Banco de preguntas de Trivia Serrana de Villa Cielo
// Dividido rigurosamente para Niños y Adultos

export const KIDS_TRIVIA_QUESTIONS = [
  {
    id: 'k1',
    q: '¿Qué animalito construye su casita redonda de barro en las ramas?',
    options: ['El Hornero', 'El Cóndor', 'El Zorro'],
    answer: 0,
    explanation: '¡El Hornero es el ave nacional y construye su nido con barro, pasto y ramitas!',
    points: 80,
    timeLimit: 20
  },
  {
    id: 'k2',
    q: '¿De qué se alimenta el picaflor común que vemos en los senderos?',
    options: ['Del néctar dulce de las flores', 'De semillas secas', 'De peces del río'],
    answer: 0,
    explanation: '¡El picaflor bate sus alitas súper rápido para tomar el néctar de las flores del monte!',
    points: 80,
    timeLimit: 20
  },
  {
    id: 'k3',
    q: '¿Qué animal tímido parece un ciervo pequeño y camina sin hacer ruido?',
    options: ['La Corzuela Parda', 'El Elefante', 'El Guanaco'],
    answer: 0,
    explanation: 'La Corzuela Parda es el ciervo nativo de Córdoba y se oculta entre las plantas.',
    points: 80,
    timeLimit: 20
  },
  {
    id: 'k4',
    q: '¿Qué planta serrana tiene rico aroma y la gente usa para ponerle al mate?',
    options: ['La Peperina', 'El Manzano', 'El Pino'],
    answer: 0,
    explanation: 'La Peperina es la planta aromática típica de nuestras sierras cordobesas. ¡No hay que arrancarla de raíz!',
    points: 80,
    timeLimit: 20
  },
  {
    id: 'k5',
    q: '¿Qué debemos hacer siempre si vemos basura en el sendero de la reserva?',
    options: ['Juntarla y tirarla en el tacho ecológico', 'Dejarla tirada', 'Prenderle fuego'],
    answer: 0,
    explanation: '¡Cuidamos el monte dejando los senderos limpios para los animales!',
    points: 80,
    timeLimit: 20
  }
];

export const ADULT_TRIVIA_QUESTIONS = [
  {
    id: 'a1',
    q: '¿Qué cérvido autóctono y tímido habita el bosque cerrado de Villa Cielo?',
    options: ['Corzuela Parda (Mazama gouazoubira)', 'Ciervo Colorado exótico', 'Guanaco serrano'],
    answer: 0,
    explanation: 'La Corzuela Parda es el ciervo autóctono de las sierras cordobesas, vulnerable a los desmontes y perros asilvestrados.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'a2',
    q: '¿Qué rol ecológico primordial cumple el Jote Cabeza Negra en las sierras?',
    options: ['Sanitarista y reciclador de nutrientes', 'Polinizador de espinillos', 'Dispersor primario de semillas'],
    answer: 0,
    explanation: 'Al ser carroñero estricto, su organismo neutraliza bacterias patógenas evitando brotes de peste en el monte.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'a3',
    q: '¿Cuál es la altitud oficial del Cerro Uritorco que custodia a Villa Cielo?',
    options: ['1.949 msnm', '1.250 msnm', '2.800 msnm'],
    answer: 0,
    explanation: 'Con 1.949 msnm, es la cumbre más alta de las Sierras Chicas de Córdoba.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'a4',
    q: '¿Qué río atraviesa Capilla del Monte alimentado por las vertientes de Villa Cielo?',
    options: ['Río Calabalumba', 'Río Suquía', 'Río Mina Clavero'],
    answer: 0,
    explanation: 'El Río Calabalumba nace en las laderas protegidas y es vital para la cuenca hídrica del Valle de Punilla.',
    points: 100,
    timeLimit: 15
  },
  {
    id: 'a5',
    q: '¿Qué árbol serrano perfuma el monte al final del invierno con pompones amarillos?',
    options: ['Espinillo (Vachellia caven)', 'Ceibo criollo', 'Eucalipto invasor'],
    answer: 0,
    explanation: 'El Espinillo o Caven es pionero en la fijación de nitrógeno y primer sustento de insectos polinizadores en primavera temprana.',
    points: 100,
    timeLimit: 15
  }
];

export const SERRANA_TRIVIA_QUESTIONS = ADULT_TRIVIA_QUESTIONS;
export const TRIVIA_QUESTIONS = ADULT_TRIVIA_QUESTIONS;
