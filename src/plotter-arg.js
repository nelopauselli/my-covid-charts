var colors = {
    cases: '#82b1ff',
    deaths: '#ff0000'
}

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

function totalArgentinaCases(totalArgSource) {
    let canvas = document.getElementById('ar-chart-cases-time');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = [];
    for (var i = 0; i < totalArgSource[0].rows.length; i++) {
        var row = {
            date: totalArgSource[0].rows[i].date,
            deaths: totalArgSource.reduce(function (a, c) {
                if (c.rows && c.rows.length)
                    return a + c.rows[i].cases
                return a;
            }, 0)
        }
        datasource.push(row);
    }

    var averageAR28 = ma(datasource, 28);
    var datasourceAR28 = averageAR28.map(a =>
        ({ x: a.date, y: a.total })
    );

    var total = totalArgSource.reduce(function (a, c) {
        return a + c.rows.reduce(function (ra, rc) {
            return ra + rc.cases;
        }, 0);
    }, 0)

    let limitDate = moment().subtract(13, "days");
    let max = datasource.reduce((p, c) => p > c.deaths ? p : c.deaths, 0);
    let limitData = [{ x: limitDate, y: 0 }, { x: limitDate, y: max }];

    let limit = datasource.length - 13;
    let data = {
        labels: datasource.map(c => c.date),
        datasets: [{
            label: 'limite',
            data: limitData,
            backgroundColor: "orange",
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [2],
            pointRadius: 0,
        }, {
            label: 'diario',
            data: datasource.map((c, i) => i <= limit ? c.deaths : null),
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases + "22",
            borderWidth: 0,
            pointRadius: 0,
        }, {
            label: 'diario',
            data: datasource.map((c, i) => i >= limit ? c.deaths : null),
            backgroundColor: "#0f0f0f22",
            borderColor: "#0f0f0f22",
            borderWidth: 0,
            pointRadius: 0,
        }, {
            label: '4 semanas',
            data: datasourceAR28,
            fill: false,
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases,
            borderWidth: 2,
            pointRadius: 0
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

function totalArgentinaDeaths(totalArgSource) {
    let canvas = document.getElementById('ar-chart-deaths-time');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = [];
    for (var i = 0; i < totalArgSource[0].rows.length; i++) {
        var row = {
            date: totalArgSource[0].rows[i].date,
            deaths: totalArgSource.reduce(function (a, c) {
                if (c.rows && c.rows.length)
                    return a + c.rows[i].deaths
                return a;
            }, 0)
        }
        datasource.push(row);
    }

    var averageAR28 = ma(datasource, 28);
    var datasourceAR28 = averageAR28.map(a =>
        ({ x: a.date, y: a.total })
    );

    var deaths = totalArgSource.reduce(function (a, c) {
        return a + c.total;
    }, 0);

    var cases = totalArgSource.reduce(function (a, c) {
        return a + c.cases;
    }, 0);

    var ttl = totalArgSource.filter(function (r) { return r.ttl }).reduce(function (a, c) {
        return a + c.ttl;
    }, 0) / totalArgSource.filter(function (r) { return r.ttl }).length;

    var fatality = deaths * 100 / cases;

    let limitDate = moment().subtract(13, "days");
    let max = datasource.reduce((p, c) => p > c.deaths ? p : c.deaths, 0);
    let limitData = [{ x: limitDate, y: 0 }, { x: limitDate, y: max }];

    let limit = datasource.length - 13;
    let data = {
        labels: datasource.map(c => c.date),
        datasets: [{
            label: 'limite',
            data: limitData,
            backgroundColor: "orange",
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [2],
            pointRadius: 0,
        }, {
            label: 'semanal',
            data: datasource.map((c, i) => i <= limit ? c.deaths : null),
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths + "22",
            borderWidth: 0,
            pointRadius: 0,
        }, {
            label: 'semanal',
            data: datasource.map((c, i) => i >= limit ? c.deaths : null),
            backgroundColor: "#0f0f0f22",
            borderColor: "#0f0f0f22",
            borderWidth: 0,
            pointRadius: 0,
        }, {
            label: '4 semanas',
            data: datasourceAR28,
            fill: false,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths,
            borderWidth: 2,
            pointRadius: 0
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
                text: ['Fallecidos en Argentina: ' + deaths + ' personas', 'ttl: ' + parseInt(ttl) + ' d\u00EDas - letalidad: ' + parseInt(fatality) + '%']
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

function totalArgentinaDeathsByRegion(totalArgSource) {
    let canvas = document.getElementById('ar-chart-deaths-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalArgSource
        .sort((a, b) => b.average - a.average);

    let data = {
        labels: datasource.map(c => c.name),
        datasets: [{
            data: datasource.map(c => c.average),
            backgroundColor: datasource.map(c => c.color + "22"),
            borderColor: datasource.map(c => c.color + "AA")
        }]
    };

    let context = canvas.getContext('2d');
    new Chart(context, {
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

function totalArgentinaCasesByRegion(totalArgSource) {
    let canvas = document.getElementById('ar-chart-cases-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalArgSource
        .sort((a, b) => b.casesAverage - a.casesAverage);

    let data = {
        labels: datasource.map(c => c.name),
        datasets: [{
            data: datasource.map(c => c.casesAverage),
            backgroundColor: datasource.map(c => c.color + "22"),
            borderColor: datasource.map(c => c.color + "AA")
        }]
    };

    let context = canvas.getContext('2d');
    new Chart(context, {
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
                text: 'Casos cada 100.000 habitantes'
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

function last14DaysArgentina(totalArgSource) {
    let canvas = document.getElementById('ar-chart-deaths-last-14-days-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalArgSource
        .sort((a, b) => b.averageLast14Days - a.averageLast14Days);

    let data = {
        labels: datasource.map(c => c.name),
        datasets: [{
            data: datasource.map(c => c.averageLast14Days),
            backgroundColor: datasource.map(c => c.color + "22"),
            borderColor: datasource.map(c => c.color + "AA")
        }]
    };

    let context = canvas.getContext('2d');
    new Chart(context, {
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

function dailyDeathsMediaAverageArgentina(elementId, title, subtitle, region) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var source = region.rows;

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

    let limitDate = moment().subtract(13, "days");
    let max = datasourceDeaths.reduce((p, c) => p > c.y ? p : c.y, 0);
    let limitData = [{ x: limitDate, y: 0 }, { x: limitDate, y: max }];

    let data = {
        labels: datasourceDeaths.map((e) => e.x),
        datasets: [{
            label: 'limite',
            data: limitData,
            backgroundColor: "orange",
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [2],
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        }, {
            label: 'semanal',
            data: datasourceDeaths,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths + "22",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        }, {
            label: '14 d\u00EDas',
            data: datasourceMediaDeaths,
            fill: false,
            backgroundColor: colors.deaths + "11",
            borderColor: colors.deaths,
            borderWidth: 2,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        },
        {
            label: 'casos',
            data: datasourceCases,
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases + "22",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
        },
        {
            label: '14 d\u00EDas',
            data: datasourceMediaCases,
            fill: false,
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases,
            borderWidth: 2,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
        }
        ]
    };

    let context = canvas.getContext('2d');
    new Chart(context, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: [title, subtitle,
                    'ttl: ' + parseInt(region.ttl) + ' d\u00EDas - letalidad: ' + parseInt(region.total * 100 / region.cases * 100) / 100 + '%']
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
    fetch('./data/ar-total-deaths.json')
        .then(response => response.json())
        .then(totalArgSource => {
            totalArgentinaCases(totalArgSource)
            totalArgentinaDeaths(totalArgSource);
            totalArgentinaDeathsByRegion(totalArgSource);
            totalArgentinaCasesByRegion(totalArgSource);
            last14DaysArgentina(totalArgSource);

            var datasource = totalArgSource
                .sort((a, b) => b.average - a.average);

            for (let i = 0; i < 12; i++) {
                let region = datasource[i];

                dailyDeathsMediaAverageArgentina(`ar-chart-daily-deaths-${i + 1}`,
                    `Fallecidos en ${region.name}: ${region.total}`,
                    `(${Math.round(region.average * 100) / 100} por cada 100.000 hab)`,
                    region);
            }
        });
}