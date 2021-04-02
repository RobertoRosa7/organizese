const { BrowserWindow, Tray, ipcMain, globalShortcut } = require("electron")
const path = require('path')
const menu = require("../menu/menu")

const windowSettings = {
  width: 1366,
  height: 768,
  backgroundColor: "#FAFAFA",
  name: "Organizese",
  icon: `${__dirname}/../../dist/assets/icon-default-white-512x512.png`,
  webPreferences: {
    nodeIntegration: true,
  },
}

module.exports = function createDefaultWindow() {
  var win = new BrowserWindow(windowSettings)
  win.loadURL(`file://${__dirname}/../../dist/index.html`)

  // win.loadURL("http://localhost:4200")
  // const reload = () => remote.getCurrentWindow().reload()

  // globalShortcut.register('F5', reload)
  
  // window.addEventListener('beforeunload', () => {
  //   globalShortcut.unregister('F5', reload)
  //   globalShortcut.unregister('CommandOrControl+R', reload)
  // })

  // menu statusbar
  // menu()
  win.setMenu(null)

  // uncomment this line to open devtools
  // win.webContents.openDevTools()

  // system tray - mini icon on system tray
  new Tray(`${__dirname}/../../dist/assets/icon-default-white-512x512.png`)

  // Event when the window is closed
  win.on("closed", () => (win = null))
  // win.setProgressBar(0.5) // set progress bar on icon dock
}
