const information = document.getElementById('info')

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')

const btn = document.getElementById('btn2')
const filePathElement = document.getElementById('filePath')

information.innerText = 
`This app is using Chrome 
(v${electronAPI.chrome()}), Node.js (v${electronAPI.node()}), and Electron (v${electronAPI.electron()})`


// const func = async () => {
//     const response = await window.electronAPI.ping()
//     console.log(response) // prints out 'pong'
//   }
  
// func()

setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
  })
 
btn.addEventListener('click', async () => {
const filePath = await window.electronAPI.openFile()
filePathElement.innerText = filePath
})  



const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue.toString()
    window.electronAPI.counterValue(newValue)
  })