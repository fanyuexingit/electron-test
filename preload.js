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


// 消息端口是成对创建的。 连接的一对消息端口
// 被称为通道。
const channel = new MessageChannel()

// port1 和 port2 之间唯一的不同是你如何使用它们。 消息
// 发送到port1 将被port2 接收，反之亦然。
const port1 = channel.port1
const port2 = channel.port2

// 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息
// 消息将排队等待，直到一个监听器注册为止。
port2.postMessage({ answer: 42 })

// 这次我们通过 ipc 向主进程发送 port1 对象。 类似的，
// 我们也可以发送 MessagePorts 到其他 frames, 或发送到 Web Workers, 等.
ipcRenderer.postMessage('port', null, [port1])