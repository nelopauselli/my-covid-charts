class ChartBuilder {
    build(id, data, options, type) {
        options = Object.assign({
            responsive: true,
            title: { text: 'muertes / 100.000 habitantes', display: true },
            legend: {
                labels: {
                    filter: function (item, data) {
                        return !item.text.includes("acumulado");
                    }
                },
                // onClick: function (event, legendItem) {
                //     var hidden = legendItem.hidden === null ? true : !legendItem.hidden;

                //     var metadata1 = this.chart.getDatasetMeta(legendItem.datasetIndex);
                //     metadata1.hidden = hidden;
                //     var metadata2 = this.chart.getDatasetMeta(legendItem.datasetIndex + 1);
                //     metadata2.hidden = hidden;

                //     this.chart.update();
                // }
            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    title: function (tooltipItems, data) {
                        return "Día " + tooltipItems[0].label;
                    },
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var label = dataset.label || '';

                        if (label) {
                            label += ': ';
                        }

                        var value = tooltipItem.yLabel;
                        label += value.toFixed(2);

                        var item = dataset.data[tooltipItem.index];
                        if (item.deaths && item.total)
                            label += " (" + item.deaths + "/" + item.total + ")";
                        else if (item.deaths)
                            label += " (vs " + item.deaths.toFixed(2) + " muertes)";
                        return label;
                    }
                }
            },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    display: true
                }]
            }
        }, options);

        var canvas = document.getElementById(id);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var ctx = canvas.getContext('2d');
        var chart = new Chart(ctx, {
            type: type || 'line',
            data: data,
            options: options
        });
    }
}

export default new ChartBuilder();