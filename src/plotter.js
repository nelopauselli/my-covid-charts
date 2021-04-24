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

function totalDeathsSelectedCountriesBars() {
    let canvas = document.getElementById('chart-deaths-selected-countries-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let countries = [
        'ARG', 'BRA', 'CHL', 'ECU', 'COL', 'URY', 'PER', 'BOL', 'PRY', 'USA', 'MEX',
        'DEU', 'IRL', 'SWE', 'GBR', 'ESP', 'DEU', 'ITA', 'FRA', 'RUS',
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
            borderColor: colors.deaths +"22",
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
    totalDeathsSelectedCountriesBars();
    totalDeathsLast14DaysBars();
    totalDeathsAllBars();

    dailyDeathsMediaAverage('chart-daily-deaths-ar', 'Argentina', dailyDeathsArSource);
    dailyDeathsMediaAverage('chart-daily-deaths-br', 'Brasil', dailyDeathsBrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-co', 'Colombia', dailyDeathsCoSource);
    dailyDeathsMediaAverage('chart-daily-deaths-bo', 'Bolivia', dailyDeathsBoSource);
    dailyDeathsMediaAverage('chart-daily-deaths-py', 'Paraguay', dailyDeathsPySource);
    dailyDeathsMediaAverage('chart-daily-deaths-ch', 'Chile', dailyDeathsChSource);
    dailyDeathsMediaAverage('chart-daily-deaths-pe', 'Perú', dailyDeathsPeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-us', 'EEUU', dailyDeathsUsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-es', 'España', dailyDeathsEsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-fr', 'Francia', dailyDeathsFrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-it', 'Italia', dailyDeathsItSource);
    dailyDeathsMediaAverage('chart-daily-deaths-se', 'Suecia', dailyDeathsSeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-uk', 'Reino Unido', dailyDeathsUkSource);
    dailyDeathsMediaAverage('chart-daily-deaths-de', 'Alemania', dailyDeathsDeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-is', 'Israel', dailyDeathsIsSource);
    
}