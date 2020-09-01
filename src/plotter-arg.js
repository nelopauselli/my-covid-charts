import totalArgDeathsSource from './data/ar-total-deaths.json';

function ma(source, period, propertyName = "deaths") {
    var sum = 0;
    var sma = new Array(source.length);
    for (var i = 0; i < source.length; i++) {
        if (i >= period) {
            for (var j = 0; j < period - 1; j++) {
                sum = sum + source[i - j][propertyName];
            }
            sma[i] = {
                date: source[i].date,
                total: Math.round(sum / period)
            };
            sum = 0;
        } else {
            sma[i] = { date: source[i].date, total: null };
        }
    }
    return sma;
}

function totalArgentinaCases() {
    let canvas = document.getElementById('ar-chart-cases-time');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = [];
    for (var i = 0; i < totalArgDeathsSource[0].rows.length; i++) {
        var row = {
            date: totalArgDeathsSource[0].rows[i].date,
            deaths: totalArgDeathsSource.reduce(function (a, c) {
                if (c.rows && c.rows.length)
                    return a + c.rows[i].cases
                return a;
            }, 0)
        }
        datasource.push(row);
    }

    datasource.reverse();

    var averageAR7 = ma(datasource, 7);
    var datasourceAR7 = averageAR7.map(a =>
        ({ x: a.date, y: a.total })
    );
    console.log(datasourceAR7);

    var averageAR14 = ma(datasource, 14);
    var datasourceAR14 = averageAR14.map(a =>
        ({ x: a.date, y: a.total })
    );

    var averageAR30 = ma(datasource, 30);
    var datasourceAR30 = averageAR30.map(a =>
        ({ x: a.date, y: a.total })
    );

    var total = totalArgDeathsSource.reduce(function (a, c) {
        return a + c.rows.reduce(function (ra, rc) {
            return ra + rc.deaths;
        }, 0);
    }, 0)

    let data = {
        labels: datasource.map(c => c.date),
        datasets: [{
            data: datasource.map(c => c.deaths),
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6AA",
            pointRadius: 0,
        }, {
            label: '7 d\u00EDas',
            data: datasourceAR7,
            fill: false,
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '14 d\u00EDas',
            data: datasourceAR14,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '30 d\u00EDas',
            data: datasourceAR30,
            fill: false,
            backgroundColor: "#ff00ff11",
            borderColor: "#ff00ff",
            borderWidth: 1,
            pointRadius: 1
        }]
    };

    var ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Casos en Argentina seg\u00FAn fecha de inicio de S\u00EDntomas: ' + total + ' personas'
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

function totalArgentinaDeaths() {
    let canvas = document.getElementById('ar-chart-deaths-time');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = [];
    for (var i = 0; i < totalArgDeathsSource[0].rows.length; i++) {
        var row = {
            date: totalArgDeathsSource[0].rows[i].date,
            deaths: totalArgDeathsSource.reduce(function (a, c) {
                if (c.rows && c.rows.length)
                    return a + c.rows[i].deaths
                return a;
            }, 0)
        }
        datasource.push(row);
    }

    datasource.reverse();

    var averageAR7 = ma(datasource, 7);
    var datasourceAR7 = averageAR7.map(a =>
        ({ x: a.date, y: a.total })
    );
    console.log(datasourceAR7);

    var averageAR14 = ma(datasource, 14);
    var datasourceAR14 = averageAR14.map(a =>
        ({ x: a.date, y: a.total })
    );

    var averageAR30 = ma(datasource, 30);
    var datasourceAR30 = averageAR30.map(a =>
        ({ x: a.date, y: a.total })
    );

    var deaths = totalArgDeathsSource.reduce(function (a, c) {
        return a + c.rows.reduce(function (ra, rc) {
            return ra + rc.deaths;
        }, 0);
    }, 0)

    let data = {
        labels: datasource.map(c => c.date),
        datasets: [{
            data: datasource.map(c => c.deaths),
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6AA",
            pointRadius: 0,
        }, {
            label: '7 d\u00EDas',
            data: datasourceAR7,
            fill: false,
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '14 d\u00EDas',
            data: datasourceAR14,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '30 d\u00EDas',
            data: datasourceAR30,
            fill: false,
            backgroundColor: "#ff00ff11",
            borderColor: "#ff00ff",
            borderWidth: 1,
            pointRadius: 1
        }]
    };

    var ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Fallecidos en Argentina: ' + deaths + ' personas'
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

function totalArgentinaFutureDeaths() {
    let canvas = document.getElementById('ar-chart-future-deaths-time');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = [];
    for (var i = 0; i < totalArgDeathsSource[0].rows.length; i++) {
        var row = {
            date: totalArgDeathsSource[0].rows[i].date,
            deaths: totalArgDeathsSource.reduce(function (a, c) {
                if (c.rows && c.rows.length)
                    return a + c.rows[i].futureDeaths
                return a;
            }, 0)
        }
        datasource.push(row);
    }

    datasource.reverse();

    var averageAR7 = ma(datasource, 7);
    var datasourceAR7 = averageAR7.map(a =>
        ({ x: a.date, y: a.total })
    );
    console.log(datasourceAR7);

    var averageAR14 = ma(datasource, 14);
    var datasourceAR14 = averageAR14.map(a =>
        ({ x: a.date, y: a.total })
    );

    var averageAR30 = ma(datasource, 30);
    var datasourceAR30 = averageAR30.map(a =>
        ({ x: a.date, y: a.total })
    );

    var deaths = totalArgDeathsSource.reduce(function (a, c) {
        return a + c.rows.reduce(function (ra, rc) {
            return ra + rc.deaths;
        }, 0);
    }, 0)

    // var ttl = totalArgDeathsSource.filter(function (r) { return r.ttl }).reduce(function (a, c) {
    //     return a + c.ttl;
    // }, 0) / totalArgDeathsSource.filter(function (r) { return r.ttl }).length;

    let data = {
        labels: datasource.map(c => c.date),
        datasets: [{
            data: datasource.map(c => c.deaths),
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6AA",
            pointRadius: 0,
        }, {
            label: '7 d\u00EDas',
            data: datasourceAR7,
            fill: false,
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f6",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '14 d\u00EDas',
            data: datasourceAR14,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '30 d\u00EDas',
            data: datasourceAR30,
            fill: false,
            backgroundColor: "#ff00ff11",
            borderColor: "#ff00ff",
            borderWidth: 1,
            pointRadius: 1
        }]
    };

    var ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Fallecidos en Argentina seg\u00FAn Inicio de S\u00EDntomas: ' + deaths + ' personas.' // ttl: ' + ttl + ' d\u00EDas'
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

function totalArgentinaByRegion() {
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
                text: 'Fallecidos cada 100.000 habitantes (ultimos 14 d\u00EDas)'
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

function dailyDeathsMediaAverageArgentina(elementId, title, subtitle, ds) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var source = ds.reverse();
    var datasourceCases = source.map(a =>
        ({ x: moment(a.date).toDate(), y: a.cases })
    );

    var averageMediaCases = ma(source, 14, "cases");
    var datasourceMediaCases = averageMediaCases.map(a =>
        ({ x: moment(a.date).toDate(), y: a.total })
    );

    var datasourceDeaths = source.map(a =>
        ({ x: moment(a.date).toDate(), y: a.deaths })
    );

    var averageMediaDeaths = ma(source, 14, "deaths");
    var datasourceMediaDeaths = averageMediaDeaths.map(a =>
        ({ x: moment(a.date).toDate(), y: a.total })
    );

    let data = {
        labels: datasourceDeaths.map((e) => e.x),
        datasets: [{
            label: 'diario',
            data: datasourceDeaths,
            backgroundColor: "#ff000022",
            borderColor: "#ff000022",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        }, {
            label: '14 d\u00EDas',
            data: datasourceMediaDeaths,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        },
        {
            label: 'casos',
            data: datasourceCases,
            backgroundColor: "#4dc9f622",
            borderColor: "#4dc9f622",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
        },
        {
            label: '14 d\u00EDas',
            data: datasourceMediaCases,
            fill: false,
            backgroundColor: "#4dc9f611",
            borderColor: "#4dc9f6",
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
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
                    },
                    position: 'left',
                    id: 'y-axis-1',
                },
                {
                    ticks: {
                        beginAtZero: true
                    },
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
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
    totalArgentinaCases()
    totalArgentinaDeaths();
    totalArgentinaFutureDeaths();
    totalArgentinaByRegion();
    last14DaysArgentina();

    var datasource = totalArgDeathsSource
        .sort((a, b) => b.average - a.average);

    for (let i = 0; i < 12; i++) {
        let region = datasource[i];
        dailyDeathsMediaAverageArgentina(`ar-chart-daily-deaths-${i + 1}`,
            `Fallecidos en ${region.name}: ${region.total}`,
            `(${Math.round(region.average * 100) / 100} por cada 100.000 hab)`,
            region.rows);
    }
}