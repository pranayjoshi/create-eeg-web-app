import { TensorDSP } from "./tensor-dsp.js";
import { VizScatter } from "./vizscatter.js";

export const Study = class {
  constructor(
    graph_handlers,
    buffer_size = 256,
    record_state_button_id = "is_recording"
  ) {
    this.record_state_button_id = record_state_button_id;
    this.graph_handlers = graph_handlers;
    //this.channels = {};
    this.data = {};
    this.BUFFER_SIZE = buffer_size;
    this.tensor = new TensorDSP("muse");
    this.isRecording = false;
    this.viz = new VizScatter();
    
    //https://www.w3schools.com/tags/ref_colornames.asp
    this.scatter_plot_class_colors = [ "aqua", "Chartreuse", "BurlyWood", "Crimson", "DarkOrchid", "dimgray", "lightcoral", "lightcyan","navy"];

    // Connect Events
    this.get_html_element(this.record_state_button_id).onclick = function (e) {
      this.toggle_record_state(this.record_state_button_id);
    }.bind(this);

    // Clear chart
    this.get_html_element("remove_data").onclick = function (e) {
      this.remove_all_data();
    }.bind(this);
  }

  remove_all_data() {
    this.data = {};
    this.viz.remove_all_data()
  }

  timer() {
    let timerDurationInput = document.getElementById('timer_duration');
    let startTimerButton = document.getElementById('start_timer');
    let timerDisplay = document.getElementById('timer_display');
    let timerId = null;
  
    startTimerButton.onclick = () => {
      this.toggle_record_state();
      let duration = parseInt(timerDurationInput.value);
      if (isNaN(duration) || duration <= 0) {
        alert('Please enter a valid duration.');
        return;
      }
  
      // Clear any existing timer
      if (timerId !== null) {
        clearInterval(timerId);
      }
  
      // Start a new timer
      timerId = setInterval(() => {
        if (duration <= 0) {
          timerDisplay.textContent = '0:00';
          this.toggle_record_state();
          clearInterval(timerId);
          timerId = null;
        } else {
          let minutes = Math.floor(duration / 60);
          let seconds = duration % 60;
          timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          duration--;
        }
      }, 1000);
    };
  }

  //toggle record state
  toggle_record_state() {
    this.isRecording = !this.isRecording;
    this.get_html_element(this.record_state_button_id).innerHTML = this
      .isRecording
      ? "Stop Recording"
      : "Record";
    this.get_html_element("graph-div").style.display = this.isRecording
      ? "none"
      : "block";

    // Hard coded for testing
    console.log("toggle states", this.isRecording);

    this.get_html_element("scatter").style.display = this.isRecording
      ? "none"
      : "block";
    this.get_html_element("graph").style.display = this.isRecording
      ? "block"
      : "none";

    if (!this.isRecording) {
      let label = this.get_class().replace(/\s/g, "_");
      console.log("label", label)
      this.update_scatter_chart(2, 3, label);
    }
  }

  get_html_element(id) {
    return document.getElementById(id);
  }

  get_class() {
    return this.get_html_element("class").value;
  }

  // Add data for post analysis
  add_data(sample) {
    if (!this.isRecording) return; // if not recording do not store data

    let { electrode, data } = sample;
    let class_label = this.get_class().replace(/\s/g, "_");

    if (!this.data[class_label]) {
      this.data[class_label] = {};
    }

    if (!this.data[class_label][electrode]) {
      this.data[class_label][electrode] = [];
    }

    for (let i in data) {
      this.data[class_label][electrode].push(data[i]);
    }

    console.log(this.data);
    this.update_graph_handlers(data, electrode);
  }

  // Update all visualizers with new data
  update_graph_handlers(data, electrode) {
    for (let i in this.graph_handlers) {
      this.graph_handlers[i].add_data(data, electrode);
    }
  }

  get_class_color() {
    return this.get_html_element("class_color").value;
  }

  update_scatter_chart(x, y, label) {
    // Get all Labels (classes)
    let labels = Object.keys(this.data);
    let scatter_plot_data = [];
    for (let i = 0; i < this.data[label][x].length; i++) {
      let _x = this.data[label][x][i];
      let _y = this.data[label][y][i];
      scatter_plot_data.push({ x: _x, y: _y });
    }

    let label_index = labels.indexOf(label)
    this.viz.add_data(
      label,
      scatter_plot_data,
      this.scatter_plot_class_colors[label_index]
    );
  }

  get_data() {
    return this.channels;
  }
};
