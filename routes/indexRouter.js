const express = require('express');
const session = require("express-session");
const db = require("../config/dbpoolconfig");
const productController = require("../controller/productController");
const commonController = require("../controller/commonController");
const indexController = require("../controller/indexController");



// const logger = require("../config/logger");
const router = express.Router();
console.log("路由接收成功22----");

//首页
router.get("/getIndex.do", indexController.getIndex)



//获取首页信息
// router.post("/stu/index.do", indexController.getIndex);
router.get("/getProductDetail.do", productController.getProductDetail);
router.get("/getProductList.do", productController.getProductList);
router.get("/getProductListByKey.do", productController.getProductListByKey);



//菜单栏信息
router.get("/getMenu.do", commonController.getMenu);


module.exports = router;