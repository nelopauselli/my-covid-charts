const fs = require('fs');
const csv = require('csv-parser');

var countries = JSON.parse(fs.readFileSync('./data/countries.json'));

for (let country of countries) {
    country.rows = [];
}

fs.createReadStream('./temp/covid.csv')
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
                if (country.deathsTotal > 0) {
                    country.deathsSumPerDay.push(country.deathsTotal);
                    country.deathsAbsPerDay.push(deaths);
                }
            }

            var json = { geoId: country.geoId, total: country.deathsTotal, deathsSumPerDay: country.deathsSumPerDay };
            console.log(json);
        }

        fs.writeFileSync(`./data/muertos.json`, JSON.stringify(countries.map(c => ({ geoId: c.geoId, total: c.deathsTotal }))));
        for (let country of countries) {
            fs.writeFileSync(`./data/${country.geoId}-muertos-acumulado-diario.json`, JSON.stringify(country.deathsSumPerDay));
            fs.writeFileSync(`./data/${country.geoId}-muertos-diarios.json`, JSON.stringify(country.deathsAbsPerDay));
        }

    });