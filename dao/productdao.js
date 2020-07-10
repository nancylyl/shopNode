const db = require("../config/dbpoolconfig");

const indexdao = {
    getProductDetail(req, resp) {
        let Id = parseInt(req.query.Id)
        db.connect(" select * from S_ProDetails where Id=?", [Id], (err, data) => {
            resp.send(data)
        });

    }
}
module.exports = indexdao;