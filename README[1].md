# Sistema de Gimnasio - Gestión de Cuotas

Sistema completo para la gestión de cuotas y alumnos de gimnasios, disponible como aplicación de escritorio y móvil.

## Características

- ✅ Gestión completa de alumnos
- ✅ Control de pagos y cuotas
- ✅ Estadísticas en tiempo real
- ✅ Recordatorios de pagos
- ✅ Exportación e importación de datos
- ✅ Interfaz responsive y moderna
- ✅ Aplicación de escritorio (Windows, Mac, Linux)
- ✅ Aplicación móvil (Android, iOS)

## Instalación y Uso

### Aplicación Web (Navegador)
1. Abrir `index.html` en cualquier navegador moderno
2. Comenzar agregando alumnos desde la pestaña "Agregar Alumno"

### Aplicación de Escritorio

#### Requisitos previos
- Node.js 16 o superior
- npm o yarn

#### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir aplicación para Windows
npm run build-win

# Construir aplicación para Mac
npm run build-mac

# Construir aplicación para Linux
npm run build-linux
```

### Aplicación Móvil

#### Requisitos previos
- Node.js 16 o superior
- Android Studio (para Android)
- Xcode (para iOS, solo en Mac)

#### Configuración
```bash
# Instalar dependencias
npm install

# Inicializar Capacitor
npm run capacitor-init

# Agregar plataforma Android
npm run capacitor-add-android

# Agregar plataforma iOS (solo en Mac)
npm run capacitor-add-ios

# Sincronizar archivos
npm run capacitor-sync

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## Estructura del Proyecto

```
GymApp/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica de la aplicación
├── electron-main.js   # Proceso principal de Electron
├── capacitor.config.ts # Configuración de Capacitor
├── package.json       # Dependencias y scripts
├── assets/            # Iconos y recursos
└── README.md          # Este archivo
```

## Funcionalidades

### Gestión de Alumnos
- Agregar nuevos alumnos con información completa
- Editar información existente
- Eliminar alumnos
- Tipos de membresía (Clásico, Personalizado)

### Control de Pagos
- Marcar pagos realizados
- Seguimiento de pagos vencidos
- Cálculo automático de ingresos
- Estadísticas visuales

### Configuración
- Personalizar nombre del gimnasio
- Configurar moneda
- Ajustar días de recordatorio

### Datos
- Almacenamiento local automático
- Exportar datos a JSON
- Importar datos desde archivo

## Atajos de Teclado

- `Ctrl+1` / `Cmd+1`: Ir a Estudiantes
- `Ctrl+2` / `Cmd+2`: Ir a Recordatorios  
- `Ctrl+3` / `Cmd+3`: Ir a Agregar Alumno
- `Ctrl+,` / `Cmd+,`: Abrir Configuración
- `Ctrl+E` / `Cmd+E`: Exportar Datos
- `Ctrl+I` / `Cmd+I`: Importar Datos
- `Escape`: Cerrar modales

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Desktop**: Electron
- **Mobile**: Capacitor
- **Storage**: LocalStorage
- **Build**: electron-builder, Capacitor CLI

## Soporte

- **Desktop**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **Mobile**: Android 7.0+, iOS 13.0+
- **Web**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Changelog

### v1.0.0
- Lanzamiento inicial
- Gestión completa de alumnos
- Sistema de pagos y cuotas
- Aplicaciones de escritorio y móvil
- Exportación/importación de datos
