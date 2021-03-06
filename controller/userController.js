const session = require("express-session");
const dao = require("../dao/userdao");
// const logger = require("../config/logger");

const userController = {
        login(res, resp) {
            dao.login(res, resp)
        },
        exitLogin(res, resp) {
            dao.exitLogin(res, resp)
        },
        register(res, resp) {
            dao.register(res, resp)
        },
        getUserInfo(res, resp) {
            dao.getUserInfo(res, resp)
        },
        updataUserInfo(res, resp) {
            dao.updataUserInfo(res, resp);
        },
        updataPass(res, resp) {
            dao.updataPass(res, resp);
        },
        getUserComment(res, resp) {
            dao.getUserComment(res, resp);
        },
        updataUserINV(res, resp) {
            dao.updataUserINV(res, resp);
        },
        getMyMessage(res, resp) {
            dao.getMyMessage(res, resp);
        },
        getMyAddress(res, resp) {
            dao.getMyAddress(res, resp);
        },
        addMyAddress(res, resp) {
            dao.addMyAddress(res, resp);

        },
        updateMyAddress(res, resp) {
            dao.updateMyAddress(res, resp);
        },
        delMyAddress(res, resp) {
            dao.delMyAddress(res, resp);

        },
        addOrUpdatePayWay(res, resp) {
            dao.addOrUpdatePayWay(res, resp);
        },
        getPayWay(res, resp) {
            dao.getPayWay(res, resp);
        },
        addOrder(res, resp) {
            dao.addOrder(res, resp);
        },

        addComment(res, resp) {
            dao.addComment(res, resp)
        },
        newPhone(req, resp) {
            dao.newPhone(req, resp);
        },
        getUserINV(res, resp) {
            dao.getUserINV(res, resp)
        },
        deleteMyMessage(req, resp) {
            dao.deleteMyMessage(req, resp)
        },
        getMyIntegralDetail(req, resp) {
            dao.getMyIntegralDetail(req, resp)
        }

    }
    //登录

module.exports = userController;