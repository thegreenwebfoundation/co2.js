import { getApiRequestHeaders } from "../src/helpers/index.js";
const https = jest.createMockFromModule("https");
import { Stream } from "stream";

const stream = new Stream();

https.get.mockImplementation((url, options, callback) => {
  url, { headers: getApiRequestHeaders("TestRunner") }, callback(stream);
  if (url.includes("greencheckmulti")) {
    stream.emit(
      "data",
      Buffer.from(
        `{"google.com": {"url":"google.com","hosted_by":"Google Inc.","hosted_by_website":"https://www.google.com","partner":null,"green":true}}`
      )
    );
  } else {
    stream.emit(
      "data",
      Buffer.from(
        `{"url":"google.com","hosted_by":"Google Inc.","hosted_by_website":"https://www.google.com","partner":null,"green":true}`
      )
    );
  }

  stream.emit("end");
});

module.exports = https;
