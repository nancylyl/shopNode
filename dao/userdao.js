const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const session = require("express-session");
const com = require('./commondao');
const indexdao = {

    /* 产品列表 需要分页 */
    login(req, resp) {

        const Account = req.body.Account;
        const PassWord = req.body.PassWord;

        let sql = `SELECT * FROM  s_userinfo WHERE  account='${Account}' AND PASSWORD='${PassWord}'`
        console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {

                if (data.length > 0) {

                    result.success = true; //返回成功
                    result.message = "查询成功！" //成功描述
                        //    var userinfo = JSON.parse(JSON.stringify(data));
                        //  req.session.userinfo = userinfo[0];
                        //  result.data = userinfo[0];
                    req.session.userInfo = data[0];
                    //console.log(data[0]);
                    // console.log(JSON.stringify(data, null, 2));

                    result.data = data[0];
                    resp.send(result);
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
    exitLogin(req, resp) {
        result = new Result();
        req.session.destroy(function(err) {
            if (err == null) {
                result.success = true; //
            }
            // console.log('exitlogin');
        })
        result.message = "操作成功" //
        resp.send(result)
    },
    register: async function(req, resp) {

        const Phone = req.body.Phone;

        const Password = req.body.PassWord;
        let sql = `INSERT INTO s_userinfo (Account,PASSWORD,Phone) VALUES('${Phone}','${Password}','${Phone}');`

        // const PassWord = req.body.PassWord;
        result = new Result();

        let userinfo = await this.IsExitName(Phone);
        userinfo = JSON.parse(JSON.stringify(userinfo));

        if (userinfo[0].count > 0) {

            result.success = false;
            result.message = "该用户已存在"
            resp.send(result);
            return
        }

        // let sql = `INSERT INTO s_userinfo (Account,PASSWORD,Phone) VALUES('${Phone}','${PassWord}','${Phone}')`

        // console.log(sql);
        db.connect(sql, [], (err, data) => {

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
    /* 是否存在该用户 */
    IsExitName(Account) {
        return new Promise((resolve, reject) => {
            let sql = ` select count(*)count from s_userinfo where Account='${Account}'`;
            db.connect(sql, [], (err, data) => {
                resolve(data);
                return
            })
        })
    },
    getUserInfo(req, resp) {

        let userInfo = com.getUserSession(req, resp);
        if (userInfo == null) {
            return;
        }
        let UId = userInfo.data.UId;
        let sql = `SELECT * FROM  s_userinfo WHERE  UId=${UId}`
            // console.log(sql);

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
        const Sex = req.body.Sex;
        const a = req.body.Birthday;
        const Code = req.body.Code;

        let Birthday = a.substring(0, 10);
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` UPDATE  S_UserInfo SET NAME='${Name}' ,Sex=${Sex} ,Birthday='${Birthday}',CODE='${Code}' WHERE UId=${UId} `
            //   console.log(sql);
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
    newPhone(req, resp) {
        const Phone = req.body.Phone;
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` UPDATE  s_userinfo SET Phone='${Phone}' WHERE UId=${UId} `
            //  console.log(sql)
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = "修改成功" //成功描述
                resp.send(result)
            }
        });
    },
    updataPass(req, resp) {
        const PassWord = req.body.PassWord;
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` UPDATE  S_UserInfo SET PassWord='${PassWord}' WHERE UId=${UId} `
            //  console.log(sql);
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
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = `
        

SELECT /*t1.Pid,*/t1.OId,t3.pro_url,t2.pro_name,t2.price,t1.Star,t1.Content,
date_format(t1.CreateDate, '%y%m%d %h:%i:%s')
FROM S_CommentDetail t1
JOIN S_Product t2 ON t1.PId= t2.Pro_Id
 LEFT JOIN 
 (
   SELECT * FROM S_ProductPic WHERE id IN(
        SELECT MIN(id) FROM S_ProductPic WHERE TYPE=3 GROUP BY Pro_Id
    )
 )t3 ON t3.Pro_Id=t2.Pro_Id
 
 JOIN  S_OrderDetail t4 ON  t4.OrderNum=t1.OId WHERE t4.UId=${UId}
 order by t1.CreateDate desc
          `

        db.connect(sql, [], async(err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                //查询产品对应的图片
                // for (var i = 0; i < data.length; i++) {
                //     let item = data[i];
                //     const returnMess = await that.getCommentImages(item.CId);
                //     data[i].children = returnMess.data;
                // }
                result.data = data;
                result.message = "查询用户评论成功" //成功描述
                resp.send(result)
            } else {
                result.message = "查询用户评论失败" //成功描述
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

    //发票信息
    getUserINV(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` SELECT * FROM S_UserInfo  WHERE UId=${UId} `
            //console.log(sql)
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







    //修改用户发票信息
    updataUserINV(req, resp) {
        const InvoiceType = req.body.InvoiceType;
        const Inv_Content = req.body.Inv_Content;
        const InvContentTypef = req.body.InvContentTypef;
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` UPDATE  S_UserInfo SET InvoiceType='${InvoiceType}' ,Inv_Content='${Inv_Content}' ,InvContentTypef='${InvContentTypef}'  WHERE UId=${UId} `

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
        let userInfo = com.getUserSession(req, resp);
        result = new Result();
        if (userInfo == null) {
            result.message = "您还没有登录" //成功描述
            resp.send(result)
        }
        let UId = userInfo.data.UId;
        let sql = ` SELECT *,
    CASE Message_Type WHEN 1  THEN '活动通知' WHEN  2 THEN '优惠券发放' WHEN 3  THEN '积分变动' ELSE '其它' END Message
    FROM S_Message  WHERE UId=${UId} order by Message_Time desc `
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
    //我的消息列表
    deleteMyMessage(req, resp) {
        let message_Id = req.query.message_Id;
        // console.log(req);
        let sql = ` delete FROM S_Message  WHERE Message_Id=${message_Id} `
            //console.log(sql);
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
    // //我的有货信息
    // getMyAddress(req, resp) {
    //     let userInfo = com.getUserSession(req, resp);
    //     let UId = userInfo.data.UId;
    //     let sql = ` SELECT * FROM S_Address  WHERE UId=${UId} `
    //         //  console.log(sql);
    //     db.connect(sql, [], (err, data) => {
    //         result = new Result();
    //         if (err == null) {
    //             result.success = true; //返回成功
    //             result.data = data;
    //             result.message = "" //成功描述
    //             resp.send(result)
    //         }
    //     });
    // },



    //我的收获地址
    getMyAddress(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let sql = ` SELECT * FROM s_address WHERE  UId=${UId} `;
        //  console.log(sql)
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                result.data = data;
                result.message = ""; //成功描述
                resp.send(result)
            }
        });
    },
    //新增收获地址
    addMyAddress(req, resp) {
        const S_Name = req.body.S_Name;
        const Province = req.body.Province;
        //  console.log(Province);
        const City = req.body.City;
        //  console.log(typeof City)
        const Area = req.body.Area;
        const Address = req.body.Address;
        const Mail = req.body.Mail;
        const Phone = req.body.Phone;
        const Tel = req.body.Tel;
        const Is_True = req.body.Is_True;
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        // console.log(req.body)
        let sql = '';
        if (Is_True) {
            sql = ` update s_address set Is_True=0 where UId=${UId};`;
        }

        sql += `INSERT INTO s_address (UId,S_Name,Province,City,Area,Address,Mail,Phone,Tel,Is_True) VALUES(${UId},'${S_Name}','${Province}','${City}','${Area}','${Address}','${Mail}','${Phone}','${Tel}',${Is_True})`;
        console.log(sql);
        db.connect(sql, [], (err, data) => {

            result = new Result();
            if (err != null) {

                result.success = true; //返回成功
                // result.data = data;
                result.message = ""; //成功描述
                resp.send(result)
            }
        });
    },
    //修改收获地址
    updateMyAddress(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        const S_Name = req.body.S_Name;
        const Province = req.body.Province;
        const City = req.body.City;
        const Area = req.body.Area;
        const Address = req.body.Address;
        const Mail = req.body.Mail;
        const Phone = req.body.Phone;
        const Tel = req.body.Tel;
        const Is_True = req.body.Is_True;
        const Id = req.body.Id;

        let sql = '';
        if (Is_True == 1) {
            sql = `update s_address set Is_True=0 where UId=${UId};`;
        }
        sql += ` update s_address set
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
                    `

        console.log(sql);
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
        let Id = req.body.Id;
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
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
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
    },
    /* 填写评论*/
    addComment(req, resp) {
        let { OrderNum, Star, Content } = req.body;
        let sql = `INSERT INTO shopmanage.s_commentdetail 
        (
        PId, 
        OId, 
        Star, 
        Content
        )
        VALUES
        (
            0,
       '${OrderNum}',
       ${Star},
       '${Content}'
        ); `;
        sql += `  UPDATE S_OrderDetail SET State=5 WHERE OrderNum='${OrderNum}' `;
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                // result.data = data; //列表显示条数
                result.success = true; //返回成功
                result.message = "评论成功" //成功描述

                resp.send(result)
            } else {
                //console.log(err);
                result.message = "查询失败！"
                resp.send(result)

            }

        });

    },


    //我的积分
    getMyIntegralDetail(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        result = new Result();
        if (userInfo == null) {
            result.message = "您还没有登录" //成功描述
            resp.send(result)
        }
        let UId = userInfo.data.UId;
        let sql = ` SELECT *,
CASE SourceTypeID WHEN 1  THEN '购买产品' WHEN  2 THEN '评论' WHEN 3  THEN '注册' ELSE '其它' END Message
FROM S_IntegralDetail  WHERE UId=${UId} order by CreateDate desc `
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
    /*个人中心--我的评论*/
    getUserComment(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        console.log(UId);
        let sql = `
        


        SELECT  DISTINCT t1.OId,Star,Content,date_format(t1.CreateDate, '%Y-%m-%d %H:%i:%s') CreateDate   FROM S_CommentDetail t1
        JOIN S_OrderDetail t2 ON t1.OId=t2.OrderNum
       WHERE t2.UId=${UId}
       ORDER BY CreateDate desc
 
          `
        console.log(sql);

        /*SELECT  DISTINCT t1.OId,Star,Content,t1.createdate FROM S_CommentDetail t1
        JOIN S_OrderDetail t2 ON t1.OId=t2.ordernum
       WHERE t2.UId=${UId} order by t1.CreateDate desc `*/


        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.success = true; //返回成功
                //查询产品对应的图片
                /*for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    const returnMess = await that.getCommentImages(item.CId);
                    data[i].children = returnMess.data;
                }*/
                result.data = data;
                result.message = "查询用户评论成功" //成功描述
                resp.send(result)
            } else {
                result.message = "查询用户评论失败" //成功描述
                resp.send(result)
            }
        });
    }
}
module.exports = indexdao;