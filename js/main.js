import { BLE } from "./ble.js"
import { Signal } from "./signal.js"
import { MuseGraph } from "./muse-graph.js"

const NeuroApp = class {
    constructor() {
        console.log("NeuroApp")
        this.muse_visualizer = new MuseGraph("graph", window.innerWidth * 0.8, window.innerHeight * 0.8, 256 * 2, 1)
        this.graph_handlers = {"muse": this.muse_visualizer}
        this.signal_handler = new Signal(this.graph_handlers, 512)
        let startRecButton = document.getElementById('start-recording');
        let stopRecButton = document.getElementById('stop-recording');  
        let disconnectButton = document.getElementById('bluetooth-dis');
        startRecButton.onclick = function(e) {
            console.log("Start Recording")
            this.ble = new BLE(this.signal_handler.add_data.bind(this.signal_handler));
        }.bind(this);
        let bleInstance = this.ble;
        disconnectButton.onclick = function(e) {
            bleInstance.disconnect();
        };
        stopRecButton.onclick = function(e) {
            console.log("Stop Recording")
            this.signal_handler.stopAddingData();
        }.bind(this);
    }
    setupBLE() {
        
    }
    
}


let app = new NeuroApp()