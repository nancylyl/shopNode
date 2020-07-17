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
    },



    /*收藏产品*/
    collect(req,resp){
        dao.userCollect(req,resp);
    },

    /*获取用户收藏产品的ID*/
    myPro(req,resp){
        dao.myPro(req,resp);
    },

    /*展示收藏产品的图片路径*/
    proSrc(req,resp){
        dao.proSrc(req,resp);
    },

    /*删除收藏产品的ID*/
    thePicId(req,resp){
        dao.thePicId(req,resp);
    },


    /*删除收藏产品*/
    deletePro(req,resp){
        dao.deletePro(req,resp);
    }

}
module.exports = userController;