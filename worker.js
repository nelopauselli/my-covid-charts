const fs = require('fs'),
    path = require('path');
const csv = require('csv-parser');

Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

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
        let country = countries.find(c => c.geoId == data.country_code);
        if (!country) {
            country = {
                name: data.country || data.country_code,
                geoId: data.country_code,
                continent: data.continent,
                population: parseInt(data.population),
                rows: [],
                rownum: 0
            };
            countries.push(country);
        }

        if (!country.color) country.color = colors[color++ % colors.length];

        let row = country.rows.find(r => r.year_week === data.year_week);
        if (!row) {
            row = {
                year_week: data.year_week,
                population: parseInt(data.population),
                deaths: 0,
                cases: 0
            };
            country.rows.push(row);
        }

        let weekly_count = parseInt(data.weekly_count);
        if (!isNaN8weekly_count) {
            if (data.indicator === 'deaths')
                row.deaths = weekly_count;
            else if (data.indicator === 'cases')
                row.cases = weekly_count;
            country.rownum++;
        }
    })
    .on('end', () => {
        var currentTime = new Date();
        var fecha7 = new Date((new Date()).setDate(currentTime.getDate() - 7));
        var fecha14 = new Date((new Date()).setDate(currentTime.getDate() - 14));
        let weeks = [
            currentTime.getWeekYear() + "-" + currentTime.getWeek(),
            fecha7.getWeekYear() + "-" + fecha7.getWeek(),
            fecha14.getWeekYear() + "-" + fecha14.getWeek(),
        ]


        for (let country of countries) {
            country.deathsTotal = 0;
            country.deathsLast14DaysTotal = 0;
            country.deathsSumPerDay = [];
            country.deathsAbsPerDay = [];
            country.casesTotal = 0;
            country.casesLast14DaysTotal = 0;
            country.casesSumPerDay = [];
            country.casesAbsPerDay = [];

            let index = 0;
            for (let row of country.rows) {
                let deaths = row.deaths;
                country.deathsTotal += deaths;
                let cases = row.cases;
                country.casesTotal += cases;

                if (weeks.includes(row.year_week)) {
                    country.deathsLast14DaysTotal += deaths;
                    country.casesLast14DaysTotal += cases;
                }
                if (country.deathsTotal > 0) {
                    country.deathsSumPerDay.push(country.deathsTotal);
                    country.deathsAbsPerDay.push(deaths);
                }
                if (country.casesTotal > 0) {
                    country.casesSumPerDay.push(country.casesTotal);
                    country.casesAbsPerDay.push(cases);
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
                })).concat(continents)
            )
        );

        fs.writeFileSync(path.join(workingFolder, 'total-cases.json'),
            JSON.stringify(
                countries.map(c =>
                ({
                    geoId: c.geoId,
                    name: c.name,
                    color: c.color,
                    averageLast14Days: c.casesLast14DaysTotal * 100000 / c.population,
                    total: c.casesTotal,
                    average: c.casesTotal * 100000 / c.population
                })).concat(continents)
            )
        );

        for (let country of countries) {
            fs.writeFileSync(path.join(workingFolder, `./accumulated-daily-deaths-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.deathsSumPerDay));
            fs.writeFileSync(path.join(workingFolder, `./accumulated-daily-cases-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.casesSumPerDay));
            fs.writeFileSync(path.join(workingFolder, `./daily-deaths-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.deathsAbsPerDay));
            fs.writeFileSync(path.join(workingFolder, `./daily-cases-${country.geoId.toLowerCase()}.json`), JSON.stringify(country.casesAbsPerDay));
        }

        fs.writeFileSync(path.join(workingFolder, `./total-deaths-per-continent.json`),
            JSON.stringify(continents)
        );
    });