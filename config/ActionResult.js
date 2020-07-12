// const result = {
//     success: false,
//     message: "",
//     total: 0,
//     data: []
// }


// module.exports = function() {
//     // return {...Result }
//     return {...Result }
// };

// class Result {
//     constructor(obj) {
//         const { success = false, message = '', total = 0, list = [] } = obj
//         this.success = success;
//         this.message = message;
//         this.total = total;
//         this.list = list;
//     }

// }
// module.exports = Result;

var Result = function() {
    this.total = 0;
    this.success = false;
    this.message = '';
    this.data = [];
    return this;
}
module.exports = Result;