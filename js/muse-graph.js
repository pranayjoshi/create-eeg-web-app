import { Data } from "./data.js";
import { MuseSeries } from "./series_muse.js";

export const MuseGraph = class {
    constructor(div_id, height, max_data, time_interval=1) {
        this.width = document.querySelector(`#${div_id}`).parentElement.clientWidth;
        console.log("div_id", div_id, "width", this.width);
        this.height = height;
        this.sample_freq = 256;
        let series = MuseSeries(max_data, time_interval);
        console.log("series", series);
        this.graph = new Rickshaw.Graph({
            element: document.querySelector(`#${div_id}`), 
            width: this.width, 
            height: this.height, 
            renderer: 'line',
            series: series,
        });
        console.log("graph", this.graph);

        // 2,3,16,17 is hardcoded. BCIDevice needs to be updated to return actual channel labels based on device
        this.isChannelDataReady = {0: false, 1:false, 2: false, 3: false};
        this.recent_data_temp = {0: [], 1: [], 2: [], 3: []};
        this.data_storage = {0: [], 1: [], 2: [], 3: []}; // Separate data storage
        this.is_active = true;
        this.is_local_recording = false;
        //this.data = new Data("muse", {0: "TP9", 1: "TP10", 2:"AF8", 3:"AF7"}, this.sample_freq);
        
        /*
        let updateWidth = () => {
            let w =  document.querySelector(`#${div_id}`).clientWidth;
            this.graph.width = w;
            console.log(w);
        }

        window.onresize = updateWidth.bind(this);
        */
        
        // Attach event listener to the export CSV button
        document.getElementById('export_csv_button').onclick = () => {
            this.export_to_csv();
        };
    }

    toggle_local_recording() {
        this.is_local_recording = !this.is_local_recording;
        // console.log(this.is_local_recording);
    }

    get_graph() {
        return this.graph;
    }

    reset_channel_status() {
        this.isChannelDataReady = {0: false, 1:false, 2: false, 3: false};
    }

    // Checks to see if all channels have new data
    is_refresh_ready() {
        return this.isChannelDataReady[0] && this.isChannelDataReady[1] && this.isChannelDataReady[2] && this.isChannelDataReady[3];
    }

    get_formatted_data(i) {
        return {
            TP9: this.recent_data_temp[0][i] + (this.height * .05),  //F8
            TP10: this.recent_data_temp[1][i]+ (this.height * .1),  //F7
            AF8: this.recent_data_temp[2][i] + (this.height * .2),  //TP9
            AF7: this.recent_data_temp[3][i] + (this.height * .3)   // TP10
        };
    }

    // Update graph visualizer if all channels hold new data
    add_data(data, electrode) {
        console.log("Received data for electrode", electrode, data);
        this.recent_data_temp[electrode] = this.recent_data_temp[electrode].concat(data);
        this.data_storage[electrode] = this.data_storage[electrode].concat(data); // Store data in separate storage
        this.isChannelDataReady[electrode] = true;
        this.update_graph();
    }
    
    update_graph() {
        console.log("Checking if graph should update", this.is_refresh_ready(), this.is_active);
        if(this.is_refresh_ready() && this.is_active) {
            // console.log("Updating graph");
            this.reset_channel_status();
            for (let i in this.recent_data_temp[2]) {
                let s = this.get_formatted_data(i);
                this.graph.series.addData(s);
                this.graph.render();
            }
            if(this.is_local_recording) {
                // console.log("Recording data");
                //this.data.add_data(this.recent_data_temp);
            }
            for (let i in this.recent_data_temp) {
                this.recent_data_temp[i] = [];
            }
        }
    }

    export_to_csv() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Timestamp,TP9,TP10,AF8,AF7\n"; // Add headers

        // Assuming data_storage holds the data for the 4 electrodes
        let maxLength = Math.max(
            this.data_storage[0]?.length || 0,
            this.data_storage[1]?.length || 0,
            this.data_storage[2]?.length || 0,
            this.data_storage[3]?.length || 0
        );

        for (let i = 0; i < maxLength; i++) {
            let timestamp = new Date().toISOString(); // Capture current timestamp
            let tp9 = this.data_storage[0]?.[i] || "";
            let tp10 = this.data_storage[1]?.[i] || "";
            let af8 = this.data_storage[2]?.[i] || "";
            let af7 = this.data_storage[3]?.[i] || "";
            csvContent += `${timestamp},${tp9},${tp10},${af8},${af7}\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "recorded_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};