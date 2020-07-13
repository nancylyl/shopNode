const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const indexdao = {

    /* 产品列表 需要分页 */
    getIndex(req, resp) {

        let sql = `SELECT * FROM s_banner;
        SELECT * FROM s_productpic WHERE isshowindex=1;`

        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {

                result.data = [data[0], data[1]]; //列表显示条数
                result.success = true; //返回成功
                result.message = "查询成功！" //成功描述
                resp.send(result)

            } else {
                result.success = false;
                result.message = "查询失败！"
                resp.send(result)
            }

        });

    },

}
module.exports = indexdao;