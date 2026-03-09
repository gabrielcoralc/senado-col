# 🇨🇴 Senado Colombia 2026 - Resultados en Tiempo Real

Aplicación web para visualizar en tiempo real los resultados de las elecciones al Senado de Colombia 2026, con cálculo automático de asignación de curules según el **Método D'Hondt**.

## 🎯 Características

- ✅ **Datos en tiempo real** desde la API oficial de la Registraduría Nacional
- ✅ **Cálculo automático de curules** usando el Método D'Hondt
- ✅ **Umbral electoral del 3%** aplicado correctamente
- ✅ **Visualización interactiva** con gráficos y tablas
- ✅ **Actualización automática** cada 60 segundos
- ✅ **Diseño responsivo** para móviles, tablets y desktop
- ✅ **Estadísticas en tiempo real**: mesas informadas, participación, votos válidos

## 📊 Sistema Electoral Colombiano

### Senado de la República

- **100 curules** por circunscripción nacional
- **2 curules** por circunscripción indígena
- **1 curul** para el segundo lugar presidencial (total: 103 senadores)

### Método de Asignación

Este proyecto calcula las **100 curules de circunscripción nacional** usando:

1. **Umbral Electoral**: 3% de votos válidos a nivel nacional
2. **Método D'Hondt** (cifra repartidora):
   - Los votos de cada partido se dividen sucesivamente entre 1, 2, 3, 4...
   - Las 100 mayores cifras obtienen las curules
   - Solo participan partidos que superen el umbral del 3%

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js 18+ instalado
- npm o yarn

### Instalación

```bash
# Clonar el repositorio (si aplica) o navegar a la carpeta del proyecto
cd senado-col

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm start        # Servidor de producción
npm run lint     # Verificar código
```

## 🏗️ Estructura del Proyecto

```
senado-col/
├── app/
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/
│   ├── ElectionStats.tsx  # Estadísticas de la elección
│   ├── SeatsTable.tsx     # Tabla de asignación de curules
│   └── PartyChart.tsx     # Gráfico de distribución
├── lib/
│   ├── api.ts             # Funciones para obtener datos
│   ├── dhondt.ts          # Implementación del Método D'Hondt
│   └── types.ts           # Tipos TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Recharts** - Visualización de gráficos
- **Lucide React** - Iconos modernos

## 📡 API de Datos

Los datos se obtienen de la API oficial de la Registraduría:
```
https://resultados.registraduria.gov.co/json/ACT/SE/00.json
```

Esta API proporciona:
- Votos por partido en tiempo real
- Porcentaje de mesas informadas
- Participación electoral
- Votos nulos, blancos y válidos

## 🧮 Ejemplo de Cálculo D'Hondt

Supongamos 3 partidos con los siguientes votos (umbral superado):

| Partido | Votos     | ÷1      | ÷2    | ÷3    | ÷4    | Curules |
|---------|-----------|---------|-------|-------|-------|---------|
| A       | 2,000,000 | 2,000,000¹ | 1,000,000³ | 666,667⁵ | 500,000 | 5 |
| B       | 1,500,000 | 1,500,000² | 750,000⁴ | 500,000 | 375,000 | 3 |
| C       | 1,000,000 | 1,000,000³ | 500,000⁶ | 333,333 | 250,000 | 2 |

Los superíndices (¹, ², ³...) indican el orden de asignación de las 10 curules.

## 🎨 Características Visuales

- **Dashboard interactivo** con estadísticas clave
- **Gráfico circular** de distribución de curules
- **Tabla detallada** con colores por partido
- **Indicadores visuales** de curules asignadas
- **Auto-actualización** con indicador visual
- **Diseño responsivo** adaptado a todos los dispositivos

## 📝 Notas Importantes

- Los resultados son **proyecciones** basadas en el conteo parcial
- Solo se calculan las **100 curules de circunscripción nacional**
- Las 2 curules indígenas tienen un proceso separado
- El resultado final es determinado por el escrutinio oficial

## 🤝 Contribuciones

Este proyecto fue creado para las elecciones del 8 de marzo de 2026. Sugerencias y mejoras son bienvenidas.

## 📄 Licencia

Este proyecto es de código abierto para fines educativos y de análisis electoral.

## 🔗 Enlaces Útiles

- [Registraduría Nacional](https://www.registraduria.gov.co/)
- [Resultados Oficiales](https://resultados.registraduria.gov.co/)
- [Wikipedia - Elecciones 2026](https://es.wikipedia.org/wiki/Elecciones_legislativas_de_Colombia_de_2026)

---

**Desarrollado con ❤️ para la democracia colombiana**
