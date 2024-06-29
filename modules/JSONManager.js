const fs = require("fs");

// JSON 편하게 불러오고 저장
class JSONManager {
  constructor(filename) {
    this.filename = filename;
  }

  get() {
    try {
      const data = fs.readFileSync(this.filename, "utf8");
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (err) {
      console.error(err);
    }
  }

  set(jsonData) {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync(this.filename, jsonString, "utf8");
    } catch (err) {
      console.error(err);
    }
  }

  check() {
    try {
      if (!fs.existsSync(this.filename)) {
        fs.writeFileSync(this.filename, JSON.stringify({}, null, 2), "utf8");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
exports.JSONManager = JSONManager;
