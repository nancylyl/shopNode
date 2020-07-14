const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");

const commondao = {
    getMenu(req, resp) {
        db.connect("SELECT P_Type_Menu_ID AS id ,pname name,parentid pid,sort,url FROM s_product_type_menu WHERE state=0; ", [], (err, data) => {
            result = new Result();
            //console.log(data);
            if (err == null) {
                result.data = data; //列表显示条数
                result.success = true; //返回成功
                result.message = "查询成功！" //成功描述

                resp.send(result)

            } else {
                result.success = false;
                result.message = "查询失败！"
                resp.send(result)
            }

        });
    }

}
module.exports = commondao;