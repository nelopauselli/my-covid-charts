var colors = {
    cases: '#82b1ff',
    deaths: '#ff0000'
}

let countries = [
    'ARG', 'BRA', 'CHL', 'ECU', 'COL', 'URY', 'PER', 'BOL', 'PRY', 'USA', 'MEX',
    'DEU', 'IRL', 'SWE', 'GBR', 'ESP', 'DEU', 'ITA', 'FRA', 'RUS',
    'ISR', 'JPN', 'CHN', 'IND',
    'AUS',
    'Asia', 'Europe', 'America', 'Africa'];


function ma(source, period) {
    var sum = 0;
    var sma = new Array(source.length);
    for (var i = 0; i < source.length; i++) {
        if (i >= period) {
            for (var j = 0; j < period - 1; j++) {
                sum = sum + source[i - j];
            }
            sma[i] = Math.round(sum / period);

            sum = 0;
        } else {
            sma[i] = null;
        }
    }
    return sma;
}

function totalDeathsSelectedCountriesBars(totalDeathsSource) {
    let canvas = document.getElementById('chart-deaths-selected-countries-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalDeathsSource
        .filter(c => countries.includes(c.geoId))
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

function totalCasesSelectedCountriesBars(totalCasesSource) {
    let canvas = document.getElementById('chart-cases-selected-countries-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalCasesSource
        .filter(c => countries.includes(c.geoId))
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

function totalDeathsAllBars(totalDeathsSource) {
    let canvas = document.getElementById('chart-deaths-all-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 10;


    var datasource = totalDeathsSource
        .filter(c => c.total > 0)
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
        type: 'horizontalBar',
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
                text: 'Fallecidos cada 100.000 habitantes (todos los paises)'
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

function totalDeathsLast14DaysBars(totalDeathsSource) {
    let canvas = document.getElementById('chart-deaths-last-14-days-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = totalDeathsSource
        .filter(c => countries.includes(c.geoId))
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
        type: 'horizontalBar',
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
                text: 'Fallecidos cada 100.000 habitantes (ultimas 3 semanas)'
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

function dailyMediaAverageLoader(elementId, regionName, code) {
    Promise.all(
        [
            fetch('./data/daily-deaths-' + code + '.json'),
            fetch('./data/daily-cases-' + code + '.json')
        ]).then(responses => {
            return Promise.all([
                responses[0].json(),
                responses[1].json()]);
        }
        ).then(jsons => {
            dailyMediaAverage(elementId, regionName, jsons[0], jsons[1]);
        });
}

function dailyMediaAverage(elementId, regionName, deathsSource, casesSource) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var dataSourceDeaths = deathsSource.map((a, i) =>
        ({ x: moment().subtract(deathsSource.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var dataSourceCases = casesSource.map((a, i) =>
        ({ x: moment().subtract(casesSource.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var averageDeaths28 = ma(deathsSource, 4);
    var dataSourceDeaths28 = averageDeaths28.map((a, i) =>
        ({ x: moment().subtract(averageDeaths28.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var averageCases28 = ma(casesSource, 4);
    var dataSourceCases28 = averageCases28.map((a, i) =>
        ({ x: moment().subtract(averageCases28.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var maxDeaths = Math.max.apply(null, deathsSource);
    var maxCases = Math.max.apply(null, casesSource);

    let data = {
        labels: dataSourceDeaths.map((e, i) => e.x),
        datasets: [{
            label: 'fallecidos semanal',
            data: dataSourceDeaths,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths + "22",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        }, {
            label: 'fallecidos 4 semanas',
            data: dataSourceDeaths28,
            fill: false,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths,
            borderWidth: 2,
            pointRadius: 0,
            yAxisID: 'y-axis-1',
        }, {
            label: 'casos semanal',
            data: dataSourceCases,
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases + "22",
            borderWidth: 0,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
        }, {
            label: 'casos 4 semanas',
            data: dataSourceCases28,
            fill: false,
            backgroundColor: colors.cases + "22",
            borderColor: colors.cases,
            borderWidth: 2,
            pointRadius: 0,
            yAxisID: 'y-axis-2',
        }
        ]
    };

    var total = deathsSource.reduce((a, c) => a + c, 0);

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
                text: 'Fallecidos en ' + regionName + ' (' + total + ' personas)'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: Math.round(maxDeaths * 1.1)
                    },
                    position: 'left',
                    id: 'y-axis-1',
                }, {
                    ticks: {
                        beginAtZero: true,
                        max: Math.round(maxCases * 1.1)
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

export default function plotter(countries) {
    fetch('./data/total-deaths.json')
        .then(response => response.json())
        .then((response) => {
            totalDeathsSelectedCountriesBars(response);
            totalDeathsLast14DaysBars(response);
            totalDeathsAllBars(response);
        });

    fetch('./data/total-cases.json')
        .then(response => response.json())
        .then((response) => {
            totalCasesSelectedCountriesBars(response);
        });


    dailyMediaAverageLoader('chart-daily-deaths-ar', 'Argentina', 'arg');
    dailyMediaAverageLoader('chart-daily-deaths-br', 'Brasil', 'bra');
    dailyMediaAverageLoader('chart-daily-deaths-co', 'Colombia', 'col');
    dailyMediaAverageLoader('chart-daily-deaths-bo', 'Bolivia', 'bol');
    dailyMediaAverageLoader('chart-daily-deaths-py', 'Paraguay', 'pry');
    dailyMediaAverageLoader('chart-daily-deaths-ch', 'Chile', 'chl');
    dailyMediaAverageLoader('chart-daily-deaths-pe', 'Perú', 'per');
    dailyMediaAverageLoader('chart-daily-deaths-de', 'Alemania', 'deu');
    dailyMediaAverageLoader('chart-daily-deaths-ir', 'Irlanda', 'irl');
    dailyMediaAverageLoader('chart-daily-deaths-us', 'EEUU', 'usa');
    dailyMediaAverageLoader('chart-daily-deaths-es', 'España', 'esp');
    dailyMediaAverageLoader('chart-daily-deaths-fr', 'Francia', 'fra');
    dailyMediaAverageLoader('chart-daily-deaths-it', 'Italia', 'ita');
    dailyMediaAverageLoader('chart-daily-deaths-se', 'Suecia', 'swe');
    dailyMediaAverageLoader('chart-daily-deaths-uk', 'Reino Unido', 'gbr');
}