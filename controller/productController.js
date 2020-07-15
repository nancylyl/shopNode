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
    },
    //根据关键字获取产品信息
    getProductListByKey(res, resp) {
        dao.getProductListByKey(res, resp)
    },
    getHotProduct(res, resp) {
        dao.getHotProduct(res, resp);
    },
    getMyOder(res, resp) {
        dao.getMyOder(res, resp);
    },
    addOrder(res, resp) {
        dao.addOrder(res, resp);
    },
    updateOrderState(res, resp) {
        dao.updateOrderState(res, resp);
    }

}
module.exports = userController;