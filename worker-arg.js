const fs = require('fs'),
    path = require('path');
const StreamZip = require('node-stream-zip');
const csv = require('csv-parser');

let workingFolder = './src/data';

var raw = fs.readFileSync(path.join(__dirname, './regions-ar.json'));
var regions = JSON.parse(raw);
var colors = ['#4dc9f6', '#e4ac9a', '#cb354d', '#99357b', '#a98bd4', '#79b855', '#5a0cab', '#cf1666', '#1e79f5', '#b59fd3', '#337352', '#aed92a', '#2fd867', '#ea9bc9', '#845530', '#3eba14', '#de378a', '#8094c0', '#08e7a6', '#3bbfae', '#07c91d', '#798be4'];
var color = 0;

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

let min = new Date(2020, 0, 1);
let max = new Date();

console.log(`[${Date()}] Inicializando regiones...`);
for (var region of regions) {
    region.color = colors[color++ % colors.length];
    region.casesTotal = 0;
    region.deathsTotal = 0;
    region.deathsLast14DaysTotal = 0;
    region.ttl = 0;

    region.rows = [];
    let date = new Date(min);
    while (date <= max) {
        region.rows.push({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate()), cases: 0, deaths: 0, futureDeaths: 0 });
        date.setDate(date.getDate() + 1);
    }
}

console.log(`[${Date()}] Procesando csv...`);

let limit14 = new Date();
limit14.setDate(limit14.getDate() - 14);

const zip = new StreamZip.async({ file: './temp/covid-arg.zip' });
async function app() {
    const stm = await zip.stream('Covid19Casos.csv');
    stm.pipe(csv())
        .on('data', (data) => {
            if (data.clasificacion_resumen === 'Descartado')
                return;

            let region = regions.find(r => r.nombre == data.carga_provincia_nombre);
            if (!region) {
                console.error(`no se encontró la región ${data.carga_provincia_nombre}`);
                return;
            }

            let fecha_inicio_sintomas = Date(data.fecha_inicio_sintomas + ' GMT-03:00');
            if (isNaN(fecha_inicio_sintomas) || fecha_inicio_sintomas < min)
                fecha_inicio_sintomas = new Date(data.fecha_diagnostico + ' GMT-03:00');
            if (isNaN(fecha_inicio_sintomas)|| fecha_inicio_sintomas < min)
                fecha_inicio_sintomas = new Date(data.fecha_apertura + ' GMT-03:00');

            if (isNaN(fecha_inicio_sintomas)) {
                console.error("no se pudo determinar la fecha: ", data);
                return;
            }else if(fecha_inicio_sintomas < min){
                console.error(`La fecha ${fecha_inicio_sintomas} es anterior a la fecha mínima ${min}`);
                return;
            }

            if (!region.min || region.min > fecha_inicio_sintomas)
                region.min = fecha_inicio_sintomas
            if (!region.max || region.max < fecha_inicio_sintomas)
                region.max = fecha_inicio_sintomas

            region.casesTotal++;

            if (fecha_inicio_sintomas > max) max = fecha_inicio_sintomas;
            if (fecha_inicio_sintomas < min) min = fecha_inicio_sintomas;

            let rowCases = region.rows.find(d => sameDay(d.date, fecha_inicio_sintomas));
            if (rowCases) {
                rowCases.cases++;
            } else {
                console.error("row not found: " + fecha_inicio_sintomas, data)
            }

            if (data.fallecido === 'SI') {
                region.deathsTotal++;

                let fecha_fallecimiento = new Date(data.fecha_fallecimiento + ' GMT-03:00');
                if (fecha_fallecimiento > max) max = fecha_fallecimiento;
                if (fecha_fallecimiento < min) min = fecha_fallecimiento;

                var ttl = daysDiff(fecha_inicio_sintomas, fecha_fallecimiento);
                if (!isNaN(ttl))
                    region.ttl = (region.ttl * (region.deathsTotal - 1) + ttl) / region.deathsTotal;

                let rowDeaths = region.rows.find(d => sameDay(d.date, fecha_fallecimiento));
                if (rowDeaths) {
                    rowDeaths.deaths++;
                } else {
                    console.error("row not found", data);
                }
                let rowFutureDeaths = region.rows.find(d => sameDay(d.date, fecha_inicio_sintomas));
                if (rowFutureDeaths) {
                    rowFutureDeaths.futureDeaths++;
                }

                if (fecha_fallecimiento >= limit14)
                    region.deathsLast14DaysTotal++;
            }
        })
        .on('end', () => {
            for (let region of regions) {
                console.log(`region: ${region.iso_nombre}`);
                for (let index = 1; index < 11; index++) {
                    let row = region.rows[region.rows.length - index];
                    console.log(` - cases: ${row.cases} -  deaths: ${row.deaths}`);
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
            zip.close();
        });

}

app();



