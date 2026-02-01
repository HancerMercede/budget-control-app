# 📊 budget-control-app

### *Gestión financiera personal inteligente*

**budget-control-app** es una solución robusta para el control de finanzas personales. La aplicación garantiza una experiencia de usuario fluida mediante el manejo dinámico de datos y una interfaz reactiva.

---

## Logros Técnicos e Implementaciones

En la versión actual de **2026-02-01**, hemos consolidado las siguientes funcionalidades críticas:

### 1. Motor de Tiempo Concurrente

* **Detección Automática**: El sistema ya no depende de valores estáticos; ahora identifica que el mes actual es **Febrero** al iniciar la aplicación.
* **Cero Hardcoding**: Se eliminaron los strings fijos de meses, permitiendo que la app evolucione automáticamente con el calendario.

### 2. Filtrado Reactivo de Gastos

* **Procesamiento de Datos**: Implementamos un `useMemo` avanzado que filtra el array global de gastos basándose en el mes seleccionado por el usuario.
* **Normalización de Fechas**: El filtrado se realiza mediante el parseo de strings `YYYY-MM-DD`, evitando errores de desfase por zonas horarias (UTC).
* **Consistencia de UI**: La tabla ahora recibe exclusivamente la data filtrada, asegurando que si seleccionas "Enero", solo veas registros de ese mes.

### 3. Interfaz de Usuario (UI/UX)

* **Empty State Moderno**: Diseñamos un componente visual para cuando no hay datos en un mes (como el inicio de febrero), incluyendo iconografía minimalista y tipografía jerarquizada.
* **Corrección de Estructura**: Se ajustó el `colSpan` de la tabla a **5 columnas** para garantizar que los mensajes de validación ocupen todo el ancho del contenedor.
* **Feedback Dinámico**: El mensaje de "No hay gastos" ahora incluye el nombre del mes seleccionado (ej: *"No hay registros en Febrero"*), confirmando la acción del usuario.

---

## 🛠️ Stack Tecnológico

* **Frontend**: React.js con TypeScript.
* **Estilos**: Tailwind CSS (Diseño atómico y modo oscuro).
* **Gestión de Datos**: Hooks personalizados (`useExpenses`) para la conexión con la base de datos.
* **Optimización**: `useMemo` para evitar cálculos redundantes en cada renderizado.

---

## 📁 Arquitectura del Proyecto

Siguiendo el Roadmap de **budget-control-app**:

```text
src/
├── components/       
│   ├── ExpenseTable  # Tabla con validación de estados vacíos
│   └── MonthFilter   # Controlador de estado temporal
├── hooks/            
│   └── useExpenses   # Lógica de sincronización con la DB
└── utils/            
    └── dateHelpers   # Formateo y detección de mes concurrente

```

---

## 🔧 Instalación y Uso

1. **Dependencias**: `yarn install`
2. **Desarrollo**: `yarn dev`
3. **Variables**: Configurar las credenciales de Firebase/Firestore en el archivo `.env`.

---

> **Compromiso de Calidad**: Este proyecto sigue estrictamente el "Roadmap de Ingeniería y Mejores Prácticas" para asegurar un código limpio, escalable y mantenible.

¿Te gustaría que añadamos alguna captura de pantalla o un diagrama de flujo de cómo los datos pasan del filtro a la tabla?
