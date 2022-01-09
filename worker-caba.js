const fs = require('fs'),
    path = require('path');
const csv = require('csv-parser');

let workingFolder = './src/data';

var raw = fs.readFileSync(path.join(__dirname, './regions-caba.json'));
var regions = JSON.parse(raw);
var colors = ['#4dc9f6', '#e4ac9a', '#cb354d', '#99357b', '#a98bd4', '#79b855', '#5a0cab', '#cf1666', '#1e79f5', '#b59fd3', '#337352', '#aed92a', '#2fd867', '#ea9bc9', '#845530', '#3eba14', '#de378a', '#8094c0', '#08e7a6', '#3bbfae', '#07c91d', '#798be4'];
var color = 0;

function getMonthFromName(monthName){
    if (monthName == "DEC") return 12;
    if (monthName == "NOV") return 11;
    if (monthName == "OCT") return 10;
    if (monthName == "SEP") return 9;
    if (monthName == "AUG") return 8;
    if (monthName == "JUL") return 7;
    if (monthName == "JUN") return 6;
    if (monthName == "MAY") return 5;
    if (monthName == "APR") return 4;
    if (monthName == "MAR") return 3;
    if (monthName == "FEB") return 2;
    if (monthName == "JAN") return 1;
    if (monthName == "") return 0;

    console.error(`mes desconocido ${monthName}`);
    return 0;
}
function CabaToDate(value){
    var day = parseInt(value.substring(0, 2));
    var monthName = value.substring(2, 5);
    var month = getMonthFromName(monthName);
    var year = parseInt(value.substring(5, 9));
    return new Date(year, month - 1, day);
}

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

fs.createReadStream('./temp/covid-caba.csv')
    .pipe(csv())
    .on('data', (data) => {

        if (data.clasificacion === 'descartado' || data.clasificacion === 'sospechoso')
            return;

        let region = regions.find(r => r.provincia == data.provincia && r.nombre == data.barrio);
        if (!region) {
            console.error(`no se encontró el barrio '${data.barrio}' de la provincia '${data.provincia}'`);
            return;
        }

        let fecha_inicio_sintomas = CabaToDate(data.fecha_toma_muestra);
        region.casesTotal++;

        if (fecha_inicio_sintomas > max) max = fecha_inicio_sintomas;
        if (fecha_inicio_sintomas < min) min = fecha_inicio_sintomas;

        let rowCases = region.rows.find(d => sameDay(d.date, fecha_inicio_sintomas));
        if (rowCases) {
            rowCases.cases++;
        }

        if (data.fallecido === 'si') {
            region.deathsTotal++;

            let fecha_fallecimiento = new CabaToDate(data.fecha_fallecimiento);
            if (fecha_fallecimiento > max) max = fecha_fallecimiento;
            if (fecha_fallecimiento < min) min = fecha_fallecimiento;

            var ttl = daysDiff(fecha_inicio_sintomas, fecha_fallecimiento);
            if (!isNaN(ttl))
                region.ttl = (region.ttl * (region.deathsTotal - 1) + ttl) / region.deathsTotal;

            let rowDeaths = region.rows.find(d => sameDay(d.date, fecha_fallecimiento));
            if (rowDeaths) {
                rowDeaths.deaths++;
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
        console.log(`max: ${max}`);
        console.log(`min: ${min}`);

        if (!fs.existsSync(workingFolder)) {
            fs.mkdirSync(workingFolder);
        }

        fs.writeFileSync(path.join(workingFolder, 'caba-total-deaths.json'),
            JSON.stringify(
                regions.map(r =>
                    ({
                        geoId: r.iso_id,
                        parent: r.provincia,
                        name: r.nombre ? r.nombre : r.provincia,
                        color: r.color,
                        last14Days: r.deathsLast14DaysTotal,
                        averageLast14Days: r.deathsLast14DaysTotal,
                        total: r.deathsTotal,
                        average: r.deathsTotal,
                        cases: r.casesTotal,
                        casesAverage: r.casesTotal,
                        ttl: r.ttl,
                        rows: r.rows
                    }))
            )
        );
    });