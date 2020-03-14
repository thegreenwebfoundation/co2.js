"use strict";

const log = require("debug")("tgwf:hostingDatabase");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function getQ(domains) {
  const q = [];
  for (let domain of domains) {
    q.push("?");
  }
  return q.join(",");
}

function getDatabase(databaseFullPathAndName) {
  log(`looking for db at ${databaseFullPathAndName}`);
  return new sqlite3.Database(databaseFullPathAndName, {
    readonly: true
    // fileMustExist: true
  });
}

function check(domain, dbName) {
  let db;

  try {
    db = getDatabase(dbName);
  } catch (SqliteError) {
    log(`couldn't find SQlite database at path: ${dbName}`);
    throw SqliteError;
  }

  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkInDB(domain, db);
  } else {
    return checkDomainsInDB(domain, db);
  }
}

function checkInDB(domain, db) {
  try {
    const stmt = db.get("SELECT * FROM green_presenting WHERE url = ?");
    return !!stmt.get(domain).green;
  } finally {
    if (db) {
      db.close();
    }
  }
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  let greenEntries = entries.filter(function([key, val]) {
    return val.green;
  });

  return greenEntries.map(function([key, val]) {
    return val.url;
  });
}

function checkDomainsInDB(domains, db) {
  try {
    const stmt = db.prepare(
      `SELECT * FROM green_presenting WHERE url in (${getQ(domains)})`
    );

    const res = stmt.all(domains);

    return greenDomainsFromResults(res);
  } finally {
    if (db) {
      db.close();
    }
  }
}
async function dumpDomains(dbName, filePath) {
  let db;

  try {
    db = getDatabase(dbName);
  } catch (SqliteError) {
    log(`couldn't find SQlite database at path: ${dbName}`);
    throw SqliteError;
  }
  const parsingCallBack = async function(err, rows) {
    log(`rows from query: ${rows.length}`);

    const justThedomains = function(row) {
      return row.url;
    };

    return await writeFile(filePath, JSON.stringify(rows.map(justThedomains)));
  };
  const res = await db.all(
    "SELECT url FROM green_presenting;",
    parsingCallBack
  );
  return res;
}

module.exports = {
  check,
  dumpDomains
};
