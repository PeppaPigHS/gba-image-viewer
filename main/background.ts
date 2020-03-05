import { app, Menu, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import fs from 'fs'

import { createWindow } from './helpers'

import main from './main'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 400,
    height: 600,
    resizable: false,
    maximizable: false
  })

  if (isProd) {
    Menu.setApplicationMenu(null)
    await mainWindow.loadURL('app://./index.html')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/index`)
    mainWindow.webContents.openDevTools()
  }

  ipcMain.on('open-rom', event => {
    dialog
      .showOpenDialog(mainWindow, {
        title: 'Open ROM',
        filters: [{ name: 'GBA Rom', extensions: ['gba'] }],
        properties: ['openFile']
      })
      .then(result => {
        if (result !== undefined && !result.canceled)
          event.returnValue = result.filePaths[0]
        else event.returnValue = ''
      })
      .catch(err => {
        console.log(err)
        event.returnValue = ''
      })
  })

  ipcMain.on('process-image', (event, props: any) => {
    event.returnValue = main(props)
  })

  ipcMain.on('save-image', (event, imageBuffer: Buffer) => {
    if(imageBuffer == null) {
      event.returnValue = { success: false, message: 'Image is empty' }
      return
    }

    dialog.showSaveDialog(mainWindow, {
      title: 'Save Image', 
      filters: [{ name: 'PNG Image', extensions: ['png'] }]
    })
    .then(result => {
      if(result !== undefined && !result.canceled) {
        fs.writeFileSync(result.filePath, imageBuffer)
        event.returnValue = { success: true, message: 'Save image successfully' }
      } else event.returnValue = { success: false, message: 'Please select you image destination'}
    }).catch(err => 
      event.returnValue = { success: false, message: 'Cannot save image' }
    )
  })
})()

app.on('window-all-closed', () => {
  app.quit()
})
