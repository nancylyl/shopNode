const db = require("../config/dbpoolconfig");
const Result = require("../config/ActionResult");
const indexdao = {
    /* 产品详情 */
    getProductDetail(req, resp) {

        let Pro_Id = parseInt(req.query.Pro_Id);
        console.log(req.query,Pro_Id);

        let sql = `SELECT t1.*,t2.pro_data FROM s_product t1 JOIN  
        S_ProDetails t2 ON t1.pro_id=t2.Pro_Id
        WHERE t1.pro_id=${Pro_Id};
        
        
        SELECT t1.*,t2.Url FROM S_CommentDetail t1 
        LEFT JOIN S_CommentImage t2 ON t1.CId=t2.CId
        WHERE t1.Pid=${Pro_Id};;`;
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
    /* 产品列表 需要分页 */
    getProductList: function(req, resp) {
        {
            // getProductDetail(req, resp) {
            let bodydata = req.body;
            // console.log(this);

            let Sort = req.Sort;
            let PageCount = bodydata.PageCount;
            let CurrentPage = bodydata.CurrentPage;
            let KeyName = bodydata.Key;
            let P_Type_Menu_Id = bodydata.P_Type_Menu_Id; //产品类型
            let Prod_Type_Id = bodydata.Prod_Type_Id; //尺寸 尺寸：卧室用品 0 无1 .2.0米 2.1.8米 3.1.5米4. 1.2米
            let Prod_Dec_Type = bodydata.Prod_Dec_Type; //所属标题分类类型 如果是卧室用品 类型 0.无1.纯色2.磨毛3.条纹.4.印花5.绣花0 纯色1 格子2条纹3印花
            let Root_Type_Id = bodydata.Root_Type_Id; //根数：1.240根2.300根3.350根4.600根5.枕头6..床单被罩枕巾单品7.靠垫/靠垫套  0为无

            let where = ' where 1=1 ';
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
                if (P_Type_Menu_Id != undefined && P_Type_Menu_Id > 0) {
                    where += ` and P_Type_Menu_Id=${P_Type_Menu_Id}`;
                }

            } catch (error) {

            }


            sql = sql + where;
            if (Sort == 1 || Sort == 2) {
                sql += ' order by CreateDate desc'
            } else if (Sort == 3) {
                sql += ' order by Price  asc'
            } else if (Sort == 4) {
                sql += ' order by Price  desc'
            }
            // console.log(sql);
            let nowdata = [];
            const that = this;
            db.connectPage(sql, [], PageCount, CurrentPage, async(err, data) => {
                result = new Result();
                if (err == null) {
                    result.total = data[0][0].count; //返回总数量
                    nowdata = data[1];
                    //查询产品对应的图片
                    for (var i = 0; i < nowdata.length; i++) {
                        let item = nowdata[i];
                        const returnMess = await that.getImages(item.Pro_Id);
                        nowdata[i].children = returnMess.data;
                    }
                    // console.log(nowdata)
                    result.data = nowdata; //列表显示条数
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
    },
    /* 热销商品 */
    getHotProduct(req, resp) {
        let sql = `SELECT  * FROM (
            SELECT DISTINCT t1.Pro_Id,t1.Pro_Name,t1.Price,t2.Pro_Url,(t1.Pro_SumCount-t1.Pro_NewCount)counts 
            
            FROM S_Product  t1 
            
            JOIN (
            
            SELECT Pro_Url,Pro_Id FROM  S_ProductPic  WHERE id IN(
            SELECT MIN(id) id FROM S_ProductPic WHERE TYPE=2 GROUP BY
            pro_id )
            ) t2 ON t1.Pro_Id=t2.Pro_Id 
            ORDER BY  counts DESC  ) t1 LIMIT 0,10
               
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


    }

}
module.exports = indexdao;