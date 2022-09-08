/**
 * Parses a string from a comma separated CSV file and returns an array of values.
 * @param {string} currentArrayString - The string to parse.
 * @returns {array} - Returns an array of values.
 */

const parseCSVRow = (currentArrayString) => {
	let string = "";
	let quoteFlag = 0;
	// Iterate over the current array element and generate a string
	for (let character of currentArrayString) {
  
	  // The next set of if statements helps setup the current array element to be split by columns (comma delimited)
		  // However, some textual cells may contain commas, so we need to check for those and ignore them.
		  // We do this by looking for textual cells that are enclosed in double quotes, and setting the quoteFlag to 1 when we encounter one.
	  if (character === '"' && quoteFlag === 0) {
		quoteFlag = 1;
	  } else if (character === '"' && quoteFlag == 1) {
		quoteFlag = 0;
	  }
  
	  // If we encounter a comma, and the quoteFlag is 0, then we know that we have reached the end of a column. We replace the comma with a pipe character to help us split the string later.
	  if (character === "," && quoteFlag === 0) character = "|";
	  if (character !== '"') string += character;
	}
	return string.split("|");
  }

module.exports = parseCSVRow;