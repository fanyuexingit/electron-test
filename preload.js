const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // we can also expose variables, not just functions
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send('counter-value', value)

})

ipcRenderer.send('asynchronous-message', 'ping')
ipcRenderer.on('asynchronous-reply', (_event, arg) => {
    console.log(arg) // 在 DevTools 控制台中打印“pong”
})

const result = ipcRenderer.sendSync('synchronous-message-2', 'ping-2')
console.log(result) // 在 DevTools 控制台中打印“pong”

// window.addEventListener('DOMContentLoaded', () => {
//     const counter = document.getElementById('counter')
//     ipcRenderer.on('update-counter', (_event, value) => {
//       const oldValue = Number(counter.innerText)
//       const newValue = oldValue + value
//       counter.innerText = newValue
//     })
//   })