const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        titleBarStyle: 'default',
        show: false
    });

    // Load the app
    mainWindow.loadFile('index.html');

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Exportar Datos',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('gymApp.exportData()');
                    }
                },
                {
                    label: 'Importar Datos',
                    accelerator: 'CmdOrCtrl+I',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile'],
                            filters: [
                                { name: 'JSON Files', extensions: ['json'] }
                            ]
                        });

                        if (!result.canceled && result.filePaths.length > 0) {
                            const filePath = result.filePaths[0];
                            try {
                                const data = fs.readFileSync(filePath, 'utf8');
                                mainWindow.webContents.executeJavaScript(`
                                    try {
                                        const data = ${data};
                                        if (data.students && data.config) {
                                            gymApp.students = data.students;
                                            gymApp.config = data.config;
                                            gymApp.saveData();
                                            localStorage.setItem('gymConfig', JSON.stringify(gymApp.config));
                                            gymApp.updateStats();
                                            gymApp.renderStudents();
                                            gymApp.loadConfig();
                                            gymApp.showNotification('Datos importados exitosamente', 'success');
                                        } else {
                                            throw new Error('Formato de archivo inválido');
                                        }
                                    } catch (error) {
                                        gymApp.showNotification('Error al importar datos: ' + error.message, 'error');
                                    }
                                `);
                            } catch (error) {
                                dialog.showErrorBox('Error', 'No se pudo leer el archivo: ' + error.message);
                            }
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Deshacer' },
                { role: 'redo', label: 'Rehacer' },
                { type: 'separator' },
                { role: 'cut', label: 'Cortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Pegar' },
                { role: 'selectall', label: 'Seleccionar Todo' }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload', label: 'Recargar' },
                { role: 'forceReload', label: 'Forzar Recarga' },
                { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Normal' },
                { role: 'zoomIn', label: 'Acercar' },
                { role: 'zoomOut', label: 'Alejar' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Pantalla Completa' }
            ]
        },
        {
            label: 'Navegación',
            submenu: [
                {
                    label: 'Estudiantes',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('gymApp.switchTab("students")');
                    }
                },
                {
                    label: 'Recordatorios',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('gymApp.switchTab("reminders")');
                    }
                },
                {
                    label: 'Agregar Alumno',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('gymApp.switchTab("add")');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Configuración',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('gymApp.openConfigModal()');
                    }
                }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { role: 'minimize', label: 'Minimizar' },
                { role: 'close', label: 'Cerrar' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Acerca de Sistema de Gimnasio',
                            message: 'Sistema de Gimnasio v1.0.0',
                            detail: 'Sistema de gestión de cuotas para gimnasios.\n\nDesarrollado con Electron y tecnologías web modernas.',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: 'Acerca de ' + app.getName() },
                { type: 'separator' },
                { role: 'services', label: 'Servicios' },
                { type: 'separator' },
                { role: 'hide', label: 'Ocultar ' + app.getName() },
                { role: 'hideothers', label: 'Ocultar Otros' },
                { role: 'unhide', label: 'Mostrar Todo' },
                { type: 'separator' },
                { role: 'quit', label: 'Salir de ' + app.getName() }
            ]
        });

        // Window menu
        template[5].submenu = [
            { role: 'close', label: 'Cerrar' },
            { role: 'minimize', label: 'Minimizar' },
            { role: 'zoom', label: 'Zoom' },
            { type: 'separator' },
            { role: 'front', label: 'Traer Todo al Frente' }
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // In production, you should properly validate certificates
    event.preventDefault();
    callback(true);
});

// Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== 'file://') {
            event.preventDefault();
        }
    });
});
