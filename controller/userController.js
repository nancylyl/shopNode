const session = require("express-session");
const dao = require("../dao/userdao");
// const logger = require("../config/logger");

const userController = {
        getUserInfo(req, resp) {
            dao.getUserInfo(res, resp)
        },
        login(res, resp) {
            dao.login(res, resp)
        },
        register(res, resp) {
            dao.register(res, resp)
        },
        getUserInfo(res, resp) {
            dao.getUserInfo(res, resp)
        }
    }
    //登录

module.exports = userController;