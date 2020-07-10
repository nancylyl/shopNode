const multer = require("multer");
// console.log("uploadconfig---");
//文件上传模块配置
const storge = multer.diskStorage({
    destination: function(req, file, cb) {
        //  console.log(file);
        cb(null, "./src/uploads"); //保存上次文件
    },
    filename: function(req, file, cb) {

        let fileFormat = (file.originalname).split(".");
        let e_Name = "admin"; // req.session.userinfo.e_Name;
        // console.log(fileFormat);
        cb(null, fileFormat[0] + '-' + e_Name + '.' + fileFormat[fileFormat.length - 1]);
    }
})
const upload = multer({
    storage: storge
})

//公开配置
module.exports = upload;