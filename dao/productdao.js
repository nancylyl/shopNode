const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
var date = require("silly-datetime");
const session = require("express-session");
const com = require('./commondao');
const indexdao = {

    /* 产品详情 */
    getProductDetail(req, resp) {

        let Pro_Id = parseInt(req.query.Pro_Id);
        //console.log(req.query,Pro_Id);

        let sql = `SELECT t1.*,t2.pro_data FROM s_product t1 JOIN  
        S_ProDetails t2 ON t1.pro_id=t2.Pro_Id
        WHERE t1.pro_id=${Pro_Id};
       SELECT * FROM S_ProductPic WHERE Pro_Id=${Pro_Id};
        SELECT t1.*,t2.Url FROM S_CommentDetail t1 
        LEFT JOIN S_CommentImage t2 ON t1.CId=t2.CId
        WHERE t1.Pid=${Pro_Id};`;
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

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
    getProductList: function(req, resp) {
        {
            // getProductDetail(req, resp) {
            let bodydata = req.body;
            // console.log(this);

            let orderby = bodydata.orderby;
            let sortName = bodydata.sortName;
            let PageCount = bodydata.PageCount;
            let CurrentPage = bodydata.CurrentPage;
            let KeyName = bodydata.key;

            let P_Type_Menu_Id = bodydata.P_Type_Menu_Id; //产品类型
            let Prod_Type_Id = bodydata.size; //尺寸 尺寸：卧室用品 0 无1 .2.0米 2.1.8米 3.1.5米4. 1.2米
            let Prod_Dec_Type = bodydata.type; //所属标题分类类型 如果是卧室用品 类型 0.无1.纯色2.磨毛3.条纹.4.印花5.绣花0 纯色1 格子2条纹3印花
            let Root_Type_Id = bodydata.root; //根数：1.240根2.300根3.350根4.600根5.枕头6..床单被罩枕巾单品7.靠垫/靠垫套  0为无

            let where = ' where 1=1 ';
            // console.log(P_Type_Menu_Id);
            let typeObj = [];
            try {
                typeObj = P_Type_Menu_Id.split('_');
            } catch {}
            //  console.log(typeObj);
            // if (typeObj.length != 1) {
            //     P_Type_Menu_Id = typeObj[0]
            // }

            let sql = "select * from S_Product ";
            //  console.log(KeyName);
            try {


                if (KeyName != undefined && KeyName != null && KeyName != '') {
                    where += ` and Pro_Name='${KeyName}'`;
                }
            } catch {}

            try {
                if (Prod_Type_Id != undefined && Prod_Type_Id > 0) {
                    where += ` and Prod_Type_Id=${Prod_Type_Id}`;
                }
            } catch (error) {

            }
            try {
                if (Prod_Dec_Type != undefined && Prod_Dec_Type > 0) {
                    where += ` and Prod_Dec_Type=${Prod_Dec_Type}`;
                }
            } catch (error) {

            }
            try {
                if (Root_Type_Id != undefined && Root_Type_Id > 0) {
                    where += ` and Root_Type_Id=${Root_Type_Id}`;
                }

            } catch (error) {

            }
            try {
                if (P_Type_Menu_Id != '' && P_Type_Menu_Id != undefined) {
                    //     where += ` and (        =${P_Type_Menu_Id} or P_Type_Menu_ParentId =${P_Type_Menu_Id}) `;
                    where += ` and P_Type_Menu_ParentId =${typeObj[0]} `;
                    // if (typeObj.length == 1) {
                    //     where += ` and P_Type_Menu_ParentId =${typeObj[0]} `;
                    // } else if (typeObj.length == 2) {
                    //     where += ` and ( P_Type_Menu_Id in( select P_Type_Menu_Id from  S_Product_Type_Menu where ParentId=${typeObj[1]} or P_Type_Menu_Id=${typeObj[0]}) `;
                    // } else if (typeObj.length == 3) {
                    //     where += ` and P_Type_Menu_Id=${typeObj[2]} `;
                    // }
                }

            } catch (error) {

            }

            sql = sql + where;
            console.log(sortName);

            if (sortName != '' && sortName != undefined) {
                sql += ` order by ${sortName}  ${orderby}`
            }

            console.log(sql);
            let nowdata = [];
            const that = this;
            db.connectPage(sql, [], PageCount, CurrentPage, async(err, data) => {
                result = new Result();
                if (err == null) {
                    let totalSize = Math.ceil(parseInt(data[0][0].count) / PageCount)

                    nowdata = data[1];
                    //查询产品对应的图片
                    for (var i = 0; i < nowdata.length; i++) {
                        let item = nowdata[i];
                        const returnMess = await that.getImages(item.Pro_Id);
                        nowdata[i].children = returnMess.data;
                    }
                    console.log(result.total);
                    result.data = nowdata; //列表显示条数
                    result.success = true; //返回成功
                    result.total = totalSize; //返回总数量
                    result.message = "查询成功！" //成功描述
                        // console.log(result);

                    resp.send(result)

                } else {
                    result.success = false;
                    result.message = "查询失败！"
                    resp.send(result)
                }

            });
        }
    },
    getImages: function(Pro_Id) {

        let imagesql = "SELECT * FROM s_productpic  where Pro_ID=" + Pro_Id;
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

    //根据关键字查询15条产品信息
    getProductListByKey(req, resp) {
        let key = req.query.key;
        let sql = "select Pro_Id value,Pro_Name label from S_Product where Pro_Name like '%" + key + "%' limit 0,15";
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
    },
    /* 热销商品 */
    getHotProduct(req, resp) {
        let sql = `SELECT  * FROM (
            SELECT DISTINCT t1.Pro_Id,t1.Pro_Name,t1.Price,t2.Pro_Url,(t1.Pro_SumCount-t1.Pro_NewCount)counts 
            FROM S_Product  t1 
            JOIN (
            SELECT Pro_Url,Pro_Id FROM  S_ProductPic  WHERE id IN(
            SELECT MIN(id) id FROM S_ProductPic WHERE TYPE=3 GROUP BY
            pro_id )
            ) t2 ON t1.Pro_Id=t2.Pro_Id   WHERE t1.Tag_Type=2
            ORDER BY  counts DESC  )a
                `;

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


    },
    /* 我的订单 */
    getMyOder(req, resp) {
        //console.log(UId);
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let state = 0;
        try {
            state = req.query.State;
        } catch {}
        let sql = `
        SELECT '新用户' userTypeName,NAME,
        (SELECT IFNULL(SUM(IFNULL(Num,0)*IFNULL(Price,0) ),0)  FROM s_orderdetail WHERE UId=t1.UId) totalMoney
         FROM S_UserInfo t1 WHERE t1.UId=${UId};
         
         SELECT  t1.*,t2.Pro_Url,t3.Pro_Name FROM s_orderdetail t1
         JOIN 
         (
         SELECT * FROM S_ProductPic WHERE id IN(
         SELECT MIN(id) FROM S_ProductPic WHERE TYPE=3 GROUP BY Pro_Id
         )
         ) 
         t2 ON t1.PId=t2.Pro_Id
         JOIN S_Product t3 ON t3.Pro_Id=t2.Pro_Id
          WHERE Uid=${UId} ;

          SELECT DISTINCT ordernum,SUM(price*num ) TotalPrice,State,CreateDate,New_Name FROM s_orderdetail
          WHERE Uid=${UId} ;
          
          `;
        if (state > 0) {
            sql += " and t1.state=" + state + ""
        }
        //console.log(sql);
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

    },

    /* 用户下单 */
    addOrder(req, resp) {
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let datas = req.body.data;
        //  console.log(datas);
        const data = new Date();
        const lastdate = +data;
        let OrderNum = "BMC" + date.format(data, 'YYYYMMDD').toString() + lastdate.toString();
        let Form_Text = '用户' + UserName + ' 购买商品编号为； 订单编号为：' + OrderNum;
        let sql = '';
        let totalScore = 0;
        for (let item of datas) {
            try {
                totalScore = parseFloat(item.Score) * parseInt(item.Num);
                // console.log(totalScore);

            } catch (e) {
                console.log(e);
            }

            sql += `INSERT INTO s_orderdetail 
            (
            OrderNum, 
            UId, 
            PId, 
            Price, 
            Num, 
            Is_Invoic, 
            Invoic_Type, 
            IS_Coupon, 
            Coupon_Id, 
            Is_Gift, 
            Gift_Id, 
            Send_Type, 
            Pay_Type_Id, 
            Address_ID, 
            New_Name, 
            New_Province, 
            New_City, 
            New_Area, 
            New_Address, 
            New_Mail, 
            New_Phone, 
            New_Tel, 
            Deltime, 
            Form_Text,  
            State
            )
            VALUES
            (
            '${OrderNum}', 
            ${UId},
            ${item.PId},
            ${item.Price}, 
            ${item.Num},
            ${item.Is_Invoic},
            ${item.Invoic_Type}, 
            ${item.IS_Coupon}, 
            ${item.Coupon_Id},
            ${item.Is_Gift},
            ${item.Gift_Id},
            ${item.Send_Type},
            ${item.Pay_Type_Id}, 
            ${item.Address_ID}, 
            '${item.New_Name}',
            '${item.New_Province}',
            '${item.New_City}',
            '${item.New_Area}',
            '${item.New_Address}',
            '${item.New_Mail}',
            '${item.New_Phone}',
            '${item.New_Tel}',
             ${item.Deltime},
            '${Form_Text}',
            0
            );
        UPDATE 	S_Product SET Pro_NewCount=Pro_NewCount-1 WHERE Pro_Id=${item.PId}; `;
        }
        sql += ` INSERT INTO s_integraldetail 
            (
                UId,
                SourceID,
                SourceTypeID,
                Content
            )
        VALUES
            (
                ${UId},
                '${OrderNum}',
                1,
                '用户购买商品赠送积分：${totalScore} '
            );
        UPDATE s_userinfo SET SumScore=SumScore+${totalScore} WHERE UId=${UId} ;`;

        //  console.log(sql);

        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                //   result.data = data; //列表显示条数
                result.success = true; //返回成功
                result.message = "添加成功" //成功描述


                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询失败！"
                resp.send(result)

            }

        });

    },

    /* 修改等待状态 */
    updateOrderState(req, resp) {
        //console.log(UId);
        let userInfo = com.getUserSession(req, resp);
        let UId = userInfo.data.UId;
        let state = req.query.state;
        let orderNum = req.query.orderNum;
        let sql = '';
        if (state == 1) {
            sql = `UPDATE  s_userinfo SET SumScore=SumScore+(
                SELECT  t2.Score FROM s_orderdetail t1 
                JOIN s_product t2 ON t2.Pro_Id=t1.PId
                WHERE t1.OrderNum='${orderNum}')
                WHERE UId=${UId} ; `;
        }
        sql += ` UPDATE s_orderdetail SET state=${state} WHERE OrderNum='${orderNum}' `;
        //console.log(sql);

        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                //  result.data = data; //列表显示条数
                result.success = true; //返回成功
                result.message = "操作成功" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询失败！"
                resp.send(result)

            }

        });

    },

    //产品评论
    getProductComment(req, resp) {
        let Pro_Id = res.query.Pro_Id;
        let sql = `
        SELECT t1.*,t3.* FROM S_CommentDetail t1 
        JOIN s_orderdetail t2 ON t2.ordernum=t1.oid
        JOIN s_userinfo t3 ON t3.uid=t2.uid
       WHERE  t2.Pid=${Pro_Id}
 
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

}
module.exports = indexdao;