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

function daysDiff(d1, d2) {
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
for (var region of regions) {
    region.color = colors[color++ % colors.length];
    region.rows = [];
    region.deaths = 0;
}

let max = new Date(2000, 1, 1);
let min = new Date();

console.log(`[${Date()}] Procesando csv...`);

let dataset = [];
fs.createReadStream('./temp/covid-arg.csv')
    .pipe(csv())
    .on('data', (data) => {

        if (data.clasificacion_resumen === 'Descartado')
            return;

        if (data.fecha_inicio_sintomas) {
            data.fecha_inicio_sintomas = new Date(data.fecha_inicio_sintomas);
            if (data.fecha_inicio_sintomas > max) max = data.fecha_inicio_sintomas;
            if (data.fecha_inicio_sintomas < min) min = data.fecha_inicio_sintomas;
        }

        if (data.fecha_fallecimiento) {
            data.fecha_fallecimiento = new Date(data.fecha_fallecimiento);
            if (data.fecha_fallecimiento > max) max = data.fecha_fallecimiento;
            if (data.fecha_fallecimiento < min) min = data.fecha_fallecimiento;

            data.ttl = daysDiff(data.fecha_inicio_sintomas, data.fecha_fallecimiento);
        }

        dataset.push(data);
    })
    .on('end', () => {
        console.log(`[${Date()}] agrupando resultados...`);

        let groupsByRegion = groupBy(dataset, "carga_provincia_nombre");

        let limit14 = new Date();
        limit14.setDate(limit14.getDate() - 14);

        console.log(`max: ${max}`);
        console.log(`min: ${min}`);

        for (let regionName of Object.keys(groupsByRegion)) {
            let region = regions.find(r => r.nombre == regionName);
            if (!region) {
                console.error(`no se encontró la región ${regionName}`);
                continue;
            }

            console.log(`[${Date()}] calculando resultados para ${regionName}...`);

            let groupRegion = groupsByRegion[regionName];
            let groupRegionDeaths = groupRegion.filter(d => d.fallecido === 'SI');
            region.deathsTotal = groupRegionDeaths.length;
            region.casesTotal = groupRegion.length;
            region.ttl = groupRegionDeaths.reduce((a, c) => a + c.ttl, 0) / groupRegionDeaths.length;
            region.deathsLast14DaysTotal = groupRegionDeaths.reduce((a, c) => a + (c.fecha_fallecimiento >= limit14 ? 1 : 0), 0);

            let date = new Date(max);
            while (date > min) {
                let dailyCases = groupRegion.reduce((a, c) => a + (sameDay(new Date(c.fecha_inicio_sintomas), date) ? 1 : 0), 0);
                let dailyDeaths = groupRegionDeaths.reduce((a, c) => a + (sameDay(new Date(c.fecha_fallecimiento), date) ? 1 : 0), 0);
                let dailyFutureDeaths = groupRegionDeaths.reduce((a, c) => a + (sameDay(new Date(c.fecha_inicio_sintomas), date) ? 1 : 0), 0);

                region.rows.push({
                    date: new Date(date),
                    cases: dailyCases,
                    futureDeaths: dailyFutureDeaths,
                    deaths: dailyDeaths,
                });

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
                        cases: r.casesTotal,
                        casesAverage: r.casesTotal * 100000 / r.poblacion,
                        ttl: r.ttl,
                        rows: r.rows
                    }))
            )
        );
    });