const { MongoClient } = require("mongodb");

class MongoDB {
  static async connect(uri) {
    if (this.client) return this.client; // Nếu đã kết nối rồi thì dùng lại
    this.client = await MongoClient.connect(uri); // Tạo kết nối mới
    return this.client;
  }
}

module.exports = MongoDB;