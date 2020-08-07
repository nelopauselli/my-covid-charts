const fs = require('fs');
const csv = require('csv-parser');

var countries = [
    { name: 'Argentina', geoId: 'AR' },
    { name: 'Brazil', geoId: 'BR' },
    { name: 'Chile', geoId: 'CL' },
    { name: 'Ecuador', geoId: 'EC' },
    { name: 'Colombia', geoId: 'CO' },
    { name: 'Uruguay', geoId: 'UY' },
    { name: 'Perú', geoId: 'PE' },
    { name: 'Bolivia', geoId: 'BO' },
    { name: 'Paraguay', geoId: 'PY' },
    { name: 'Estados Unidos', geoId: 'US' },
    { name: 'Irlanda', geoId: 'IE' },
    { name: 'Suecia', geoId: 'SE' },
    { name: 'España', geoId: 'ES' },
    { name: 'Alemania', geoId: 'DE' },
    { name: 'Italia', geoId: 'IT' },
    { name: 'Francia', geoId: 'FR' },
    { name: 'Rusia', geoId: 'RU' },
    { name: 'China', geoId: 'CN' },
    { name: 'Korea del Sur', geoId: 'KR' },
];

for (let country of countries) {
    country.rows = [];
}

fs.createReadStream('./data/covid.csv')
    .pipe(csv())
    .on('data', (data) => {
        let country = countries.find(c => c.geoId == data.geoId);
        if (country && (country.rows.length > 0 || data.deaths > 0)) {
            country.rows.push(data);
        }
    })
    .on('end', () => {
        for (let country of countries) {
            country.rows.reverse();

            country.deathsTotal = 0;
            country.deathsSumPerDay = [];
            country.deathsAbsPerDay = [];
            for (let row of country.rows) {
                let deaths = parseInt(row.deaths);
                country.deathsTotal += deaths;
                country.deathsSumPerDay.push(country.deathsTotal);
                country.deathsAbsPerDay += deaths;
            }

            console.log(`${country.name}: ${country.deathsTotal}`);
        }

    });