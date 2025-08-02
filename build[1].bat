@echo off
echo ========================================
echo   Sistema de Gimnasio - Build Script
echo ========================================
echo.

echo Instalando dependencias...
call npm install

echo.
echo Construyendo aplicacion de escritorio para Windows...
call npm run build-win

echo.
echo Inicializando Capacitor para aplicaciones moviles...
call npx cap init "Sistema de Gimnasio" com.gimnasio.sistema --web-dir .

echo.
echo Agregando plataforma Android...
call npx cap add android

echo.
echo Sincronizando archivos con Capacitor...
call npx cap sync

echo.
echo ========================================
echo   Build completado!
echo ========================================
echo.
echo Aplicacion de escritorio: dist/
echo Proyecto Android: android/
echo.
echo Para abrir el proyecto Android en Android Studio:
echo   npx cap open android
echo.
echo Para ejecutar la aplicacion de escritorio:
echo   npm start
echo.
pause
