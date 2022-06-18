// nodejs specific implementations of how we do local lookups, and how we make http requests go here

// this is because we can't assume fetch is available

// but we can assume filesystem access and the ability to decompress compressed json files with node's 'fs', 'path', 'zlib' and 'path' APIs

// const path = require("path");
// const fs = require("fs");
// const zlib = require("zlib");
// const { promisify } = require("util");

// this also lets us keep the total library small, and dependencies minimal

