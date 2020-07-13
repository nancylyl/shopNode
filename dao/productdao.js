const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const indexdao = {
    /* 产品详情 */
    getProductDetail(req, resp) {
        let Id = parseInt(req.query.Id);
        db.connect("select * from S_ProDetails where Id=?", [Id], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data[1][0]; //列表显示条数
                result.success = true; //返回成功
                result.message = "查询成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询失败！"
                resp.send(result)

            }

        });

    },
    /* 产品列表 需要分页 */
    getProductList(req, resp) {
        // getProductDetail(req, resp) {
        let bodydata = req.body;
        let Pro_Name = bodydata.Pro_Name;
        let where = ' where 1=1 ';
        let sql = "select * from S_Product ";
        if (Pro_Name != null) {
            where += ` and Pro_Name like '%' ${Pro_Name}'%'`;
        }
        let newsql = sql + where;
        db.connectPage(newsql, [], 10, 1, (err, data) => {
            result = new Result();
            if (err == null) {
                result.total = data[0][0].count; //返回总数量
                result.data = data[1]; //列表显示条数
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
    getProductListByKey(req, resp) {

        let key = req.query.key;
        let sql = "select Pro_Id,Pro_Name from S_Product where Pro_Name like '%" + key + "%' limit 0,15";
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                result.success = true; //返回成功
                result.message = "查询成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询失败！"
                resp.send(result)

            }

        });
    }

}
module.exports = indexdao;