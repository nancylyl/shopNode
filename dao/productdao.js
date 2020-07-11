const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const indexdao = {
    /* 产品详情 */
    // getProductDetail(req, resp) {
    //     let Id = parseInt(req.query.Id);
    //     db.connect("select * from S_ProDetails where Id=?", [Id], (err, data) => {
    //         result = new Result();
    //         if (err == null) {
    //             result.list = data[1][0]; //列表显示条数
    //             result.success = true; //返回成功
    //             result.message = "查询成功！" //成功描述
    //             resp.send(result)
    //         } else {
    //             console.log(err);
    //             result.message = "查询失败！"
    //             resp.send(result)

    //         }

    //     });

    // },
    /* 产品列表 需要分页 */
    // getProductList(req, resp) {
    getProductDetail(req, resp) {
        let bodydata = req.body;
        let Pro_Name = bodydata.Pro_Name;
        let sql = "select * from S_ProDetails where 1=1 ";
        if (Pro_Name != "") {
            where += ` and Pro_Name like '%' ${Pro_Name}'%'`;
        }
        console.log(sql);
        db.connectPage(sql + where, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.total = data[0][0].count; //返回总数量
                result.list = data[1][0]; //列表显示条数
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