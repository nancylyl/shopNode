const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const session = require("express-session");
const commondao = {

    getUserSession(req, resp) {
        const userInfo = req.session.userInfo;
        // console.log(userInfo);
        result = new Result();
        if (userInfo != null) {
            result.data = userInfo;
            return result;
        } else {

            result.success = false;
            result.message = "您还没有登录，请先登录！"
            console.log(result);
            resp.send(result)
        }


    },
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
    },
    //银行卡信息
    getPayBy(req, resp) {
        db.connect(" SELECT * FROM S_PayBy ", [], (err, data) => {
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