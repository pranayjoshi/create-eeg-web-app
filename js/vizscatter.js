export const VizScatter = class {
  constructor() {
    const ctx = document.getElementById("chart1");

    this.chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {},
          },
        },
      },
    });

    document.getElementById('save-chart').addEventListener('click', () => {
      this.save_chart();
    });


    // Add Data
    /*
    this.get_html_element("add_data").onclick = function (e) {
      let data = [
        { x: 10, y: 14 },
        { x: 25, y: 35 },
        { x: 21, y: 20 },
        { x: 35, y: 28 },
        { x: 15, y: 10 },
        { x: 19, y: 30 },
      ];
      this.add_data("class 1", data, "pink");
    }.bind(this);
    */
  }

  save_chart() {
    this.chart.canvas.toBlob((blob) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'chart.png';
      a.click();
      window.URL.revokeObjectURL(url);
    }, 'image/png', 1);
  }

  get_html_element(id) {
    return document.getElementById(id);
  }

  remove_all_data() {
    // https://www.chartjs.org/docs/latest/developers/updates.html
    this.chart.data.labels = [];
    this.chart.data.datasets = []
    this.chart.update();
    console.log(this.chart)
  }

  
  remove_class_data(class_label){
    this.chart.data.labels = this.chart.data.labels.filter(label => label !== class_label)
    this.chart.data.datasets[class_label] = []
    this.chart.update();
  }

  add_data(
    label,
    data,
    backgroundColor = "aqua",
    borderColor = "transparent",
    radius = 4
  ) {
    //chart.data.labels.push(label);
    this.remove_class_data(label)
    this.chart.data.datasets.push({
      label,
      data,
      backgroundColor: [backgroundColor],
      borderColor: [borderColor],
      radius,
    });

    this.set_axis_title("x", "Oz")
    this.chart.update();
  }

  set_axis_title(axis, label) {
    this.chart.options.scales[axis].title.text = label;
  }
};
