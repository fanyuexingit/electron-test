const {app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
    })

    const menu = Menu.buildFromTemplate([
        {
          label: app.name,
          submenu: [
            {
              click: () => win.webContents.send('update-counter', 1),
              label: 'Increment'
            },
            {
              click: () => win.webContents.send('update-counter', -1),
              label: 'Decrement'
            }
          ]
        }
      ])
      Menu.setApplicationMenu(menu)

    win.loadFile('index.html')


    // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

function createMenu () {
    
}

function handleSetTitle (event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

async function handleFileOpen () {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
        return filePaths[0]
}
}

app.whenReady().then(() => {

    

    createWindow()
    ipcMain.handle('ping', () => 'pong')

    ipcMain.on('set-title', handleSetTitle)

    ipcMain.handle('dialog:openFile', handleFileOpen)

    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log(arg) // 在 Node 控制台中打印“ping”
        // 作用如同 `send`，但返回一个消息
        // 到发送原始消息的渲染器
        event.reply('asynchronous-reply', 'pong')
    })

    ipcMain.on('synchronous-message-2', (event, arg) => {
        console.log(arg) // 在 Node 控制台中打印“ping”
        event.returnValue = 'pong-2'
    })


    ipcMain.on('counter-value', (_event, value) => {
        console.log(value) // will print value to Node console
      })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})