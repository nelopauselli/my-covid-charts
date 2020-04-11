import { colors } from './util';
import builder from './chart-builder';

export default function plotter() {
    var url = "./data/covid.json";

    var countries = [
        { name: 'Argentina', geoId: 'AR', color: colors(0) },
        { name: 'Brazil', geoId: 'BR', color: colors(1) },
        { name: 'Chile', geoId: 'CL', color: colors(2) },
        { name: 'Ecuador', geoId: 'EC', color: colors(3) },
        { name: 'Colombia', geoId: 'CO', color: colors(4) },
        { name: 'Uruguay', geoId: 'UY', color: colors(5) },
        { name: 'Perú', geoId: 'PE', color: colors(6) },
        { name: 'Estados Unidos', geoId: 'US', color: colors(7) },
        { name: 'España', geoId: 'ES', color: colors(8) },
        { name: 'Italia', geoId: 'IT', color: colors(9) },
        { name: 'Francia', geoId: 'FR', color: colors(10) },
        { name: 'China', geoId: 'CN', color: colors(11) },
        { name: 'Korea del Sur', geoId: 'KR', color: colors(12) },

    ];

    $.getJSON(url, function (response) {
        let records = response.records;

        var datasetsTotals = [];
        var datasetsPerDay = [];
        for (var country of countries) {
            let rows = records.filter(row => row.geoId == country.geoId);
            rows.reverse();

            let dataTotal = [], dataPerDay=[];
            let deathZero = 0, lastValue = 0, lastDeaths = 0;
            for (var row of rows) {
                if (deathZero > 0 || row.deaths != 0) {
                    let deaths = parseInt(row.deaths);
                    let value = deaths * 100000 / row.popData2018;
                    let total = lastValue + value;

                    dataTotal.push(
                        {
                            x: deathZero,
                            y: total,
                            total: lastDeaths + deaths,
                            deaths: deaths
                        });

                    dataPerDay.push(
                        {
                            x: deathZero,
                            y: value,
                            total: lastDeaths + deaths,
                            deaths: deaths
                        });

                    lastValue = total;
                    lastDeaths += deaths;
                    deathZero++;
                }
            }

            let datasetTotal = {
                label: country.name,
                backgroundColor: country.color + "22",
                borderColor: country.color + "AA",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                lineTension: 0,
                data: dataTotal
            };
            datasetsTotals.push(datasetTotal);
            
            let datasetPerDay = {
                label: country.name,
                backgroundColor: country.color + "22",
                borderColor: country.color + "AA",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                lineTension: 0,
                data: dataPerDay
            };
            datasetsPerDay.push(datasetPerDay);
        }

        var labels = [];
        var max = datasetsTotals.reduce((p, c) => Math.max(p, c.data.length), 0);
        for (var label = 0; label < max; label++) {
            labels.push(label);
        }

        builder.build('chart-logarithmic-deaths-total', {
            datasets: datasetsTotals,
            labels: labels
        }, {
            title: { text: 'total de decesos / 100.000 habitantes (escala logar\u00edtmica)', display: true },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    display: false
                }]
            }
        });

        builder.build('chart-linear-deaths-total', {
            datasets: datasetsTotals,
            labels: labels
        }, {
            title: { text: 'total de decesos / 100.000 habitantes (escala lineal)', display: true },
            scales: {
                yAxes: [{
                    type: 'linear',
                }]
            }
        });

        var argentinaDays = datasetsTotals[0].data.length;
        var datasets2 = datasetsTotals.map(d => {
            d.data = d.data.slice(0, Math.min(d.data.length, argentinaDays));
            return d;
        })
        var labels2 = labels.slice(0, argentinaDays);
        builder.build('chart-logarithmic-deaths-total-argentina-days', {
            datasets: datasets2,
            labels: labels2
        }, {
            title: { text: 'total de decesos / 100.000 habitantes (escala logar\u00edtmica) hasta el d\u00eda ' + labels2[labels2.length - 1], display: true },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    display: false
                }]
            }
        });

        builder.build('chart-logarithmic-deaths-per-day', {
            datasets: datasetsPerDay,
            labels: labels
        }, {
            title: { text: 'decesos diarios / 100.000 habitantes (escala logar\u00edtmica)', display: true },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    display: false,
                    ticks: {
                        callback: function (tick, index, ticks) {
                            return Math.round(tick * 10000) / 10000;
                        }}
                }]
            }
        });

        builder.build('chart-linear-deaths-per-day', {
            datasets: datasetsPerDay,
            labels: labels
        }, {
            title: { text: 'decesos diarios / 100.000 habitantes (escala lineal)', display: true },
            scales: {
                yAxes: [{
                    type: 'linear',
                }]
            }
        });
    });
}