import totalDeathsSource from './data/total-deaths.json';
import dailyDeathsArSource from './data/daily-deaths-arg.json';
import dailyDeathsCoSource from './data/daily-deaths-col.json';
import dailyDeathsBoSource from './data/daily-deaths-bol.json';
import dailyDeathsPySource from './data/daily-deaths-pry.json';
import dailyDeathsChSource from './data/daily-deaths-chl.json';
import dailyDeathsPeSource from './data/daily-deaths-per.json';
import dailyDeathsBrSource from './data/daily-deaths-bra.json';
import dailyDeathsUsSource from './data/daily-deaths-usa.json';
import dailyDeathsEsSource from './data/daily-deaths-esp.json';
import dailyDeathsFrSource from './data/daily-deaths-fra.json';
import dailyDeathsItSource from './data/daily-deaths-ita.json';
import dailyDeathsSeSource from './data/daily-deaths-swe.json';
import dailyDeathsUkSource from './data/daily-deaths-gbr.json';
import dailyDeathsDeSource from './data/daily-deaths-deu.json';
import dailyDeathsIsSource from './data/daily-deaths-isr.json';
import totalCasesSource from './data/total-cases.json';
import dailyCasesArSource from './data/daily-cases-arg.json';
import dailyCasesCoSource from './data/daily-cases-col.json';
import dailyCasesBoSource from './data/daily-cases-bol.json';
import dailyCasesPySource from './data/daily-cases-pry.json';
import dailyCasesChSource from './data/daily-cases-chl.json';
import dailyCasesPeSource from './data/daily-cases-per.json';
import dailyCasesBrSource from './data/daily-cases-bra.json';
import dailyCasesUsSource from './data/daily-cases-usa.json';
import dailyCasesEsSource from './data/daily-cases-esp.json';
import dailyCasesFrSource from './data/daily-cases-fra.json';
import dailyCasesItSource from './data/daily-cases-ita.json';
import dailyCasesSeSource from './data/daily-cases-swe.json';
import dailyCasesUkSource from './data/daily-cases-gbr.json';
import dailyCasesDeSource from './data/daily-cases-deu.json';
import dailyCasesIsSource from './data/daily-cases-isr.json';

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

function totalDeathsSelectedCountriesBars() {
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

function totalCasesSelectedCountriesBars() {
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

function totalDeathsAllBars() {
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

function totalDeathsLast14DaysBars() {
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

function dailyDeathsMediaAverage(elementId, regionName, deathsSource, casesSource) {
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
    totalDeathsSelectedCountriesBars();
    totalCasesSelectedCountriesBars();

    totalDeathsLast14DaysBars();
    totalDeathsAllBars();

    dailyDeathsMediaAverage('chart-daily-deaths-ar', 'Argentina', dailyDeathsArSource, dailyCasesArSource);
    dailyDeathsMediaAverage('chart-daily-deaths-br', 'Brasil', dailyDeathsBrSource, dailyCasesBrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-co', 'Colombia', dailyDeathsCoSource, dailyCasesCoSource);
    dailyDeathsMediaAverage('chart-daily-deaths-bo', 'Bolivia', dailyDeathsBoSource, dailyCasesBoSource);
    dailyDeathsMediaAverage('chart-daily-deaths-py', 'Paraguay', dailyDeathsPySource, dailyCasesPySource);
    dailyDeathsMediaAverage('chart-daily-deaths-ch', 'Chile', dailyDeathsChSource, dailyCasesChSource);
    dailyDeathsMediaAverage('chart-daily-deaths-pe', 'Perú', dailyDeathsPeSource, dailyCasesPeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-us', 'EEUU', dailyDeathsUsSource, dailyCasesUsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-es', 'España', dailyDeathsEsSource, dailyCasesEsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-fr', 'Francia', dailyDeathsFrSource, dailyCasesFrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-it', 'Italia', dailyDeathsItSource, dailyCasesItSource);
    dailyDeathsMediaAverage('chart-daily-deaths-se', 'Suecia', dailyDeathsSeSource, dailyCasesSeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-uk', 'Reino Unido', dailyDeathsUkSource, dailyCasesUkSource);
    dailyDeathsMediaAverage('chart-daily-deaths-de', 'Alemania', dailyDeathsDeSource, dailyCasesDeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-is', 'Israel', dailyDeathsIsSource, dailyCasesIsSource);

}