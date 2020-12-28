import totalDeathsSource from './data/total-deaths.json';
import dailyDeathsArSource from './data/daily-deaths-ar.json';
import dailyDeathsCoSource from './data/daily-deaths-co.json';
import dailyDeathsPeSource from './data/daily-deaths-pe.json';
import dailyDeathsBrSource from './data/daily-deaths-br.json';
import dailyDeathsUsSource from './data/daily-deaths-us.json';
import dailyDeathsEsSource from './data/daily-deaths-es.json';
import dailyDeathsFrSource from './data/daily-deaths-fr.json';
import dailyDeathsItSource from './data/daily-deaths-it.json';
import dailyDeathsSeSource from './data/daily-deaths-se.json';
import dailyDeathsUkSource from './data/daily-deaths-uk.json';

import totalArgDeathsSource from './data/ar-total-deaths.json';

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

    let countries = ['AR', 'BR', 'CL', 'EC', 'CO', 'UY', 'PE', 'BO', 'PY', 'US',
        'IE', 'SE', 'UK', 'ES', 'DE', 'IT', 'FR', 'RU',
        'IL', 'TR', 'KR', 'JP', 'ZA', 'IN',
        'AU',
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

function totalArgentina() {
    let canvas = document.getElementById('ar-chart-deaths-bars');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 10;

    var datasource = totalArgDeathsSource
        //.filter(c => c.total > 0)
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

function dailyDeathsMediaAverage(elementId, regionName, ds) {
    let canvas = document.getElementById(elementId);
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var source = ds.reverse();
    var datasource = source.map((a, i) =>
        ({ x: moment().subtract(source.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
    );
    var average14 = ma(source, 2);
    var datasource14 = average14.map((a, i) =>
        ({ x: moment().subtract(average14.length - i, 'weeks').toDate(), y: Math.max(a, 0) })
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
            backgroundColor: "#00000022",
            borderWidth: 0,
            pointRadius: 0
        }, {
                label: '2 semanas',
            data: datasource14,
            fill: false,
            backgroundColor: "#ff000011",
            borderColor: "#ff0000",
            borderWidth: 1,
            pointRadius: 1
        }, {
            label: '4 semanas',
            data: datasource28,
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
    dailyDeathsMediaAverage('chart-daily-deaths-pe', 'Perú', dailyDeathsPeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-us', 'EEUU', dailyDeathsUsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-es', 'España', dailyDeathsEsSource);
    dailyDeathsMediaAverage('chart-daily-deaths-fr', 'Francia', dailyDeathsFrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-it', 'Italia', dailyDeathsItSource);
    dailyDeathsMediaAverage('chart-daily-deaths-se', 'Suecia', dailyDeathsSeSource);
    dailyDeathsMediaAverage('chart-daily-deaths-uk', 'Reino Unido', dailyDeathsUkSource);

    totalArgentina();
    last14DaysArgentina();
}