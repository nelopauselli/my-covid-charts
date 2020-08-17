import ma from './moving-average';
import totalArgDeathsSource from './data/ar-total-deaths.json';

function totalArgentina() {
    let canvas = document.getElementById('ar-chart-deaths-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalArgDeathsSource
        .sort((a, b) => b.average - a.average);

    let data = {
        labels: datasource.map(c => c.name),
        datasets: [{
            data: datasource.map(c => c.average),
            backgroundColor: datasource.map(c => c.color + "22"),
            borderColor: datasource.map(c => c.color + "AA")
        }]
    };

    var horizontalBarCtx = canvas.getContext('2d');
    new Chart(horizontalBarCtx, {
        type: 'bar',
        data: data,
        options: {
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Fallecidos cada 100.000 habitantes'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function last14DaysArgentina() {
    let canvas = document.getElementById('ar-chart-deaths-last-14-days-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalArgDeathsSource
        .sort((a, b) => b.averageLast14Days - a.averageLast14Days);

    let data = {
        labels: datasource.map(c => c.name),
        datasets: [{
            data: datasource.map(c => c.averageLast14Days),
            backgroundColor: datasource.map(c => c.color + "22"),
            borderColor: datasource.map(c => c.color + "AA")
        }]
    };

    var horizontalBarCtx = canvas.getContext('2d');
    new Chart(horizontalBarCtx, {
        type: 'bar',
        data: data,
        options: {
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Fallecidos cada 100.000 habitantes (ultimos 14 días)'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function dailyDeathsMediaAverageArgentina(elementId, regionName, color, ds) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var sourceAR = ds.reverse();
    var datasourceAR = sourceAR.map((a, i) =>
        ({ x: moment().subtract(sourceAR.length - i, 'days').toDate(), y: a })
    );
    var averageAR7 = ma(sourceAR, 7);
    var datasourceAR7 = averageAR7.map((a, i) =>
        ({ x: moment().subtract(averageAR7.length - i, 'days').toDate(), y: a })
    );
    var averageAR14 = ma(sourceAR, 14);
    var datasourceAR14 = averageAR14.map((a, i) =>
        ({ x: moment().subtract(averageAR14.length - i, 'days').toDate(), y: a })
    );
    var averageAR30 = ma(sourceAR, 30);
    var datasourceAR30 = averageAR30.map((a, i) =>
        ({ x: moment().subtract(averageAR30.length - i, 'days').toDate(), y: a })
    );
    let data = {
        labels: datasourceAR.map((e, i) => e.x),
        datasets: [{
            label: 'diario',
            data: datasourceAR,
            backgroundColor: color + "22",
            borderColor: color + "22",
            borderWidth: 0,
            pointRadius: 0
        }, {
            label: '7 días',
            data: datasourceAR7,
            fill: false,
            backgroundColor: color + "22",
            borderColor: color,
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '14 días',
            data: datasourceAR14,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '30 días',
            data: datasourceAR30,
            fill: false,
            backgroundColor: "#ff00ff11",
            borderColor: "#ff00ff",
            borderWidth: 1,
            pointRadius: 1
        }
        ]
    };

    var ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Media Movil de fallecidos diarios en ' + regionName
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    type: "time",
                    time: {
                        tooltipFormat: 'll'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    });
}

export default function plotter() {
    totalArgentina();
    last14DaysArgentina();

    let caba = totalArgDeathsSource.find(r => r.name == 'CABA');
    dailyDeathsMediaAverageArgentina("ar-chart-daily-deaths-caba", "caba", "#4dc9f6", caba.rows);

    let bue = totalArgDeathsSource.find(r => r.name == 'Buenos Aires');
    dailyDeathsMediaAverageArgentina("ar-chart-daily-deaths-bue", "buenos aires", "#4dc9f6", bue.rows);
}