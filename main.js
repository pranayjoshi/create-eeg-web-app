const noble = require('@abandonware/noble');
const path = require('path');
// rest of your code...
const { dialog, app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  });

  win.loadFile('index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);