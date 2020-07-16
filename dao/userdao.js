const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const session = require("express-session");
const { userinfo = null } = session;
const UId = 1 //userinfo.UId;
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
                    var userinfo = JSON.parse(JSON.stringify(data));
                    req.session.userinfo = userinfo[0];
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


        let sql = `SELECT * FROM  s_userinfo WHERE  UId=${UId}`
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
    },
    //我的评论
    getComment(req, resp) {

        let sql = `
        

SELECT t1.*,t2.pro_name,pro_title,t2.price,t3.pro_url FROM S_CommentDetail t1
JOIN S_Product t2 ON t1.PId= t2.Pro_Id
 LEFT JOIN 
 (
   SELECT * FROM S_ProductPic WHERE id IN(
        SELECT MIN(id) FROM S_ProductPic WHERE TYPE=3 GROUP BY Pro_Id
    )
 )t3 ON t3.Pro_Id=t2.Pro_Id
 
 JOIN  S_OrderDetail t4 ON  t4.ID=t1.OId WHERE t4.UId=${UId}
 
          `
        db.connect(sql, [], async(err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                //查询产品对应的图片
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    const returnMess = await that.getCommentImages(item.CId);
                    data[i].children = returnMess.data;
                }
                result.data = data;
                result.message = "查询成功" //成功描述
                resp.send(result)
            }
        });
    },
    getCommentImages: function(CId) {

        let imagesql = "SELECT * FROM S_CommentImage  where CId=" + CId;
        result = new Result();
        return new Promise((resolve, reject) => {
            db.connect(imagesql, [], (err, data) => {
                if (err == null) {
                    result.success = true;
                    result.data = JSON.parse(JSON.stringify(data));
                    resolve(result);
                    return
                }
                resolve(voildresultResult.message = err)
            })
        })

    },
    //修改用户发票信息
    updataUserINV(req, resp) {
        const InvoiceType = req.body.InvoiceType;
        const Inv_Content = req.body.Inv_Content;
        let sql = ` UPDATE  S_UserInfo SET InvoiceType='${InvoiceType}' ,Inv_Content=${Inv_Content}  WHERE UId=${UId} `
            // console.log(sql);
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
    //我的消息列表
    getMyMessage(req, resp) {

        let sql = ` SELECT *,
    CASE Message_Type WHEN 1  THEN '活动通知' WHEN  2 THEN '优惠券发放' WHEN 3  THEN '积分变动' ELSE '其它' END Message
    FROM S_Message  WHERE UId=${UId} `
            //  console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //我的有货信息
    getMyMessage(req, resp) {

        let sql = ` SELECT * FROM S_Address  WHERE UId=${UId} `
            //  console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //我的收获地址
    getMyAddress(req, resp) {

        let sql = ` SELECT * FROM s_address WHERE  UId=${UId} `
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //新增收获地址
    addMyAddress(req, resp) {
        const S_Name = req.body.S_Name;
        const Province = req.body.Province;
        const City = req.body.City;
        const Area = req.body.Area;
        const Address = req.body.Address;
        const Mail = req.body.Mail;
        const Phone = req.body.Phone;
        const Tel = req.body.Tel;
        const Is_True = req.body.Is_True;
        let sql;
        if (Is_True) {
            sql += `update s_address set Is_True=0 where UId=${UId};`;
        }
        sql += ` INSERT INTO s_address 
                        (
                        UId, 
                        S_Name, 
                        Province, 
                        City, 
                        AREA, 
                        Address, 
                        Mail, 
                        Phone, 
                        Tel, 
                        Is_True
                        )
                        VALUES
                        (
                        ${UId}, 
                        ${S_Name}, 
                        ${Province}, 
                        ${City}, 
                        ${Area}, 
                        ${Address}, 
                        ${Mail}, 
                        ${Phone}, 
                        ${Tel}, 
                        ${Is_True}
                        ); `

        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //修改收获地址
    updateMyAddress(req, resp) {

        const S_Name = req.body.S_Name;
        const Province = req.body.Province;
        const City = req.body.City;
        const Area = req.body.Area;
        const Address = req.body.Address;
        const Mail = req.body.Mail;
        const Phone = req.body.Phone;
        const Tel = req.body.Tel;
        const Is_True = req.body.Is_True;
        const Id = req.query.Id;
        let sql;
        if (Is_True) {
            sql += `update s_address set Is_True=0 where UId=${UId};`;
        }
        sql += ` update s_address 
                    S_Name= '${S_Name}', 
                    Province= '${Province}', 
                    City='${City}', 
                    AREA= '${Area}', 
                    Address= '${Address}', 
                    Mail='${Mail}', 
                    Phone= '${Phone}', 
                    Tel= '${Tel}', 
                    Is_True=  ${Is_True}
                    where Id= ${Id}
                    ); `
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //删除我的地址
    delMyAddress(req, resp) {

        let Id = req.query.Id;
        let sql = ` delete from  s_address WHERE  Id=${Id}`
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //查询用户付款方式
    getPayWay(req, rep) {
        // let Id = req.query.Id;
        let sql = ` select * from S_User_PayWay WHERE  UId=${UId}`
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = "" //成功描述
                resp.send(result)
            }
        });
    },
    //修改或者新增
    addOrUpdatePayWay(req, rep) {
        let P_Id = req.body.P_Id;
        let Send_Type = req.body.Send_Type;
        let Pay_Type_Id = req.body.Pay_Type_Id;
        let sql;
        if (P_Id == 0) {
            sql = `
            INSERT INTO s_user_payway 
                (
                Send_Type, 
                Pay_Type_Id, 
                UId
                )
                VALUES
                (
                ${Send_Type}, 
                ${Pay_Type_Id}, 
                ${P_Id}, 
                ); `
        } else {
            sql = ` update s_user_payway set Send_Type= ${Send_Type},Pay_Type_Id=${Pay_Type_Id} where P_Id=${P_Id}  `
        }
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                // result.data = data;
                result.message = "" //成功描述
                resp.send(result);
            }
        });
    }

}
module.exports = indexdao;