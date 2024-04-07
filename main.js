
const { BLE } = require("./js/ble.js");
const { MuseGraph } = require("./js/muse-graph.js");
const { Study } = require("./js/study.js");
const { dialog, app, BrowserWindow } = require('electron');
const path = require('path');
const NeuroApp = require('./js/main');
// rest of your code...
const MUSE_DEVICE_NAME = "Muse-27A8";
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
  win.webContents.on(
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
    win.webContents.openDevTools();
    const NeuroApp = class {
      constructor() {
          console.log("NeuroApp")
          this.muse_visualizer = new MuseGraph("graph", window.innerHeight * 0.8, 256 * 2, 1)
          this.graph_handlers = {"muse": this.muse_visualizer}
          //this.signal_handler = new Signal(this.graph_handlers, 512) // use this Object for real-time applications
          this.signal_handler = new Study(this.graph_handlers, 512)
          // let connectBtn = document.getElementById('bluetooth-con');
          // connectBtn.onclick = function(e) {
          //     connectDevice();
          // };
          this.ble = new BLE(this.signal_handler.add_data.bind(this.signal_handler))
          let bleInstance = this.ble;
          let disconnectButton = document.getElementById('bluetooth-dis');
          disconnectButton.onclick = function(e) {
              bleInstance.disconnect();
          };
          this.signal_handler.timer();
      }
  }
}

app.whenReady().then(createWindow);