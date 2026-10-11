# Villa Cielo Abierto

Aplicación web progresiva e interactiva orientada a la interpretación ambiental, registro de biodiversidad y simulación de redes tróficas en la Reserva Natural Municipal Villa Cielo y los Balcones del Cerro Uritorco (Capilla del Monte, Córdoba).

## Características

- **Registro y perfiles adaptativos:** Segmentación automática según edad (1 a 14 años: perfil infantil con dinámicas visuales y lúdicas; 15 a 99 años: perfil adulto con enfoque analítico y botánico). Soporta autenticación por credenciales o acceso simulado con Google y Facebook.
- **Simulador de red trófica y crisis ambiental:** Modelado interactivo de cadenas alimentarias del bosque serrano. Permite simular el impacto de la pérdida de especies clave y contingencias de incendios forestales.
- **Guía de campo y wiki nativa:** Fichas de 40 especies autóctonas verificadas de Punilla (20 de flora y 20 de fauna) con taxonomía, rol ecológico, estado de conservación y datos culturales.
- **Juegos y misiones progresivas:**
  - *Trivia serrana:* Desafíos cronometrados en 3 niveles de dificultad con bancos de preguntas diferenciados por edad.
  - *Memoria silvestre:* Tableros emparejando especies autóctonas con dificultad incremental (3, 4 y 6 pares).
  - *Puzzle del paisaje:* Reconstrucción espacial de senderos y miradores.
  - *Taller de ilustración:* Coloreado de fauna autóctona (Zorro Gris, Picaflor, Corzuela).
  - *Misiones de campo:* Safari fotográfico veloz, clasificación de residuos y trazado de constelaciones nocturnas.
- **Cartografía interactiva:** Mapa vectorial del macizo del Uritorco con senderos (Sendero Bajo, Balcones, Sendero Nocturno), zoom, alternancia día/noche y simulación de localización GPS en sendero.
- **Validación QR y código manual:** Desbloqueo de cartas biológicas mediante cámara o ingreso de códigos alfanuméricos físicos de postes de senderos.
- **Sistema de progresión:** Progresión acotada a 6 rangos de guardaparque donde cada nivel desbloquea utilidades reales en la aplicación.
- **Internacionalización (i18n):** Soporte en tiempo real para Español (ES), English (EN), Português (PT), Deutsch (DE), Français (FR) e Italiano (IT).
- **Accesibilidad y visualización exterior:** Modo nocturno con bajo brillo para astroturismo y modo diurno con opción de tipografía ampliada para lectura bajo sol directo.

## Stack Tecnológico

- **Frontend:** React 19, Vite
- **Estilos:** Tailwind CSS
- **Animaciones y transiciones:** Framer Motion
- **Iconografía:** Lucide React
- **Audio:** Web Audio API (generación acústica sin dependencias externas)

## Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/RicardoCejas/VillaCielo.git
cd VillaCielo

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar compilación de producción
npm run build
```

## Estructura del Código

```text
src/
├── components/
│   ├── layout/       # App shell móvil, barra superior y barra de navegación inferior
│   ├── screens/      # Vistas principales (Home, Wiki, Mapa, Scanner, Red Trófica, Registro)
│   │   └── games/    # Implementaciones de minijuegos y misiones de campo
│   └── ui/           # Modales de nivel, desbloqueo de cartas, rangos y alertas
├── context/          # AppContext (gestión de estado global, persistencia en localStorage)
├── data/             # Datasets de biodiversidad, coordenadas de mapa, trivias y red trófica
└── utils/            # Motor de audio sintetizado y tablas de traducción i18n
```
