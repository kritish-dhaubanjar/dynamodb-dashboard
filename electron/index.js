const server = require('./build/bin/server')
const { app, BrowserWindow } = require('electron/main')

app.disableHardwareAcceleration();

const createWindow = () => {
  server.default({ port: 4567, host: 'localhost', debug: true, prefix: "dynamodb" })

  const splash = new BrowserWindow({
    width: 620,
    height: 300,
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: './assets/icon.png'
  })

  splash.loadFile('./assets/splash.html')

  splash.once('ready-to-show', () => {
    splash.show();
  });

  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 768,
    autoHideMenuBar: true,
    show: false,
    icon: './assets/icon.png'
  })

  win.once('ready-to-show', () => {
    splash.close()
    win.show()
  })

  win.loadURL('http://localhost:4567/dynamodb')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', app.quit)
