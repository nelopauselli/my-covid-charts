import builder from './chart-builder';
import data from './data/covid.json';

const logaritmicValues = [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 20, 30];

export default function plotter(countries) {
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
                let value = deaths * 100000 / row.popData2018;
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

    builder.build('chart-logarithmic-cases-total', {
        datasets: casesTotalDatasets,
        labels: labels
    }, {
        title: { text: 'Casos diagnosticados NO fatales cada 100.000 habitantes (escala logar\u00edtmica)', display: true },
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

}