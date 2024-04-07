const { BLE } = require("./ble.js");
const { MuseGraph } = require("./muse-graph.js");
const { Study } = require("./study.js");

// async function connectDevice () {
//     const devicename = document.getElementById('devicename').value
//     console.log(devicename)
//     const device = await navigator.bluetooth.requestDevice({
//       filters: [{ name: devicename }]
//     })
//     const server = await device.connect();
//   console.log('Connected to GATT Server', server);
//   }
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


let app = new NeuroApp()
