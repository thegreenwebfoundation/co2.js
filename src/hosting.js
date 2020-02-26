'use strict';

const log = require('debug')('tgwf:hosting');
const https = require('https');

const Database = require('better-sqlite3');

function getQ(domains) {
  const q = [];
  for (let domain of domains) {
    q.push('?')
  }
  return q.join(',');
}

function getDatabase(databaseName) {

  if (databaseName) {
    log(`looking for db at ${databaseName}`)
    return new Database(`./data/${databaseName}`, { readonly: true, fileMustExist: true })
  }
  else {
    // keep the name in package.json so its easy just to change
    const DATABASE_NAME = require('../package').database_name;
    log(`looking for db at ${DATABASE_NAME}`)
    return new Database(`./data/${DATABASE_NAME}`, { readonly: true, fileMustExist: true })
  }
}

function check(domain, dbName) {
  let db;

  try {
    db = getDatabase(dbName)
  }
  catch (SqliteError) {
    log(`couldn't find SQlite database at path: ${dbName}`)
  }

  // is it a single domain or an array of them?
  if (typeof domain === 'string') {
    return checkSingleDomain(domain, db)
  }
  else {
    return checkDomains(domain, db)
  }
}

function checkSingleDomain(domain, db) {
  try {
    return checkInDB(domain, db)
  }
  catch {
    return checkAgainstAPI(domain)
  }
}

function checkDomains(domains, db) {
  try {
    return checkDomainsInDB(domains, db)
  }
  catch {
    return checkDomainsAgainstAPI(domains)
  }
}

function checkInDB(domain, db) {

  try {
    const stmt = db.prepare('SELECT * FROM green_presenting WHERE url = ?');
    return !!stmt.get(domain).green;
  } finally {
    if (db) {
      db.close();
    }
  }
}

async function checkAgainstAPI(domain) {
  const res = JSON.parse(
    await getBody(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`
    )
  );
  return res.green
}

async function checkDomainsAgainstAPI(domains) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`
      )
    );

    return greenDomainsFromResults(allGreenCheckResults)

  } catch (e) {
    return [];
  }
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  let greenEntries = entries.filter(function ([key, val]) {
    return val.green;
  });

  return greenEntries.map(function ([key, val]) {
    return val.url;
  });
}

function checkDomainsInDB(domains, db) {

  try {
    const stmt = db.prepare(`SELECT * FROM green_presenting WHERE url in (${getQ(domains)})`);

    res = stmt.all(domains);

    return greenDomainsFromResults(res)

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
async function checkPage(pageXray) {
  const domains = Object.keys(pageXray.domains);

  return checkDomains(domains)

}

module.exports = {
  check,
  checkMulti: checkDomains,
  checkPage,
};
