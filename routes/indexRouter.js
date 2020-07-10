const express = require('express');
const session = require("express-session");
const db = require("../config/dbpoolconfig");
const productController = require("../controller/productController");
// const logger = require("../config/logger");
const router = express.Router();
console.log("路由接收成功22----");



//获取首页信息
// router.post("/stu/index.do", indexController.getIndex);
router.get("/getProductDetail.do", productController.getProductDetail);




module.exports = router;