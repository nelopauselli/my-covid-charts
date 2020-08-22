import totalArgDeathsSource from './data/ar-total-deaths.json';

function ma(source, period) {
    var sum = 0;
    var sma = new Array(source.length);
    for (var i = 0; i < source.length; i++) {
        if (i >= period) {
            for (var j = 0; j < period - 1; j++) {
                sum = sum + source[i - j].deaths;
            }
            sma[i] = {
                date: source[i].date,
                deaths: Math.round(sum / period)
            };
            sum = 0;
        } else {
            sma[i] = { date: source[i].date, deaths: null };
        }
    }
    return sma;
}

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

function dailyDeathsMediaAverageArgentina(elementId, title, subtitle, color, ds) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var sourceAR = ds.reverse();
    var datasourceAR = sourceAR.map(a =>
        ({ x: moment(a.date).toDate(), y: a.deaths })
    );

    var averageAR7 = ma(sourceAR, 7);
    var datasourceAR7 = averageAR7.map(a =>
        ({ x: moment(a.date).toDate(), y: a.deaths })
    );

    var averageAR14 = ma(sourceAR, 14);
    var datasourceAR14 = averageAR14.map(a =>
        ({ x: moment(a.date).toDate(), y: a.deaths })
    );

    var averageAR30 = ma(sourceAR, 30);
    var datasourceAR30 = averageAR30.map(a =>
        ({ x: moment(a.date).toDate(), y: a.deaths })
    );

    let data = {
        labels: datasourceAR.map((e) => e.x),
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
                text: [title, subtitle]
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

    var datasource = totalArgDeathsSource
        .sort((a, b) => b.average - a.average);

    for (let i = 0; i < 12; i++) {
        let region = datasource[i];
        dailyDeathsMediaAverageArgentina(`ar-chart-daily-deaths-${i + 1}`,
            `Fallecidos en ${region.name}: ${region.total}`,
            `(${Math.round(region.average*100)/100} por cada 100.000 hab)`,
            "#4dc9f6",
            region.rows);
    }
}