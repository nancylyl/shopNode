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
    getProductList: function(req, resp) {
        {
            // getProductDetail(req, resp) {
            let bodydata = req.body;
            console.log(bodydata);

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
            console.log(KeyName);
            try {
                console.log(KeyName);

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

            db.connectPage(sql, [], PageCount, CurrentPage, (err, data) => {
                result = new Result();
                if (err == null) {
                    result.total = data[0][0].count; //返回总数量

                    //查询产品对应的图片
                    let newdata = data[1].forEach((item, index) => {
                        let imagesql = "SELECT * FROM s_productpic  where Pro_ID=" + item.Pro_Id;
                        // console.log(imagesql);
                        data[1][index].children = [];
                        const imagedata = this.getImages(item.Pro_Id).then();
                        console.log(imagedata);
                        data[1].children = imagedata
                    })


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
        }
    },
    getImages: function(Pro_Id) {

        let imagesql = "SELECT * FROM s_productpic  where Pro_ID=" + Pro_Id;
        result = new Result();
        return new Promise((resolve, reject) => {
            db.connect(imagesql, [], (err, data) => {
                if (err == null) {
                    result.success = true;
                    result.data = data;

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
    }

}
module.exports = indexdao;