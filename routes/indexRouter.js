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
router.get("/getIndex.do", indexController.getIndex) //首页信息
    //获取产品相关
    // router.post("/stu/index.do", indexController.getIndex);
router.get("/getProductDetail.do", productController.getProductDetail); //产品详情
router.post("/getProductList.do", productController.getProductList); //产品列表
router.get("/getProductListByKey.do", productController.getProductListByKey); //根据关键字搜索
router.get("/getHotProduct.do", productController.getHotProduct) //热销商品
router.get("/getMyOder.do", productController.getMyOder) //我的订单
router.post("/addOrder.do", productController.addOrder) //我的订单
router.get("/updateOrderState.do", productController.updateOrderState) //修改订单状态
router.get("/getProductComment.do", productController.getProductComment) //产品评论



//菜单栏信息
router.get("/getMenu.do", commonController.getMenu); //我的菜单信息
router.get("/getPayBy.do", commonController.getPayBy); //银行卡信息

//用户
router.post('/login.do', userController.login) //用户登录
router.post('/register.do', userController.register) //注册信息
router.get('/getUserInfo.do', userController.getUserInfo) //获取用户信息
router.post('/updataUserInfo.do', userController.updataUserInfo) //修改用户信息
router.post('/updataPass.do', userController.updataPass) //修改用户密码
router.post('/getComment.do', userController.getComment) //用户评论
router.post('/updataUserINV.do', userController.updataUserINV) //用户评论
router.get('/getMyMessage.do', userController.getMyMessage) //用户消息信息
router.get('/getMyAddress.do', userController.getMyAddress) //我的收获地址
router.post('/addMyAddress.do', userController.addMyAddress) //添加我的收获地址
router.post('/UpdateMyAddress.do', userController.updateMyAddress) //修改我的地址
router.post('/delMyAddress.do', userController.delMyAddress) //删除我的地址
router.get('/getPayWay.do', userController.getPayWay) //得到付款方式
router.post('/addOrUpdatePayWay.do', userController.addOrUpdatePayWay) //修改，添加付款方式







/*收藏产品*/
router.post('/collect.do',productController.collect);

/*展示收藏产品*/
router.get('/myCollect.do',productController.myPro)

/*展示收藏图片的路径*/
router.get('/proSrc.do',productController.proSrc)

/*展示收藏图片的名称和价格*/
// router.get('/proPriceTitle.do',productController.proPriceTitle)

/*删除收藏产品的ID*/
router.get('/theProId.do',productController.thePicId)

/*删除收藏产品*/
router.post('/deletePro.do',productController.deletePro)




module.exports = router;