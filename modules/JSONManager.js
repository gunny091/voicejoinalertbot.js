import fs from "fs";

export class JSONManager {
  constructor(filename) {
    this.filename = filename;
  }

  get() {
    try {
      const data = fs.readFileSync(this.filename, "utf8");
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (err) {
      throw err;
    }
  }

  set(jsonData) {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync(this.filename, jsonString, "utf8");
    } catch (err) {
      throw err;
    }
  }
}
