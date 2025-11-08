const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

// 🟢 Tạo mới một contact
exports.create = async (req, res, next) => {
  console.log("📩 Body nhận được:", req.body); // Thêm dòng này để debug
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên không được để trống"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log("❌ Lỗi khi tạo contact:", error);
    return next(
      new ApiError(500, "Đã xảy ra lỗi trong quá trình tạo contact")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;

    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
     return res.send(documents);
  } catch (error)

  {
    return next(new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách contacts"));
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Không tìm thấy contact"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy contact"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống" });
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const updated = await contactService.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).send({ message: "Không tìm thấy contact để cập nhật" });
    }

    return res.send({ message: "Cập nhật contact thành công", updated });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);
    return res.status(500).send({ message: "Lỗi khi cập nhật contact" });
  }
};


exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deleted = await contactService.delete(req.params.id);
    if (!deleted) return next(new ApiError(404, "Không tìm thấy contact"));
    return res.send({ message: "Contact được xóa thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa contact"));
  }
};


exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({ message: `${deletedCount} contacts đã bị xóa.` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả contacts"));
  }
};


exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách yêu thích"));
  }
};
