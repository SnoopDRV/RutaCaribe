# RutaCaribe 🚌🗺️
> **Planificador de Rutas y Movilidad para Transcaribe en Cartagena de Indias**

RutaCaribe es una aplicación web interactiva que funciona como un **Google Maps cívico e independiente** especializado en el **Sistema Integrado de Transporte Masivo (SITM) Transcaribe**. Permite a cartageneros, estudiantes y turistas planear trayectos de **punto A a punto B**, calculando automáticamente la mejor línea, el tiempo estimado de viaje, el número de paradas intermedias, transbordos recomendados y el estado del tráfico en el corredor.

---

## ✨ Características Principales

1. **🗺️ Planificador Interactivo estilo Google Maps (A → B)**:
   - Selección de estación de Origen (A) y Destino (B) con autocompletado y búsqueda en tiempo real.
   - Detección de ubicación con GPS integrado (`Mi Ubicación`) para encontrar la estación más cercana.
   - Botón de inversión instantánea de trayecto (`swap_vert`).
   - Cálculo automático de:
     - **Línea recomendada** (Troncales T101, T102, T103, Pretroncales X101, X102, X104, Alimentadoras A101, A102).
     - **Tiempo estimado de viaje** en minutos considerando el tráfico del carril troncal y tramos mixtos como Bazurto.
     - **Número de paradas** intermedias.
     - **Próximo arribo estimado** y frecuencia de paso.
     - **Detección de transbordo** en nodos troncales (Patio Portal, Cuatro Vientos, Bazurto, Chambacú).
     - **Desglose secuencial de paradas** con itinerario detallado.
     - **Simulación de navegación en vivo** con el botón *Iniciar Guía*.

2. **🛰️ Mapa con Doble Capa (Callejero y Satélite de Alta Resolución GRATIS)**:
   - Motor cartográfico basado en **Leaflet.js** (100% gratuito, sin necesidad de API keys de pago).
   - Alternador rápido entre:
     - **Mapa Callejero Vectorial**: Basado en OpenStreetMap / Carto.
     - **🛰️ Satélite de Alta Resolución**: Basado en imágenes satelitales de Esri World Imagery para ver la bahía, avenidas y estaciones reales de Cartagena.
   - Trazado de rutas vectoriales en tiempo real (naranja para troncales, azul pizarra para pretroncales, verde esmeralda para alimentadoras) con animación de pulso sobre el trayecto seleccionado.
   - Marcadores personalizados e interactivos para cada una de las 18 estaciones troncales y ramales.

3. **🏢 Inspector de Estación en Tiempo Real**:
   - Al hacer clic en cualquier estación en el mapa o lista, se abre la tarjeta lateral derecha con:
     - Nombre, corredor y sector de la estación.
     - Botones rápidos: *"Partir de aquí (A)"* y *"Llegar aquí (B)"*.
     - Salidas y próximos arribos estimados con cuenta regresiva.
     - Indicador de ocupación y afluencia de plataforma.
     - Servicios disponibles (rampa accesible, taquillas de recarga, vigilancia).

4. **📋 Directorio del Sistema de Rutas y Secuencias**:
   - Vista detallada de las 24 rutas del sistema categorizadas en Troncales, Pretroncales y Alimentadoras.
   - Secuencia completa de estaciones y conexiones con botón directo para *"Cargar en el Mapa"*.

5. **🕒 Horarios e Itinerarios Oficiales**:
   - Tabla interactiva con conmutador por día: **Lunes a Viernes**, **Sábados**, y **Domingos y Festivos**.

6. **🎨 Sistema de Diseño Stitch**:
   - Basado en el manual de diseño *Transcaribe Operational System* (`DESIGN.md`).
   - Paleta de color optimizada para alto contraste bajo el sol del Caribe (Naranja Tránsito `#F37021`, Azul Marino Profundo `#0D1B2A`).
   - Conmutador animado de **Modo Claro / Modo Oscuro** con persistencia en `localStorage`.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalaciones complejas ni servidores externos. Puedes abrirlo directamente:

### Opción 1: Directamente en el navegador
1. Haz doble clic en [`index.html`](file:///c:/Users/Dougl/OneDrive/Documents/RutaCaribe/RutaCaribe/index.html).
2. Se abrirá inmediatamente en Google Chrome, Edge o Firefox.

### Opción 2: Con un servidor local (opcional)
```bash
# Con Python
python -m http.server 8080

# Luego abre:
http://localhost:8080
```

---

## 🗂️ Estructura del Proyecto

```
RutaCaribe/
├── index.html                           # Aplicación web completa y funcional
├── README.md                            # Documentación del proyecto
└── stitch_transcaribe_route_planner/     # Diseños originales de Stitch
    ├── mapa_planificador_rutacaribe/    # Vista de mapa interactivo
    ├── rutas_del_sistema_rutacaribe/    # Directorio de rutas
    ├── horarios_e_itinerarios_rutacaribe/ # Horarios e itinerarios
    ├── inicio_rutacaribe/               # Landing de bienvenida
    └── transcaribe_operational_system/  # DESIGN.md (Sistema de diseño)
```

---

## ⚖️ Aviso Legal y Exención de Responsabilidad

RutaCaribe es una iniciativa comunitaria y cívica digital estrictamente independiente. No posee afiliación oficial ni contrato con Transcaribe S.A. ni con la Alcaldía Mayor de Cartagena de Indias. Las marcas y nombres de las estaciones se emplean con fines informativos para la comunidad de usuarios.