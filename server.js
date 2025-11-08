const express = require("express");
const cors = require("cors");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const contactsRouter = require("./app/routes/contact.route");
app.use("/api/contacts", contactsRouter);

// --- Route test handler để kiểm tra Postman ---
app.post("/api/test", (req, res) => {
  console.log("📩 Nhận dữ liệu từ client:", req.body);
  res.json({
    message: "chào mừng bạn đến với chúng tôi!",
    data: req.body
  });
});


// Middleware 404
app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

// Middleware lỗi chung
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});

// Khởi động server
async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("✅ Kết nối MongoDB thành công!");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Lỗi kết nối MongoDB:", error);
    process.exit();
  }
}

startServer();