const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const indexdao = {

    /* 产品列表 需要分页 */
    login(req, resp) {

        const Account = req.body.Account;
        const Password = req.body.Password;

        let sql = `SELECT * FROM  s_userinfo WHERE  account='${Account}' AND PASSWORD='${Password}'`
            // console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {

                if (data.length > 0) {
                    result.success = true; //返回成功
                    result.message = "查询成功！" //成功描述
                        //  var userinfo = JSON.parse(JSON.stringify(data));
                        //req.session.userinfo = userinfo[0];
                    resp.send(result)
                } else {
                    result.success = false; //
                    result.message = "查询失败，请检查用户名和密码是否正确" //
                    resp.send(result)
                }


            } else {
                result.success = false;
                result.message = "查询失败！"
                resp.send(result)
            }

        });

    },

    register(req, resp) {
        const Phone = req.body.Phone;
        const Password = req.body.Password;
        let sql = `INSERT INTO s_userinfo (Account,PASSWORD,Phone) VALUES('${Phone}','${Password}','${Phone}')`
        console.log(sql);

        db.connect(sql, [], (err, data) => {
            result = new Result();
            // console.log(err);
            if (err == null) {
                // console.log(data);
                result.success = true; //返回成功
                result.message = "注册成功！" //成功描述
                resp.send(result)


            } else {

                result.success = false;
                result.message = "注册成功！"
                resp.send(result)
            }

        });

    },

    getUserInfo(req, resp) {

        let sql = `SELECT * FROM  s_userinfo WHERE  UId=1`
        console.log(sql);

        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {

                result.success = true; //返回成功
                result.data = data;
                result.message = "查询成功！" //成功描述
                resp.send(result)

            }
        });
    },
    updataUserInfo(req, resp) {
        const Name = req.body.Name;
        const sex = req.body.sex;
        const Birthday = req.body.Birthday;
        const Code = req.body.Code;
        const UId = 1;
        let sql = ` UPDATE  S_UserInfo SET NAME='${Name}' ,sex=${sex} ,Birthday='${Birthday}',CODE='${Code}' WHERE UId=${UId} `
        console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "修改成功" //成功描述
                resp.send(result)
            }
        });
    },
    updataPass(req, resp) {
        const PassWord = req.body.PassWord;
        const UId = 1;
        let sql = ` UPDATE  S_UserInfo SET PassWord='${PassWord}' WHERE UId=${UId} `
        console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "修改成功" //成功描述
                resp.send(result)
            }
        });
    }
}
module.exports = indexdao;