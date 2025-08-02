# 📱 INSTALACIÓN EN CELULAR - Sistema de Gimnasio

## 🚀 OPCIÓN 1: INSTALACIÓN DIRECTA (PWA) - LA MÁS FÁCIL

### Para Android (Chrome, Edge, Samsung Internet):

**Paso 1: Subir archivos a internet** (necesario solo una vez):
1. Ve a [GitHub.com](https://github.com) y crea una cuenta gratuita
2. Crea un nuevo repositorio público
3. Sube TODOS los archivos de la carpeta `GymApp`:
   - index.html
   - styles.css
   - app.js
   - manifest.json
   - sw.js
   - assets/ (carpeta completa)
4. Ve a Settings → Pages → Deploy from branch → main
5. Tu app estará en: `https://tuusuario.github.io/nombre-repositorio`

**Paso 2: Instalar en Android**:
1. Abre Chrome en tu celular
2. Ve a la URL de tu aplicación
3. Verás un banner "Agregar a pantalla de inicio" o "Instalar app"
4. Toca "Instalar" o "Agregar"
5. ¡Listo! La app aparece como cualquier otra aplicación

### Para iPhone (Safari):

**Instalar en iPhone**:
1. Abre Safari en tu iPhone
2. Ve a la URL de tu aplicación
3. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
4. Selecciona "Agregar a pantalla de inicio"
5. Confirma el nombre y toca "Agregar"
6. ¡La app aparece en tu pantalla de inicio!

## 🏠 OPCIÓN 2: SERVIDOR LOCAL (Sin subir a internet)

### Si tienes Python instalado:
```bash
# Abre terminal en la carpeta GymApp
python -m http.server 8080
```

### Si tienes Node.js instalado:
```bash
# Instala servidor simple
npm install -g http-server
# En la carpeta GymApp
http-server -p 8080
```

**Luego desde tu celular:**
- Conecta a la misma WiFi que tu PC
- Averigua la IP de tu PC (cmd → ipconfig)
- Ve a: `http://[IP-DE-TU-PC]:8080`
- Sigue los pasos de instalación PWA

## 📦 OPCIÓN 3: APK REAL PARA ANDROID

### Requisitos:
- Node.js instalado
- Android Studio

### Pasos:
```bash
# En la carpeta GymApp
npm install
npx cap init "Sistema de Gimnasio" com.gimnasio.sistema
npx cap add android
npx cap sync
npx cap open android
```

**En Android Studio:**
1. Build → Generate Signed Bundle/APK
2. Selecciona APK
3. Crea un keystore nuevo
4. Genera el APK
5. Transfiere el APK a tu celular e instala

## 🌐 SERVICIOS GRATUITOS PARA SUBIR TU APP:

### 1. GitHub Pages (Recomendado - GRATIS):
- Ve a GitHub.com
- Crea cuenta y repositorio
- Sube archivos
- Settings → Pages → Deploy from branch
- URL: `https://tuusuario.github.io/repositorio`

### 2. Netlify (GRATIS):
- Ve a Netlify.com
- Arrastra la carpeta GymApp
- URL automática generada

### 3. Vercel (GRATIS):
- Ve a Vercel.com
- Conecta con GitHub o sube archivos
- Deploy automático

### 4. Firebase Hosting (GRATIS):
- Ve a Firebase.google.com
- Crea proyecto → Hosting
- Sube archivos

## ✅ VERIFICAR QUE FUNCIONA:

### La app debe tener:
- ✅ Icono propio en pantalla de inicio
- ✅ Pantalla completa (sin barra del navegador)
- ✅ Funcionar sin internet (después de la primera carga)
- ✅ Guardar datos localmente
- ✅ Notificaciones de instalación disponibles

## 🔧 SOLUCIÓN DE PROBLEMAS:

**No aparece botón "Instalar":**
- Usa HTTPS (no HTTP)
- Verifica que manifest.json esté accesible
- Recarga la página
- Prueba en Chrome/Edge

**App no guarda datos:**
- Permite almacenamiento local en configuración del navegador
- No uses modo incógnito

**No funciona offline:**
- Recarga la página una vez con internet
- Verifica que sw.js esté funcionando

## 📋 ARCHIVOS INCLUIDOS (Ya listos):

- ✅ `index.html` - Aplicación principal
- ✅ `manifest.json` - Configuración PWA
- ✅ `sw.js` - Service Worker (funciona offline)
- ✅ `styles.css` - Estilos responsive
- ✅ `app.js` - Funcionalidad completa
- ✅ `assets/icon.svg` - Icono de la aplicación

## 🎯 RECOMENDACIÓN FINAL:

**Para uso personal/pequeño negocio:**
→ Usa GitHub Pages (gratis, fácil, permanente)

**Para uso profesional:**
→ Usa Netlify o Vercel (gratis, dominio personalizable)

**Para máximo control:**
→ Genera APK real con Capacitor

## 🚀 PASOS RÁPIDOS (Resumen):

1. **Crea cuenta en GitHub.com**
2. **Nuevo repositorio → Sube TODOS los archivos de GymApp**
3. **Settings → Pages → Deploy from branch → main**
4. **Desde tu celular: ve a la URL → Instalar app**
5. **¡Listo! Tu gimnasio en el celular**

¡Tu aplicación ya está lista para instalar! Solo necesitas subirla a internet y seguir los pasos.