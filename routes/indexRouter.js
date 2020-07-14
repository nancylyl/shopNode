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



//获取产品相关
// router.post("/stu/index.do", indexController.getIndex);
router.get("/getProductDetail.do", productController.getProductDetail);
router.post("/getProductList.do", productController.getProductList);
router.get("/getProductListByKey.do", productController.getProductListByKey);
router.get("/getHotProduct.do", productController.getHotProduct)
router.get("/getMyOder.do", productController.getMyOder)



//菜单栏信息
router.get("/getMenu.do", commonController.getMenu);
router.get("/getPayBy.do", commonController.getPayBy);




//用户
router.post('/login.do', userController.login)
router.post('/register.do', userController.register)
router.get('/getUserInfo.do', userController.getUserInfo)
router.get('/updataUserInfo.do', userController.updataUserInfo)
router.get('/updataPass.do', userController.updataPass)
router.get('/getComment.do', userController.getComment) //用户评论
router.get('/updataUserINV.do', userController.updataUserINV) //用户评论
router.get('/getMyMessage.do', userController.getMyMessage) //我的消息列表


module.exports = router;