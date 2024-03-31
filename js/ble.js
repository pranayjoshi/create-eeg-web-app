//import { MuseElectronClient } from "./muse-client.js";
export const BLE = class {
  constructor(callback, connect_button_id = "bluetooth") {
    this.device = new Blue.BCIDevice(callback);
    // this.device_connect_id = "bluetooth-con";
    // document.getElementById(this.device_connect_id).onclick = async function (e) {
    //   const devicename = document.getElementById('devicename').value
    //     console.log(devicename)
    //     const device = await navigator.bluetooth.requestDevice({
    //       filters: [{ name: devicename }]
    //     })
    //   const server = await device.connect();
    //   this.toggle_show_up()
      
    // }.bind(this);
    console.log("BLE")
    // Connect Events
    document.getElementById(connect_button_id).onclick = async function (e) {
      await this.device.connect()
      this.toggle_show_up()
      
    }.bind(this);

    this.isConnected = false;
  }

  get_html_element(id) {
    return document.getElementById(id);
  }

  

  get_device() {
    return this.device;
  }

  toggle_show_up(){
    console.log("toggle_show_up", this.isConnected)
    this.isConnected = !this.isConnected;
    this.get_html_element("show-up").style.display = this.isConnected
      ? "block"
      : "none";
      this.get_html_element("no-show-up").style.display = this.isConnected
      ? "none"
      : "block";
  }

  disconnect() {
    this.device.disconnect();
    console.log("Disconnected");
    toggle_show_up()
  }
};