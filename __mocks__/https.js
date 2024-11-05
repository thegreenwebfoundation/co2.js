import { vi } from "vitest";
import { getApiRequestHeaders } from "../src/helpers/index.js";
import { Stream } from "stream";

const https = vi.mock("https");

const stream = new Stream();

https.get.mockImplementation((url, options, callback) => {
  url, { headers: getApiRequestHeaders("TestRunner") }, callback(stream);
  if (url.includes("greencheckmulti")) {
    stream.emit(
      "data",
      Buffer.from(
        `{"google.com": {"url":"google.com","hosted_by":"Google Inc.","hosted_by_website":"https://www.google.com","partner":null,"green":true}, "pchome.com": {"url":"pchome.com","green":false} }`,
      ),
    );
  } else {
    stream.emit(
      "data",
      Buffer.from(
        `{"url":"google.com","hosted_by":"Google Inc.","hosted_by_website":"https://www.google.com","partner":null,"green":true}`,
      ),
    );
  }

  stream.emit("end");
});

export default https;
