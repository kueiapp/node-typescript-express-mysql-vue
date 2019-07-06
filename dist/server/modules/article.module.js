"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_module_1 = __importDefault(require("./db.module"));
var insertArticle = function (inputData) {
    return new Promise(function (resolve, reject) {
        // get from db.module
        db_module_1.default.getConnection(function (connectionError, connection) {
            if (connectionError) {
                reject(connectionError);
            }
            else {
                connection.query("INSERT INTO favorite SET ?", [inputData], function (error, result) {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error);
                    }
                    else if (result.affectedRows === 1) {
                        resolve({ "code": 200, "msg": "Insert successfully！", "data": inputData });
                    }
                    // release memory
                    connection.release();
                });
            }
        });
    });
};
var selectArticle = function () {
    return new Promise(function (resolve, reject) {
        // get from db.module
        db_module_1.default.getConnection(function (connectionError, connection) {
            if (connectionError) {
                reject(connectionError);
            }
            else {
                connection.query("SELECT * FROM favorite", function (error, result) {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                    // release memory
                    connection.release();
                });
            }
        });
    });
};
var deleteArticle = function (aid) {
    return new Promise(function (resolve, reject) {
        // get from db.module
        db_module_1.default.getConnection(function (connectionError, connection) {
            if (connectionError) {
                reject(connectionError);
            }
            else {
                connection.query("DELETE FROM favorite WHERE id = ? ", [aid], function (error, result) {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error);
                    }
                    else if (result.affectedRows === 1) {
                        resolve({ "code": 200, "msg": "DELETE successfully！" });
                    }
                    // release memory
                    connection.release();
                });
            }
        });
    });
};
exports.default = {
    selectArticle: selectArticle, insertArticle: insertArticle, deleteArticle: deleteArticle
};
//# sourceMappingURL=article.module.js.map