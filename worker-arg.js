const fs = require('fs'),
    path = require('path');
const csv = require('csv-parser');

let workingFolder = './src/data';

var raw = fs.readFileSync(path.join(__dirname, './temp/regions-ar.json'));
var regions = JSON.parse(raw);
var colors = ['#4dc9f6', '#e4ac9a', '#cb354d', '#99357b', '#a98bd4', '#79b855', '#5a0cab', '#cf1666', '#1e79f5', '#b59fd3', '#337352', '#aed92a', '#2fd867', '#ea9bc9', '#845530', '#3eba14', '#de378a', '#8094c0', '#08e7a6', '#3bbfae', '#07c91d', '#798be4'];
var color = 0;

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

for (var region of regions) {
    region.color = colors[color++ % colors.length];
    region.rows = [];
    region.deaths = 0;
}

let dataset = [];
fs.createReadStream('./temp/covid-arg.csv')
    .pipe(csv())
    .on('data', (data) => {

        if (data.clasificacion_resumen === 'Descartado' || data.fallecido !== 'SI')
            return;

        dataset.push(data);
    })
    .on('end', () => {
        let groupsByRegion = groupBy(dataset, "residencia_provincia_nombre");

        let limit14 = new Date();
        limit14.setDate(limit14.getDate() - 14);

        for (let regionName of Object.keys(groupsByRegion)) {
            let region = regions.find(r => r.nombre == regionName);
            if (!region) {
                console.error(`no se encontró la región ${regionName}`);
                continue;
            }

            let groupRegion = groupsByRegion[regionName];
            region.deathsTotal = groupRegion.length;
            region.deathsLast14DaysTotal = groupRegion.filter(r => new Date(r.fecha_fallecimiento) >= limit14).length;

            let date = new Date();
            let min = new Date(2020, 01, 01);
            while (date > min) {
                let daily = groupRegion
                    .filter(r => sameDay(new Date(r.fecha_fallecimiento), date));
                region.rows.push(daily.length);

                date.setDate(date.getDate() - 1);
            }
        }

        if (!fs.existsSync(workingFolder)) {
            fs.mkdirSync(workingFolder);
        }

        fs.writeFileSync(path.join(workingFolder, 'ar-total-deaths.json'),
            JSON.stringify(
                regions.map(r =>
                    ({
                        geoId: r.iso_id,
                        name: r.nombre,
                        color: r.color,
                        last14Days: r.deathsLast14DaysTotal,
                        averageLast14Days: r.deathsLast14DaysTotal * 100000 / r.poblacion,
                        total: r.deathsTotal,
                        average: r.deathsTotal * 100000 / r.poblacion,
                        rows: r.rows
                    }))
            )
        );
    });