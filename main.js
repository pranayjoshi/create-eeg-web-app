
const path = require('path');
// rest of your code...
const MUSE_DEVICE_NAME = "Muse-27A8";
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
  mainWindow.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault();
      console.log(deviceList);
      deviceList.map((x) => {
        console.log(x.deviceName);
      });
      //selectBluetoothCallback = callback

      const result = deviceList.find((device) => {
        return device.deviceName === MUSE_DEVICE_NAME;
      });

      //console.log(MuseClient)

      if (result) {
        callback(result.deviceId);

        // Do we listen to characteristics here?
        // Find examples of subscribing to characteristics in electron.js
      } else {
        // The device wasn't found so we need to either wait longer (eg until the
        // device is turned on) or until the user cancels the request
      }
    }
  );

  win.loadFile('index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);