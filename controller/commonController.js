const db = require("../config/dbpoolconfig");
const dao = require("../dao/commondao");
const { getMenu } = require("../dao/commondao");

const commonController = {
    getMenu(res, resp) {
        dao.getMenu(res, resp);
    }
}

module.exports = commonController;