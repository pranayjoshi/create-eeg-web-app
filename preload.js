const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  manualControl: (command) => ipcRenderer.send("manual-control", command),
  controlSignal: (response) => ipcRenderer.send("control-signal", response),
  cancelBluetoothRequest: (callback) =>
    ipcRenderer.send("cancel-bluetooth-request", callback),
  bluetoothPairingRequest: (callback) =>
    ipcRenderer.on("bluetooth-pairing-request", callback),
  bluetoothPairingResponse: (response) =>
    ipcRenderer.send("bluetooth-pairing-response", response),
});
