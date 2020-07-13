const db = require("../config/dbpoolconfig");
const dao = require("../dao/indexdao");
const indexController = {
    getIndex(res, resp) {
        dao.getIndex(res, resp)
    }
}
module.exports = indexController;