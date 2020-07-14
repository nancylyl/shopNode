const express = require('express');
const session = require("express-session");
const db = require("../config/dbpoolconfig");
const productController = require("../controller/productController");
const commonController = require("../controller/commonController");
const indexController = require("../controller/indexController");
const userController = require("../controller/userController");



// const logger = require("../config/logger");
const router = express.Router();
console.log("路由接收成功22----");

//首页
router.get("/getIndex.do", indexController.getIndex)



//获取首页信息
// router.post("/stu/index.do", indexController.getIndex);
router.get("/getProductDetail.do", productController.getProductDetail);
router.post("/getProductList.do", productController.getProductList);
router.get("/getProductListByKey.do", productController.getProductListByKey);
router.get("/getHotProduct.do", productController.getHotProduct)



//菜单栏信息
router.get("/getMenu.do", commonController.getMenu);


//用户
router.post('/login.do', userController.login)
router.post('/register.do', userController.register)
router.get('/getUserInfo.do', userController.getUserInfo)
router.get('/updataUserInfo.do', userController.updataUserInfo)
router.get('/updataPass.do', userController.updataPass)

module.exports = router;