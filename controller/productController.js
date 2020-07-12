const session = require("express-session");
const db = require("../config/dbpoolconfig");
const dao = require("../dao/productdao");
// const logger = require("../config/logger");
const userController = {
    getProductDetail(res, resp) {
        dao.getProductDetail(res, resp);

    },
    getProductList(res, resp) {
        dao.getProductList(res, resp)
    }
}
module.exports = userController;