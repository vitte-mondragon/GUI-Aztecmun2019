// Declaramos nuestras constantes de aplicación invocando a Electron y algunas API's ya conocidas de NodeJS
const electron = require('electron');
const path = require('path');
const url = require('url');

// Establecer la variable Environment, para habilitar y deshabilitar el DevTools
process.env.NODE_ENV = 'development';

/*Declaramos nuestras constantes de aplicación que usaremos con Electron en nuestra aplicacion.
Estos módulos son propios de electron y se identifican siempre con el mismo nombre
BrowserWindow es un módulo de Chromiun para el gestor de ventanas */
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let childWindow;


// Revisa que este cargado antes de ejecutar
app.on('ready', function(){
    // App revisa acciones, cuando este lista realiza Tareas
    //Crea una ventana
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden', //Podemos comentar si no se quiere ocultar el TitleBar, propiedad de nuestra ventana
        width: 1000,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#ececec',
        show: false,  // No lo mostramos en un inicio, Electron lo hará cuando este 'ready-to-show'
        icon: __dirname + 'assets/images/favicon.ico', // Podemos ejecutar con un favicon.
        //icon: path.join(__dirname, 'assets/icons/mac/icon.icns')
    });
    // Carga el html page en un window
    mainWindow.loadURL(url.format({
        //url es un objeto que manda llamar el metodo format
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes:true
    }));
    // Mediante este evento muestra la ventana principal cuando está cargada y lista para mostrar
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    /* Emite el evento a través de un handler cuando la ventana está cerrada
    Liberamos los recursos referentes a la ventana
    */
    mainWindow.on('closed', function () {
        /* Des-referencia el objeto de windows, para poder instanciar y almacenar más ventanas
        en un array de memoria, si la aplicación dispone de mas ventanas, sabrá
        cuando debe eliminar el elemento correspondiente.
        */
        mainWindow = null
    });

    // Crear menú desde plantilla (template), que vamos a construir líneas abajo.
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insertamos el menu en la aplicación
    Menu.setApplicationMenu(mainMenu);

});


/* Escuchamos el evento `window-all-closed` y si no estamos en Mac cerramos la aplicación
 lo de Mac es debido a que en este SO es común que se pueda cerrar todas las ventanas sin cerrar
 la aplicación completa
*/
app.on('window-all-closed', () => {
//	if (process.platform !== 'darwin') {
    app.quit();
//	}
});


/* Creamos el templeate del menu  de la aplicación
   Cada objeto será un representado como un menu común al estilo dropdown, tanto para Windows y MacOS
   Indicamos el nombre del ítem del menu y establecemos el keyboard shortcut para las plataformas
   Y las opciones o ítems del menu, enviarán mensajes de eventos al nuestros procesos principales
*/
const mainMenuTemplate =  [
	{
    	label: 'Committes',
    	submenu:[
            {
                label:'UNODC',
                //La combinación de teclas son conocidos como Accelerators
                accelerator:process.platform == 'darwin' ? 'Command+U' : 'Ctrl+U',
                click(){
              		// Llamamos a la función de cargar la ventana hija
                }
            },
            {
                label: 'Senado de la Republica',
                accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click(){
                  //no se xd
                }
            },
            {
                label: 'Reserva Federal',
                accelerator:process.platform == 'darwin' ? 'Command+F' : 'Ctrl+F',
                click(){
                  //no se xd
                }
            },
            {
                label: 'Security Council',
                accelerator:process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
                click(){
                  //no se xd
                }
            },
            {
                label: 'ISC',
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(){
                  //no se xd
                }
            },
            {
                label: 'Interpol',
                accelerator:process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
                click(){
                  //no se xd
                }
            },
            {
                label: 'Salir',
                accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
   	},
   	{
    	label: 'Ayuda',
    	submenu: [
      		{
        		label: 'Acerca',
        		click(){
          			openAboutWindow();
        		}
      		},
    	]
   	}
];



// Si es MacOS, quitamos el menu por defecto que nos asocia, para eso agregamos solo el nonbre del APP.
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({label: app.getName()});
}

/* Agregue la opción de herramientas de desarrollador si está en el entorno de desarrollo (developer tools option)
   Esta funcionalidad afecta al modulos process del NodeJs a través de la variable process.env.NODE_ENV = 'development'
*/
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                role: 'reload' // Podemos recargar nuestra App Commnad+R o Ctrl+R cuando tengamos cambios, es un shortcut default
            },
            {
                label: 'Toggle DevTools',
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
    /* Verifica si alguien intentó ejecutar una segunda instancia, deberíamos enfocar nuestra ventana. */
    /* Single Instance Check */
    /*const shouldQuit = app.makeSingleInstance((argv) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
        return true;
    });

    if (shouldQuit) {
        app.quit();
        return;
    }
}
