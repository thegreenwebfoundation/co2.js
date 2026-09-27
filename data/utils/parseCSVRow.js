/**
 * Parses one physical line of a comma-separated row.
 * A comma inside double quotes stays in the field. A doubled quote inside a
 * quoted field is one literal quote. A pipe character is data, not a column break.
 * @param {string} currentArrayString - The row to parse. Newlines inside quotes are not joined here; callers still split the file on newline first.
 * @returns {string[]} The fields in that row.
 */

const parseCSVRow = (currentArrayString) => {
  const fields = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < currentArrayString.length; index++) {
    const character = currentArrayString[index];

    if (character === '"') {
      if (inQuotes && currentArrayString[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      fields.push(field);
      field = "";
      continue;
    }

    field += character;
  }

  fields.push(field);
  return fields;
};

module.exports = parseCSVRow;
