/**
* by kueiapp.com
*/
// ES6
import {Pool,PoolConnection,MysqlError} from 'mysql';
import setting from '../config/setting'
import db from './db.module';

const insertArticle = function (inputData:object)
{
  return new Promise( function (resolve, reject) 
  {
    // get from db.module
    db.getConnection( function (connectionError:MysqlError, connection:PoolConnection)
    { 
      if (connectionError) {
        reject(connectionError); 
      }
      else {
        connection.query( `INSERT INTO favorite SET ?`, [inputData], function (error, result) 
        {
            if (error) {
              console.error('SQL error: ', error);
              reject(error); 
            }
            else if (result.affectedRows === 1) {
              resolve({"code":200, "msg": "Insert successfully！", "data":inputData});
            }

            // release memory
            connection.release();
          }
        );
      }
    });
  });
};

const selectArticle = function ()
{
  return new Promise( function (resolve, reject) 
  {
    // get from db.module
    db.getConnection( function (connectionError:MysqlError, connection:PoolConnection)
    { 
      if (connectionError) {
        reject(connectionError); 
      }
      else {
        connection.query( `SELECT * FROM favorite`, function (error, result) 
        {
            if (error) {
              console.error('SQL error: ', error);
              reject(error); 
            }
            else {
              resolve(result); 
            }

            // release memory
            connection.release();
          }
        );
      }
    });
  });
};

const deleteArticle = function (aid:string)
{
  return new Promise( function (resolve, reject) 
  {
    // get from db.module
    db.getConnection( function (connectionError:MysqlError, connection:PoolConnection)
    { 
      if (connectionError) {
        reject(connectionError); 
      }
      else {
        connection.query( `DELETE FROM favorite WHERE id = ? `,[aid], function (error, result) 
        {
            if (error) {
              console.error('SQL error: ', error);
              reject(error); 
            }
            else if (result.affectedRows === 1) {
              resolve({"code":200, "msg": "DELETE successfully！"});
            }

            // release memory
            connection.release();
          }
        );
      }
    });
  });
};
export default {
  selectArticle,insertArticle,deleteArticle
};
