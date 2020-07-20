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
router.get("/api/getIndex.do", indexController.getIndex) //首页信息
    //获取产品相关
    // router.post("/api/stu/index.do", indexController.getIndex);
router.get("/api/getProductDetail.do", productController.getProductDetail); //产品详情
router.post("/api/getProductList.do", productController.getProductList); //产品列表
router.get("/api/getProductListByKey.do", productController.getProductListByKey); //根据关键字搜索
router.get("/api/getHotProduct.do", productController.getHotProduct) //热销商品
router.get("/api/getMyOder.do", productController.getMyOder) //我的订单
router.post("/api/addOrder.do", productController.addOrder) //我的订单
router.get("/api/updateOrderState.do", productController.updateOrderState) //修改订单状态
router.get("/api/getProductComment.do", productController.getProductComment) //产品评论



//菜单栏信息
router.get("/api/getMenu.do", commonController.getMenu); //我的菜单信息
router.get("/api/getPayBy.do", commonController.getPayBy); //银行卡信息

//用户
router.post('/api/login.do', userController.login) //用户登录
router.get('/api/exitLogin.do', userController.exitLogin) //退etUserInfo出登录
router.post('/api/register.do', userController.register) //注册信息
router.get('/api/getUserInfo.do', userController.getUserInfo) //获取用户信息
router.post('/api/updataUserInfo.do', userController.updataUserInfo) //修改用户信息
router.post('/api/updataPhoe.do', userController.newPhone); //修改用户电话
router.post('/api/updataPass.do', userController.updataPass) //修改用户密码
    // router.post('/api/getComment.do', userController.getComment) //用户评论
router.post('/api/updataUserINV.do', userController.updataUserINV) //发票信息修改
router.get('/api/getUserINV.do', userController.getUserINV) //发票信息
router.get('/api/getComment.do', userController.getUserComment) //用户评论
router.post('/api/updataUserINV.do', userController.updataUserINV) //用户评论
router.get('/api/getMyMessage.do', userController.getMyMessage) //用户消息信息
router.get('/api/getMyAddress.do', userController.getMyAddress) //我的收获地址
router.post('/api/addMyAddress.do', userController.addMyAddress) //添加我的收获地址
router.post('/api/UpdateMyAddress.do', userController.updateMyAddress) //修改我的地址
router.post('/api/delMyAddress.do', userController.delMyAddress) //删除我的地址
router.get('/api/getPayWay.do', userController.getPayWay) //得到付款方式
router.post('/api/addOrUpdatePayWay.do', userController.addOrUpdatePayWay) //修改，添加付款方式
router.post('/api/addComment.do', userController.addComment)
router.get('/api/deleteMyMessage.do', userController.deleteMyMessage) //删除我的消息

/*收藏产品*/
router.post('/api/collect.do', productController.collect);

/*展示收藏产品*/
router.get('/api/myCollect.do', productController.myPro)

/*展示收藏图片的路径*/
router.get('/api/proSrc.do', productController.proSrc)

/*展示收藏图片的名称和价格*/
// router.get('/api/proPriceTitle.do',productController.proPriceTitle)

/*删除收藏产品的ID*/
// router.get('/api/theProId.do', productController.thePicId)

/*删除收藏产品*/
router.post('/api/deletePro.do', productController.deletePro)




module.exports = router;