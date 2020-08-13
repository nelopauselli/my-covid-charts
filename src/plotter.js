import ma from './moving-average';
import totalDeathsSource from './data/total-deaths.json';
import dailyDeathsArSource from './data/daily-deaths-ar.json';
import dailyDeathsBrSource from './data/daily-deaths-br.json';
import dailyDeathsUsSource from './data/daily-deaths-us.json';

const logaritmicValues = [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 20, 30];

function totalDeathsSelectedCountriesBars() {
    let canvas = document.getElementById('chart-deaths-selected-countries-bars');
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

function dailyDeathsMediaAverage(elementId, regionName, color, ds) {
    let canvas = document.getElementById(elementId);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var sourceAR = ds.reverse();
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
        labels: datasourceAR7.map((e, i) => e.x),
        datasets: [{
            label: '7 días',
            data: datasourceAR7,
            backgroundColor: color+"22",
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
                text: 'Media Movil de fallecidos diarios en '+ regionName
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

export default function plotter(countries) {
    totalDeathsSelectedCountriesBars();
    totalDeathsLast14DaysBars();
    totalDeathsAllBars();

    dailyDeathsMediaAverage('chart-daily-deaths-ar', 'Argentina', '#4dc9f6', dailyDeathsArSource);
    dailyDeathsMediaAverage('chart-daily-deaths-br', 'Brasil', '#22ff22', dailyDeathsBrSource);
    dailyDeathsMediaAverage('chart-daily-deaths-us', 'EEUU', '#2222ff', dailyDeathsUsSource);

    /*
    let records = data.records;

    let avgSize = 5;
    var totalCases = 0, totalDeaths = 0;
    var casesTotalDatasets = [],
        deathsTotalDatasets = [],
        deathsPerDayDatasets = [];
    for (var country of countries) {
        let rows = records.filter(row => row.geoId == country.geoId);
        rows.reverse();

        let deathsTotal = [], deathsPerDay = [],
            casesTotal = [];
        let deathZero = 0, lastValue = 0, lastDeaths = 0;
        let cases = 0;

        let values = new Array(avgSize);
        values.fill(NaN);

        for (var row of rows) {
            totalCases += parseInt(row.cases);
            totalDeaths += parseInt(row.deaths);

            cases += (parseInt(row.cases) - parseInt(row.deaths));
            if (deathZero > 0 || row.deaths != 0) {
                let deaths = parseInt(row.deaths);
                let value = deaths * 100000 / (row.popData2019 || row.popData2018);
                let total = lastValue + value;

                casesTotal.push(
                    {
                        x: deathZero,
                        y: cases * 100000 / row.popData2018,
                        cases: cases,
                        deaths: total,
                    });

                deathsTotal.push(
                    {
                        x: deathZero,
                        y: total,
                        total: lastDeaths + deaths,
                        deaths: deaths
                    });

                values[deathZero % avgSize] = value;
                deathsPerDay.push(
                    {
                        x: deathZero,
                        y: values.reduce((p, c) => p + c, 0) / values.length,
                        total: lastDeaths + deaths,
                        deaths: deaths
                    });

                lastValue = total;
                lastDeaths += deaths;
                deathZero++;
            }
        }

        casesTotalDatasets.push({
            label: country.name,
            backgroundColor: country.color + "22",
            borderColor: country.color + "AA",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0,
            data: casesTotal,
            stack: 'Stack 0'
        });

        deathsTotalDatasets.push({
            label: country.name,
            backgroundColor: country.color + "22",
            borderColor: country.color + "AA",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0,
            data: deathsTotal,
            stack: 'Stack 1'
        });

        deathsPerDayDatasets.push({
            label: country.name,
            backgroundColor: country.color + "22",
            borderColor: country.color + "AA",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0,
            data: deathsPerDay,
            stack: 'Stack 1'
        });
    }

    var labels = [];
    var max = deathsTotalDatasets.reduce((p, c) => Math.max(p, c.data.length), 0);
    for (var label = 0; label < max; label++) {
        labels.push(label);
    }

    builder.build('chart-logarithmic-deaths-total', {
        datasets: deathsTotalDatasets,
        labels: labels
    }, {
        title: { text: 'total de muertes cada 100.000 habitantes (escala logar\u00edtmica)', display: true },
        scales: {
            yAxes: [{
                type: 'logarithmic',
                display: true,
                ticks: {
                    callback: function (value, index, values) {
                        return logaritmicValues.includes(value) || value == values[0] ? value : null;
                    }
                }
            }]
        }
    });

    builder.build('chart-linear-deaths-total', {
        datasets: deathsTotalDatasets,
        labels: labels
    }, {
        title: { text: 'total de muertes cada 100.000 habitantes (escala lineal)', display: true },
        scales: {
            yAxes: [{
                type: 'linear',
            }]
        }
    });

    var argentinaDays = deathsTotalDatasets[0].data.length;
    var datasets2 = deathsTotalDatasets.map(d => {
        var clone = Object.assign({}, d);
        clone.data = d.data.slice(0, Math.min(d.data.length, argentinaDays));
        return clone;
    });

    var labels2 = labels.slice(0, argentinaDays);
    builder.build('chart-logarithmic-deaths-total-argentina-days', {
        datasets: datasets2,
        labels: labels2
    }, {
        title: { text: 'total de muertes cada 100.000 habitantes (escala logar\u00edtmica) hasta el d\u00eda ' + labels2[labels2.length - 1], display: true },
        scales: {
            yAxes: [{
                type: 'logarithmic',
                display: true,
                ticks: {
                    callback: function (value, index, values) {
                        return logaritmicValues.includes(value) || value == values[0] ? value : null;
                    }
                }
            }]
        }
    });

    builder.build('chart-logarithmic-deaths-per-day', {
        datasets: deathsPerDayDatasets,
        labels: labels
    }, {
        title: { text: `muertes diarias cada 100.000 habitantes (promedio de los \u00faltimos ${avgSize} días, escala logar\u00edtmica)`, display: true },
        scales: {
            yAxes: [{
                type: 'logarithmic',
                display: true,
                ticks: {
                    callback: function (value, index, values) {
                        return logaritmicValues.includes(value) || value == values[0] ? value : null;
                    }
                }
            }]
        }
    });

    builder.build('chart-linear-deaths-per-day', {
        datasets: deathsPerDayDatasets,
        labels: labels
    }, {
        title: { text: `muertes diarias cada 100.000 habitantes (promedio de los \u00faltimos ${avgSize} días, escala lineal)`, display: true },
        scales: {
            yAxes: [{
                type: 'linear',
            }]
        }
    });

    builder.build('chart-logarithmic-cases-vs-deaths-total', {
        datasets: [...casesTotalDatasets, ...deathsTotalDatasets],
        labels: labels
    }, {
        title: { text: 'Casos diagnosticados NO fatales cada 100.000 habitantes (escala logar\u00edtmica)', display: true },
        scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }, 'bar');

    builder.build('chart-cases-vs-deaths-total', {
        datasets: [{
            data: [totalCases, totalDeaths],
            backgroundColor: ['green', 'red']
        }],
        labels: ['que no murieron', 'muertes']
    }, {
        title: { text: 'Proporciones casos recuperados vs muertes', display: true },
        scales: {
        },
        tooltips: {}
    }, 'pie');
    */
}