var colors = {
    cases: '#82b1ff',
    deaths: '#ff0000'
}

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

    let countries = [
        'ARG', 'BRA', 'CHL', 'ECU', 'COL', 'URY', 'PER', 'BOL', 'PRY', 'USA', 'MEX',
        'IRL', 'SWE', 'GBR', 'ESP', 'DEU', 'ITA', 'FRA', 'RUS',
        'ISR', 'JPN', 'CHN',
        'AUS',
        'Asia', 'Europe', 'America', 'Africa'];

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
        .filter(c => c.averageLast14Days > 0)
        .sort((a, b) => b.averageLast14Days - a.averageLast14Days)
        .slice(0, 20);

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

function dailyDeathsMediaAverage(elementId, regionName, source) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var datasource = source.map((a, i) =>
        ({ x: moment().subtract(source.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var average28 = ma(source, 4);
    var datasource28 = average28.map((a, i) =>
        ({ x: moment().subtract(average28.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );

    var max = Math.max.apply(null, source);

    let data = {
        labels: datasource.map((e, i) => e.x),
        datasets: [{
            label: 'diario',
            data: datasource,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths + "22",
            borderWidth: 0,
            pointRadius: 0
        }, {
            label: '4 semanas',
            data: datasource28,
            fill: false,
            backgroundColor: colors.deaths + "22",
            borderColor: colors.deaths,
            borderWidth: 2,
            pointRadius: 0
        }
        ]
    };

    var total = source.reduce((a, c) => a + c, 0);

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
                        max: Math.round(max * 1.1)
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

export default function plotter(countries) {
    fetch('./data/total-deaths.json')
        .then(response => response.json())
        .then((response) => {
            totalDeathsSelectedCountriesBars(response);
            totalDeathsLast14DaysBars(response);
            totalDeathsAllBars(response);
        });

    fetch('./data/daily-deaths-arg.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-ar', 'Argentina', response);
        });

    fetch('./data/daily-deaths-bra.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-br', 'Brasil', response);
        });
    fetch('./data/daily-deaths-col.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-co', 'Colombia', response);
        });
    fetch('./data/daily-deaths-bol.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-bo', 'Bolivia', response);
        });
    fetch('./data/daily-deaths-pry.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-py', 'Paraguay', response);
        });
    fetch('./data/daily-deaths-chl.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-ch', 'Chile', response);
        });
    fetch('./data/daily-deaths-per.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-pe', 'Perú', response);
        });
    fetch('./data/daily-deaths-usa.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-us', 'EEUU', response);
        });
    fetch('./data/daily-deaths-esp.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-es', 'España', response);
        });
    fetch('./data/daily-deaths-fra.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-fr', 'Francia', response);
        });
    fetch('./data/daily-deaths-ita.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-it', 'Italia', response);
        });
    fetch('./data/daily-deaths-swe.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-se', 'Suecia', response);
        });
    fetch('./data/daily-deaths-gbr.json')
        .then(response => response.json())
        .then(response => {
            dailyDeathsMediaAverage('chart-daily-deaths-uk', 'Reino Unido', response);
        });
}