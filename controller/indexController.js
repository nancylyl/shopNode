const db = require("../config/dbpoolconfig");
const dao = require("../dao/indexdao");
// const result = require("../config/ActionResult")();
const indexController = {

    getIndex(req, resp) {
        console.log("接收路的任务index");
    }
}
module.exports = indexController;