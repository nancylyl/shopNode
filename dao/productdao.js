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
                    where += ` and Pro_Name like '%${KeyName}%'`;
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
            // console.log(sortName);

            if (sortName != '' && sortName != undefined) {
                sql += ` order by ${sortName}  ${orderby}`
            }

            // console.log(sql);
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
        console.log(req.query.state);
        let state = req.query.state;
        let datawhere = '';
        if (state > -1) {
            if (state == 1) {
                state = 12
            }
            datawhere += " and t1.state=" + state + ""

        }
        try {
            state = req.query.state;
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
          WHERE Uid=${UId} ${datawhere}
order by t1.CreateDate desc
          `;

        sql += ` ;  SELECT  ordernum,SUM(price*num ) TotalPrice,State,CreateDate,New_Name FROM s_orderdetail t1
        WHERE Uid=${UId}  ${datawhere}  GROUP BY ordernum,State,CreateDate,New_Name order by CreateDate desc;`
            //  console.log(sql);
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
        let UId = 0;
        try {
            UId = userInfo.data.UId;
        } catch (e) {
            resp.send(userInfo);
        }

        let datas = req.body.data;
        let dkScore = 0;
        let dkMoney = 0;
        try {
            dkScore = req.body.score;
            dkMoney = dkScore / 100;
        } catch (e) {
            console.log(dkScore);
        }
        // console.log(userInfo);
        const data = new Date();
        const lastdate = +data;
        let OrderNum = "BMC" + date.format(data, 'YYYYMMDD').toString() + lastdate.toString();
        let Form_Text = '用户' + userInfo.data.Name + ' 购买商品编号为； 订单编号为：' + OrderNum;
        if (dkScore > 0) {
            Form_Text += " 抵扣积分:" + dkScore + " ;抵扣金额：" + dkMoney + "元";
        }
        let sql = '';
        let totalScore = 0;
        for (let item of datas) {
            try {
                totalScore = parseFloat(item.Score) * parseInt(item.Num);

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
                Content,
                Score
            )
        VALUES
            (
                ${UId},
                '${OrderNum}',
                1,
                '用户购买商品赠送积分：${totalScore} ',
                ${dkScore}
            );

            INSERT INTO shopmanage.s_message 
                (
                UId, 
                Message_Type, 
                Message_Text, 
                State
                )
                VALUES
                (
                    ${UId},
                    2,
                    '用户购买商品赠送积分：${totalScore}',
                    0
                );
    `;

        if (dkScore > 0) {

            sql += `INSERT INTO s_integraldetail 
            (
                UId,
                SourceID,
                SourceTypeID,
                Content,
                Score
            )
        VALUES
            (
                ${UId},
                '${OrderNum}',
                1,
                '购买商品抵扣积分：-${dkScore}分，抵扣金额为:${dkMoney}',
               ${dkScore}
                
            );

            INSERT INTO shopmanage.s_message 
                (
                UId, 
                Message_Type, 
                Message_Text, 
                State
                )
                VALUES
                (
                    ${UId},
                    2,
                    '${Form_Text}',
                    0
                );`
        }
        sql += `    UPDATE s_userinfo SET SumScore=SumScore+${totalScore}-${dkScore} WHERE UId=${UId} ;`
            // console.log(sql);

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
    getProductComment(res, resp) {
        let Pro_Id = res.query.Pro_Id;
        let sql = `
        SELECT distinct t1.*,t3.* FROM S_CommentDetail t1 
        JOIN s_orderdetail t2 ON t2.ordernum=t1.oid
        JOIN s_userinfo t3 ON t3.uid=t2.uid
       WHERE  t1.Pid=${Pro_Id}
 
        `
        let that = this;
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
                result.message = "查询成功" //成功描述
                resp.send(result)
            }
        });
    },




    /*数据库收藏产品*/
    userCollect(req, resp) {
        let UId = req.body.UId;
        let PId = req.body.PId;
        //  console.log(req.body.UId);

        let sql = `insert into s_collect_share_detail (UId,PID) values('${UId}','${PId}')`;
        //  console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

                result.success = true; //返回成功
                result.message = "插入数据成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "插入数据失败！"
                resp.send(result)

            }

        });
    },


    /*获取用户收藏产品ID*/
    myPro(req, resp) {
        console.log(123)
        let UId = req.query.UId;
        //console.log(req.query.UId);

        let sql = `select PId from s_collect_share_detail where UId=${UId}`;
        //  console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

                result.success = true; //返回成功
                result.message = "查询收藏产品ID成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询收藏产品ID失败！"
                resp.send(result)

            }

        });
    },

    /*展示收藏产品的图片路径*/
    proSrc(req, resp) {
        console.log(456)
        let PId = req.query.PId;
        // console.log(req.query.PId);

        let sql = `select Pro_Url,(select Pro_Name from s_product where Pro_Id=${PId}) as Pro_Name,(select Price from s_product where Pro_Id=${PId}) as Price from s_productpic where Pro_Id=${PId} limit 1`;
        //console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

                result.success = true; //返回成功
                result.message = "查询收藏产品图片路径成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询收藏产品图片路径失败！"
                resp.send(result)

            }

        });
    },

    /*删除当前图片的ID*/
    thePicId(req, resp) {

        let Pro_Name = req.body.Pro_Name;
        // console.log(req.query.PId);

        let sql = `select Pro_Id from s_product where Pro_Name='${Pro_Name}'`;
        //   console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

                result.success = true; //返回成功
                result.message = "查询删除收藏产品图片ID成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "查询删除收藏产品图片ID失败！"
                resp.send(result)

            }

        });
    },


    /*删除收藏产品*/
    deletePro(req, resp) {
        console.log(999)
        let PId = req.body.PId;
        let UId = req.body.UId;
        // console.log(req.query.PId);

        let sql = `delete from s_collect_share_detail where PId=${PId} and UId=${UId}`;
        //  console.log(sql);
        db.connect(sql, [], (err, data) => {
            result = new Result();
            if (err == null) {
                result.data = data; //列表显示条数
                // console.log(data);

                result.success = true; //返回成功
                result.message = "删除收藏产品成功！" //成功描述

                resp.send(result)
            } else {
                console.log(err);
                result.message = "删除收藏产品失败！"
                resp.send(result)

            }

        });
    }

}
module.exports = indexdao;