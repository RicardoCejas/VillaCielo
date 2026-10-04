# 🌿 Villa Cielo Abierto — Reserva Natural Municipal
### Capilla del Monte · Sierras de Córdoba, Argentina 🇦🇷

> Prototipo interactivo y educativo de aplicación móvil para la conservación, educación ambiental y exploración interactiva de la **Reserva Natural Municipal Villa Cielo** y los **Balcones del Cerro Uritorco**.

---

## 📱 Descripción del Proyecto

**Villa Cielo Abierto** transforma la experiencia de recorrer los senderos serranos en una aventura interactiva de aprendizaje y concientización ambiental. Diseñada bajo un enfoque de **App Shell responsive** (optimizada para dispositivos móviles y táctiles), permite a turistas, familias y escuelas:

1. **🗺️ Mapa Interactivo de Senderos y Miradores:** Exploración geográfica de los Balcones del Uritorco, Sendero del Bosque Serrano, Postas QR y zonas de observación astronómica.
2. **📖 Álbum & Wiki de 40 Especies Autóctonas:** Fichas biológicas y culturales verificadas (20 de fauna y 20 de flora nativa de las Sierras de Córdoba) con fotografías botánicas y zoológicas reales, nombres científicos, hábitos, estado de conservación y leyendas locales.
3. **🎮 4 Desafíos Lúdicos con Misiones Integradas:**
   - **Trivia natural:** Cuestionario con temporizador sobre biodiversidad e historia de la reserva.
   - **Puzzle del paisaje:** Reconstrucción táctil de los miradores y senderos de Villa Cielo.
   - **Coloreá la fauna:** Taller creativo de ilustración para pintar especies emblemáticas como el Zorro Gris.
   - **Memoria silvestre:** Juego de cartas emparejando especies autóctonas con su icono identificatorio.
   - **+ 3 Misiones de Campo:** Safari Fotográfico veloz, Guardián del Sendero (reciclaje ecológico) y Observatorio de Estrellas (constelaciones del cielo de Capilla del Monte).
4. **🕸️ Red Trófica & Simulador de Equilibrio Ecológico:**
   - Visualización de la pirámide de vida por niveles tróficos.
   - Simulador de perturbaciones reales y **concientización sobre incendios forestales serranos** (pérdida de la esponja hídrica del monte, aludes de ceniza hacia el Río Calabalumba y teléfonos de emergencias de bomberos voluntarios).
5. **📷 Escáner de Códigos QR:** Simulación de lectura de postas físicas ubicadas en la reserva para registrar hallazgos y desbloquear cartas en el álbum.
6. **🛡️ Progresión y Gamificación:** Puntos de experiencia (EXP), rangos de guardaparque virtual y desbloqueo progresivo de contenido.

---

## 🛠️ Stack Tecnológico

- **React 19**
- **Vite** (Build tool y servidor de desarrollo)
- **Tailwind CSS** (Diseño fluido, paleta de colores orgánica inspirada en el monte serrano)
- **Framer Motion** (Animaciones fluidas, transiciones de pantalla y microinteracciones)
- **Lucide React** (Iconografía moderna)
- **Web Audio API** (Efectos de sonido táctiles para clicks, pop, celebraciones y aciertos)
- **Canvas Confetti** (Efectos visuales de recompensa y subida de nivel)

---

## 🚀 Instalación y Puesta en Marcha

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/RicardoCejas/VillaCielo.git
   cd VillaCielo
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abrir en el navegador en `http://localhost:3000/` o `http://localhost:5173/`.

4. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 📂 Estructura del Proyecto

```
villa/
├── public/
│   ├── icons/          # Iconos PNG de los minijuegos (Trivia, Puzzle, Color, Memoria)
│   └── images/         # Fotografías biológicas reales de fauna y flora serrana
├── src/
│   ├── components/
│   │   ├── layout/     # TopBar, BottomNav, DeviceShell
│   │   ├── screens/    # Pantallas principales (Home, Wiki, Red Trófica, Scanner, Detalle)
│   │   │   └── games/  # Componentes de minijuegos y misiones interactivas
│   │   └── ui/         # Modales de nivel, cartas desbloqueadas y toasts
│   ├── context/        # AppContext (Estado global, EXP, progreso y persistencia)
│   ├── data/           # speciesData.js, mapData.js, quizData.js, trophicData.js
│   └── utils/          # audio.js (Web Audio API sound effects)
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🌿 Compromiso con la Conservación
Este proyecto busca concientizar a los visitantes de Capilla del Monte sobre la fragilidad del bosque serrano y la importancia crítica de la prevención de incendios forestales.
