const fs = require('fs'),
    path = require('path');
const csv = require('csv-parser');

let workingFolder = './src/data';

var countries = [];

var colors = ['#4dc9f6', '#e4ac9a', '#cb354d', '#99357b', '#a98bd4', '#79b855', '#5a0cab', '#cf1666', '#1e79f5', '#b59fd3', '#337352', '#aed92a', '#2fd867', '#ea9bc9', '#845530', '#3eba14', '#de378a', '#8094c0', '#08e7a6', '#3bbfae', '#07c91d', '#798be4'];
var color = 0;

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

fs.createReadStream('./temp/covid.csv')
    .pipe(csv())
    .on('data', (data) => {
        let country = countries.find(c => c.geoId == data.geoId);
        if (!country) {
            country = {
                name: data.countriesAndTerritories.split('_').join(' '),
                geoId: data.geoId,
                continent: data.continentExp,
                population: parseInt(data.popData2019),
                rows: [],
            };
            countries.push(country);
        }

        if (country.rows || data.deaths > 0) {
            if (!country.color) country.color = colors[color++ % colors.length];

            country.population = parseInt(data.popData2019);
            country.rows.push(data);
        }
    })
    .on('end', () => {
        for (let country of countries) {
            country.deathsTotal = 0;
            country.deathsLast14DaysTotal = 0;
            country.deathsSumPerDay = [];
            country.deathsAbsPerDay = [];

            let index = 0;
            for (let row of country.rows) {
                let deaths = parseInt(row.deaths);
                country.deathsTotal += deaths;
                if (index < 14) country.deathsLast14DaysTotal += deaths;

                if (country.deathsTotal > 0) {
                    country.deathsSumPerDay.push(country.deathsTotal);
                    country.deathsAbsPerDay.push(deaths);
                }

                index++;
            }
        }

        groups = groupBy(countries, "continent");

        let continents = [];
        for (continentName of Object.keys(groups)) {
            let current = groups[continentName];

            let continent = {
                geoId: continentName,
                name: continentName + ' average',
                color: '#0f0f0f',
                population: current.reduce((p, c) => p + c.population, 0),
                total: current.reduce((p, c) => p + c.deathsTotal, 0),
                deathsLast14DaysTotal: current.reduce((p, c) => p + c.deathsLast14DaysTotal, 0),
            };
            continent.average = continent.total * 100000 / continent.population;
            continent.averageLast14Days = continent.deathsLast14DaysTotal * 100000 / continent.population;

            continents.push(continent);
        };

        if (!fs.existsSync(workingFolder)) {
            fs.mkdirSync(workingFolder);
        }

        fs.writeFileSync(path.join(workingFolder, 'total-deaths.json'),
            JSON.stringify(
                countries.map(c =>
                    ({
                        geoId: c.geoId,
                        name: c.name,
                        color: c.color,
                        averageLast14Days: c.deathsLast14DaysTotal * 100000 / c.population,
                        total: c.deathsTotal,
                        average: c.deathsTotal * 100000 / c.population
                    }))
                    .concat(continents)
            )
        );

        for (let country of countries) {
            fs.writeFileSync(path.join(workingFolder, `./accumulated-daily-deaths-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.deathsSumPerDay));
            fs.writeFileSync(path.join(workingFolder, `./daily-deaths-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.deathsAbsPerDay));
        }

        fs.writeFileSync(path.join(workingFolder, `./total-deaths-per-continent.json`),
            JSON.stringify(continents)
        );
    });