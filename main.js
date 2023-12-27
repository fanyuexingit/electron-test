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
    win.webContents.openDevTools()
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

    // 在主进程中，我们接收端口对象。
    ipcMain.on('port', (event) => {
    // 当我们在主进程中接收到 MessagePort 对象, 它就成为了
    // MessagePortMain.
    const port = event.ports[0]
  
    // MessagePortMain 使用了 Node.js 风格的事件 API, 而不是
    // web 风格的事件 API. 因此使用 .on('message', ...) 而不是 .onmessage = ...
    port.on('message', (event) => {
      // 收到的数据是： { answer: 42 }
      const data = event.data
      console.log(data)
    })
  
    // MessagePortMain 阻塞消息直到 .start() 方法被调用
    port.start()
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