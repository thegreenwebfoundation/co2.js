'use strict';

const log = require('intel').getLogger('sitespeedio.plugin.sustainable');
const https = require('https');

const Database = require('better-sqlite3');
// keep the name in package.json so its easy just to chanfe
const DATABASE_NAME = require('../package').database_name;

console.log(DATABASE_NAME)

function getQ(domains) {
  const q = [];
  for (let domain of domains) {
    q.push('?')
  }
  return q.join(',');
}

function getDatabase() {
  // try {
  return new Database(`./data/${DATABASE_NAME}`, { readonly: true, fileMustExist: true })
  // } catch (SqliteError) {
  // return false
  // }
}

function check(domain) {
  const db = getDatabase();




  if (db) {
    try {
      const stmt = db.prepare('SELECT * FROM green_presenting WHERE url = ?');
      return [stmt.get(domain).url];


    } finally {
      if (db) {
        db.close();
      }
    }
  }
  // fall back to using the API
  return checkDomains([domain])
}
async function checkDomains(domains) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`
      )
    );

    const entries = Object.entries(allGreenCheckResults);
    // TODO find the preferred way for assigning vars
    // when making key value pairs , but only using the val

    /* eslint-disable-next-line */
    let greenEntries = entries.filter(function ([key, val]) {
      return val.green;
    });
    /* eslint-disable-next-line */
    return greenEntries.map(function ([key, val]) {
      return val.url;
    });
  } catch (e) {
    return [];
  }
}

function getDomains(domains) {
  const db = getDatabase();
  try {
    const stmt = db.prepare(`SELECT * FROM green_presenting WHERE url in (${getQ(domains)})`);
    return stmt.all(domains);
  } finally {
    if (db) {
      db.close();
    }
  }
}

async function getBody(url) {
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    const req = https.get(url, function (res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        log.error(
          'Could not get info from the Green Web Foundation API, %s for %s',
          res.statusCode,
          url
        );
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      const data = [];

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });
    req.end();
  });
}
async function greenDomainsForPage(pageXray) {
  const domains = Object.keys(pageXray.domains);

  return checkDomains(domains)

}

module.exports = {
  greenDomainsForPage,
  check
};
