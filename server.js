const express = require('express');
//const logger = require('morgan'); //日志
var cookieParser = require('cookie-parser');
const session = require("express-session");
const favicon = require("serve-favicon"); //小图标
const bodyParser = require("body-parser"); //引入处理post数据的模块
const route = require("./routes/indexRouter") //引入自己的路由模块
    // const result = require("./config/ActionResult")();
var log4js = require('log4js');
var path = require("path");
var ws = require("ws");
// const { getMenu } = require('./dao/commondao');
const app = express(); //执行express 全局函数，返回一个express服务器对象
const port = 8888;

const commonController = require("./controller/commonController");
const userController = require("./controller/userController");
const productController = require("./controller/productController");
//2.日志模块：记录每次请求信息，并在调试台看到
// app.use(logger("dev"));logger
app.use(cookieParser('sessiontest'));
app.use(session({
    name: "demo123",
    secret: 'sessiontest', //与coocookieParserkieParser中的一致
    saveUninitialized: true,
    resave: false, //是否更新session-cookie的失效时间 默认为true
    saveUninitialized: true, //未初始化的cookie 要不要保存，无论有没有设置session cookie 每次请求都设置个session cookie
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 设置 session 的有效时间，单位毫秒 1天
        rolling: true, //更新保存，按照原设定的maxAge值重新设定同步到cookie中 
    }
}))
app.use(bodyParser.urlencoded({ extended: false })); //使用处理post请求的模块
app.use(bodyParser.json());


//判断是否登录
// app.use((req, resp, next) => {
//     const　 { session = {}, url = '' } = req;
//     const { userinfo = null } = session;
//     if (url.indexOf("login") == -1 && url.indexOf("logout") == -1 && url.indexOf("public") == -1 && url.indexOf("uploadFiles.do") == -1) {
//         if (userinfo == null || userinfo == undefined) {
//             // console.log("userinfoc null");
//             result.success = false;
//             result.noLogin = true;
//             result.message = "您还没有登录";
//             resp.send(result);
//         } else {
//             //console.log("你可以继续")
//             next();
//             //  resp.sendfile(__dirname + "/src" + url);
//         }
//     } else {
//         //   console.log("next...");
//         next();
//     }
// });



//1.设置静态资源路径
app.use(express.static(__dirname + "/dist")); //__dirname 指向当前文件的根目录

// app.get('/**', (req, res) => {
//     const url = req.url;
//     console.log(url)
//     if (/^\/api/.test(url)) {
//         const urlSplit = url.split('/');
//         const apiName = urlSplit[urlSplit.length - 1].split('.')[0];
//         commonController[apiName] && commonController[apiName](req, res)
//         userController[apiName] && userController[apiName](req, res)
//         return
//     }

//     console.log(req.session.userInfo)
//     res.render(__dirname + '/dist/index.ejs', {
//         user: req.session.userInfo
//     });
// })


// app.post('/**', (req, res) => {
//     const url = req.url;
//     console.log(url)
//     if (/^\/api/.test(url)) {
//         const urlSplit = url.split('/');
//         const apiName = urlSplit[urlSplit.length - 1].split('.')[0];
//         commonController[apiName] && commonController[apiName](req, res)
//         userController[apiName] && userController[apiName](req, res)
//         return
//     }
// })





app.use((req, res, next) => {
    if (/^\/api/.test(req.url)) {
        next();
        return
    }

    res.render(__dirname + '/dist/index.ejs', {
        user: req.session.userInfo
    });
    next();
});




app.use(route); //使用自己定义路由模块



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*  -----------------------------------webScoket---------------------- */
// const wss = new ws.Server({

// });