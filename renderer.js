const noble = require('@abandonware/noble');
const BLE = require("./ble.js");
const Signal = require("./signal.js");
const MuseGraph = require("./muse-graph.js");
const Study = require("./study.js");

const NeuroApp = class {
    constructor() {
        console.log("NeuroApp")
        this.muse_visualizer = new MuseGraph("graph", window.innerHeight * 0.8, 256 * 2, 1)
        this.graph_handlers = {"muse": this.muse_visualizer}
        this.signal_handler = new Study(this.graph_handlers, 512)
        let connectBtn = document.getElementById('bluetooth-con');
        connectBtn.onclick = function(e) {
            const devicename = document.getElementById('devicename').value
            console.log(devicename)

            noble.on('stateChange', (state) => {
                if (state === 'poweredOn') {
                    noble.startScanning();
                } else {
                    noble.stopScanning();
                }
            });

            noble.on('discover', (peripheral) => {
                if (peripheral.advertisement.localName === devicename) {
                    noble.stopScanning();
                    peripheral.connect((error) => {
                        if (error) {
                            console.error('Failed to connect:', error);
                        } else {
                            console.log('Connected to device');
                            this.ble = new BLE(peripheral, this.signal_handler.add_data.bind(this.signal_handler));
                        }
                    });
                }
            });

        }.bind(this);

        let bleInstance = this.ble;
        let disconnectButton = document.getElementById('bluetooth-dis');
        disconnectButton.onclick = function(e) {
            bleInstance.disconnect();
        };
        this.signal_handler.timer();
    }
}

let app = new NeuroApp()