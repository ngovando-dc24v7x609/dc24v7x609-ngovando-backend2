const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const contactsRouter = require("./app/routes/contact.route");
app.use("/api/contacts", contactsRouter);

// Middleware xử lý khi route không tồn tại (404)
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// 👉 Đoạn này đặt ở cuối file
const config = require("./app/config");

const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});