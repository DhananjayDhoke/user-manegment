const db = require("../config/db");
const logger = require("../utils/logger");
const moment = require('moment');
exports.AdminLogin = async (req, res) => {
  const { username, password } = req.body;
  //console.log("inside admin login")
  const query = "select admin_id,name,username,password from admin_login_mst where username = ? and password = ?  and status = 'Y'";

  try {
    db.query(query,[username,password], (err, result) => {
      if (err) {
        console.log(err)
        logger.error(err.message);
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else if (result.length === 0) {
        logger.warn("Invalid Email or Password");
        res.status(401).json({
          errorCode: "0",
          errorDetail: "Invalid Email or Password",
          responseData: {},
          status: "ERROR",
          details: "UNAUTHORIZED",
          getMessageInfo: "Invalid Email or Password",
        });
      } else {
        const user = result[0];
        if (username === user.username && password === user.password) {
          logger.info(" Admin Login successful");
          res.json({
            errorCode: "1",
            errorDetail: "",
            responseData: {
              message: "Login successful",
              user_id: user.admin_id,
              name: user.name,
            },
            status: "SUCCESS",
            details: "",
            getMessageInfo: "",
          });
        } else {
          logger.warn("Invalid Email or Password");
          res.status(401).json({
            errorCode: "UNAUTHORIZED",
            errorDetail: "Invalid Email or Password",
            responseData: {},
            status: "ERROR",
            details: "Invalid Email or Password",
            getMessageInfo: "Invalid Email or Password",
          });
        }
      }
    });
  } catch (error) {
    console.log(error)
    logger.error(error.message);
    res.send(error);
  }
};


exports.loginUser = async (req, res) => {
  const { empcode, password } = req.body;
  const query = 'select user_id, empcode, password from admin_user_login_mst where empcode=? and status="Y"';

  try {
    db.query(query, [empcode], (err, result) => {
      if (err) {
        logger.error(`Error in /controller/admin/loginUser: ${err.message}. SQL query: ${query}`);
        return res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      } else if (result.length === 0) {
        logger.warn('Invalid Employee Code or Password');
        return res.status(401).json({
          errorCode: "0",
          errorDetail: "Invalid Employee Code or Password",
          responseData: {},
          status: "ERROR",
          details: "UNAUTHORIZED",
          getMessageInfo: "Invalid Employee Code or Password"
        });
      } else {
        const user = result[0];
        if (password == user.password) {
          //logger.info('Login successful', { empID: user.empcode, user_id: user.user_id });
            
            if(user.role == 5){
              
              return res.json({
                errorCode:0,
                message:'UNAUTHORIZED'
              })
            }
          // const loginTime = new Date();
          // const historyQuery = 'insert into user_login_history (user_id, login_datetime) values (?, ?)';
          // db.query(historyQuery, [user.user_id, loginTime], (err, result) => {
          //   if (err) {
          //     logger.error(`Error in /controller/auth/login: ${err.message}. SQL query: ${query}`);
          //     return res.status(500).json({
          //       errorCode: "0",
          //       errorDetail: err.message,
          //       responseData: {},
          //       status: "ERROR",
          //       details: "An internal server error occurred",
          //       getMessageInfo: "An internal server error occurred"
          //     });
          //   } else {
          //     logger.info("login history added successfully");
          //     const historyId = result.insertId;
          //     console.log(result)
          //     return res.json({
          //       errorCode: "1",
          //       errorDetail: "",
          //       responseData: {
          //         message: "Login successful",
          //         empID: user.empcode,
          //         user_id: user.user_id,
          //         role: user.role,
          //         sessionID:historyId
          //       },
          //       status: "SUCCESS",
          //       details: "",
          //       getMessageInfo: ""
          //     });
          //   }
          // });

          return res.json({
            errorCode: "1",
            errorDetail: "",
            responseData: {
              message: "Login successful",
              empID: user.empcode,
              user_id: user.user_id,
              role: user.role,
            },
            status: "SUCCESS",
            details: "",
            getMessageInfo: ""
          });
        } else {
          logger.warn('Invalid Email or Password');
          return res.status(401).json({
            errorCode: "UNAUTHORIZED",
            errorDetail: "Invalid Email or Password",
            responseData: {},
            status: "ERROR",
            details: "Invalid Email or Password",
            getMessageInfo: "Invalid Email or Password"
          });
        }
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred"
    });
  }
};


// exports.logout = async (req, res) => {
//   const {sessionId } = req.body;
//   const logoutTime = new Date();
//   const query = 'update user_login_history set logout_datetime =? where lh_id = ?'
//   try {
//     db.query(query, [logoutTime,sessionId], (err, result) => {
//       if (err) {
//       logger.error(err.message);

//         res.status(500).json({
//           errorCode: "0",
//           errorDetail: err.message,
//           responseData: {},
//           status: "ERROR",
//           details: "An internal server error occurred",
//           getMessageInfo: "An internal server error occurred"
//         });
//       }
//       else{
//       logger.info('Logout Successfully');

//         res.status(200).json({ message: "Logout Successfully",errorCode: "1"})
//       } 
//     });
//   } catch (error) {
//     logger.error(error.message);

//     res.send(error)
//   }
// };



exports.totalDoctor = async (req, res) => {
  //const query = "SELECT COUNT(*) as doctor_count FROM doctor_mst";
  //const query = 'select count(distinct doctor_name) as doctor_count from camp_report_mst'
  const query = ' CALL AdminTotalDoctorCount()'
  try {
    db.query(query, (err, result) => {
      if (err) {
        logger.error(err.message);
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        logger.info("Fetched total doctors");
        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    logger.error(error.message);
    res.json(error);
  }
};

exports.totalCamps = async (req, res) => {
  //const query = "SELECT COUNT(*) as camp_count FROM doctor_camp_mapping;";
  //const query = 'select count(*) as camp_count from camp_report_mst'

  const query = ` SELECT (
    (SELECT COUNT(*) FROM eye_report_mst WHERE status='Y') +
    (SELECT COUNT(*) FROM glaucoma_report_mst WHERE status='Y') +
    (SELECT COUNT(*) FROM operative_mst WHERE status='Y')
) AS total_count;`
  try {
    db.query(query, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        logger.info("Fetched total Camps");

        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};

exports.totalPaScreened = async (req, res) => {
  const query =
    "SELECT SUM(answer) as screened_count FROM question_camp_rep_mapping WHERE rqid IN (1, 4);";

  try {
    db.query(query, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        logger.info("Fetched total patient screened");

        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};

exports.totalPaDiagnosed = async (req, res) => {
  const query =
    "SELECT SUM(answer) as diagnosed_count FROM question_camp_rep_mapping WHERE rqid IN (2, 5);";

  try {
    db.query(query, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        logger.info("Fetched total patients diagnosed");

        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};

// api for subcategory data

// exports.getSubCatData = async (req, res) => {
//     const { subCatId, rqId1,rqId2 } = req.body;

//     const query = 'CALL GetSubCatData(?,?,?)'
//     try {
//       db.query(query,[subCatId,rqId1,rqId2] ,(err, result) => {
//         if (err) {
//         logger.error(err.message);

//           res.status(500).json({
//             errorCode: "0",
//             errorDetail: err.message,
//             responseData: {},
//             status: "ERROR",
//             details: "An internal server error occurred",
//             getMessageInfo: "An internal server error occurred",
//           });
//         } else {
//         logger.info('Fetched Subcategory Data');

//           res.status(200).json(result[0]);
//         }
//       });
//     } catch (error) {
//       logger.error(error.message);

//       res.json(error);
//     }
//   };

// improved version

exports.getSubCatData = async (req, res) => {
  //const { subCatId, rqId1,rqId2 } = req.body;
  try {
  //   const query1 = `SELECT
  //     subcat_id,
  //     MAX(CASE WHEN rn = 1 THEN rqid END) AS rqid1,
  //     MAX(CASE WHEN rn = 2 THEN rqid END) AS rqid2,
  //     MAX(CASE WHEN rn = 3 THEN rqid END) AS rqid3,
  //     MAX(CASE WHEN rn = 4 THEN rqid END) AS rqid4
  // FROM (
  //     SELECT
  //         subcat_id,
  //         rqid,
  //         ROW_NUMBER() OVER (PARTITION BY subcat_id ORDER BY rqid) AS rn
  //     FROM report_ques_mst
  // ) AS subcat_rn
  // GROUP BY subcat_id;
  // `;
  //   const users = await new Promise((resolve, reject) => {
  //     db.query(query1, (err, result) => {
  //       if (err) {
  //         logger.error(err.message);
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     });
  //   });
    const users = [{
      subcat_id: 1,
      rqid1: 1,
      rqid2: 2,
      rqid3: 3,
      rqid4: null
    },{
      subcat_id: 2,
      rqid1: 4,
      rqid2: 5,
      rqid3: 6,
      rqid4: null
    },{
      subcat_id: 3,
      rqid1: null,
      rqid2: null,
      rqid3: null,
      rqid4: null
    },]
    const reportData = [];
    //console.log("inside subcat data",users);
    for (const user of users) {
      const query2 = "CALL GetSubCatData(?,?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.subcat_id, user.rqid1, user.rqid2,user.rqid3,user.rqid4],
            (err, result) => {
              if (err) {
                logger.error(err.message);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Subcategory Data Fetch Successfully");
    //console.log("this is report data",reportData)
    res.status(200).json(reportData);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

exports.getSubCatFiterData = async (req, res) => {
  const { filter, startDate, endDate } = req.query;
  try {
   
    const users = [{
      subcat_id: 1,
      rqid1: 1,
      rqid2: 2,
      rqid3: 3,
      rqid4: null
    },{
      subcat_id: 2,
      rqid1: 4,
      rqid2: 5,
      rqid3: 6,
      rqid4: null
    },{
      subcat_id: 3,
      rqid1: null,
      rqid2: null,
      rqid3: null,
      rqid4: null
    },]
    const reportData = [];
    //console.log(users);
    for (const user of users) {
      const query2 = "CALL GetFilteredReportData1(?,?,?,?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.subcat_id, user.rqid1, user.rqid2, user.rqid3, filter,startDate,endDate],
            (err, result) => {
              if (err) {
                logger.error(err);
                //console.log(err)
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        //console.log(result)
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Subcategory Filter Data Fetch Successfully");
    res.status(200).json(reportData);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

exports.getSubCatFilterDataWithZoneId = async (req, res) => {
  const { zoneId } = req.query;
  try {
   
    const users = [{
      subcat_id: 1,
    },{
      subcat_id: 2,
    },{
      subcat_id: 3,
    },]
    const reportData = [];
    //console.log(users);
    for (const user of users) {
      const query2 = "CALL GetFilteredReportDataWithZone(?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.subcat_id,zoneId],
            (err, result) => {
              if (err) {
                logger.error(err);
                console.log(err)
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        //console.log(result)
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Subcategory Filter Data with zone Fetch Successfully");
    res.status(200).json(reportData);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

exports.getSubCatFilterDataWithStateId = async (req, res) => {
  const { stateId } = req.query;
  try {
   
    const users = [{
      subcat_id: 1,
    },{
      subcat_id: 2,
    },{
      subcat_id: 3,
    },]
    const reportData = [];
    //console.log(users);
    for (const user of users) {
      const query2 = "CALL GetFilteredReportDataWithState(?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.subcat_id,stateId],
            (err, result) => {
              if (err) {
                logger.error(err);
                console.log(err)
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        //console.log(result)
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Subcategory Filter Data with zone Fetch Successfully");
    res.status(200).json(reportData);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

exports.subCatInfo = async (req, res) => {
  const query = `SELECT
  subcat_rn.subcat_id,
  subcat_name.subcategory_name,
  MAX(CASE WHEN rn = 1 THEN rqid END) AS rqid1,
  MAX(CASE WHEN rn = 2 THEN rqid END) AS rqid2,
  MAX(CASE WHEN rn = 3 THEN rqid END) AS rqid3,
  MAX(CASE WHEN rn = 4 THEN rqid END) AS rqid4
FROM (
  SELECT
      subcat_id,
      rqid,
      ROW_NUMBER() OVER (PARTITION BY subcat_id ORDER BY rqid) AS rn
  FROM report_ques_mst
) AS subcat_rn
JOIN subcategory_mst AS subcat_name
  ON subcat_rn.subcat_id = subcat_name.subcategory_id
GROUP BY subcat_rn.subcat_id, subcat_name.subcategory_name;`;

  try {
    db.query(query, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        

        res.status(200).json(result);
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};

// api for employee



// api for report

// exports.getReport = async(req,res)=>{

//   //const {subCatId,rqId1,rqId2} = req.body;

//   const query = 'select user_id, name, empcode, role from user_mst1'
//    try {
//          db.query(query, (err, result) => {
//            if (err) {
//            logger.error(err.message);
//              res.status(500).json({
//                errorCode: "0",
//                errorDetail: err.message,
//                responseData: {},
//                status: "ERROR",
//                details: "An internal server error occurred",
//                getMessageInfo: "An internal server error occurred"
//              });
//            }
//            else{
//              result.forEach(element => {

//               const query = 'CALL GetReportData(?,?,?)'
//               try {
//                     db.query(query, [element.user_id,1,2], (err, result) => {
//                       if (err) {
//                       logger.error(err.message);
//                         res.status(500).json({
//                           errorCode: "0",
//                           errorDetail: err.message,
//                           responseData: {},
//                           status: "ERROR",
//                           details: "An internal server error occurred",
//                           getMessageInfo: "An internal server error occurred"
//                         });
//                       }
//                       else{

//                         logger.info('Employee Report get Successfully');

//                         res.status(200).json(result)
//                       }
//                     });
//                   } catch (error) {
//                     logger.error(error.message);

//                     res.send(error)
//                   }

//              });
//            }
//          });
//        } catch (error) {
//          logger.error(error.message);

//          res.send(error)
//        }
// }

// exports.getReport = async (req, res) => {
//   const { subCatId, rqId1, rqId2, empcode } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
  
//   try {
//     let query1;
//     if (empcode && empcode !== "null" && empcode !== undefined) {
//       query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} LIMIT ${limit} OFFSET ${offset}`;
//     } else {
//       query1 = `select user_id, name, empcode, role from user_mst1 LIMIT ${limit} OFFSET ${offset}`;
//     }
//     //const query1 = 'select user_id, name, empcode, role from user_mst1';
//     console.log(query1)
//     const users = await new Promise((resolve, reject) => {
//       db.query(query1, (err, result) => {
//         if (err) {
//           logger.error(err.message);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
   
//     const reportData = [];
//     for (const user of users) {
//       const query2 = "CALL GetReportData1(?,?,?,?)";
//       try {
//         const result = await new Promise((resolve, reject) => {
//           db.query(
//             query2,
//             [user.user_id, subCatId, rqId1, rqId2],
//             (err, result) => {
//               if (err) {
//                 logger.error(err.message);
//                 reject(err);
//               } else {
//                 resolve(result);
//               }
//             }
//           );
//         });
//         reportData.push(result[0][0]);
//       } catch (error) {
//         logger.error(error.message);
//         // Handle the error here, but don't send a response in the loop.
//       }
//     }

//     logger.info("Employee Report get Successfully");
//     res.status(200).json(reportData);
//   } catch (error) {
//     logger.error(error.message);
//     res.status(500).json({
//       errorCode: "0",
//       errorDetail: error.message,
//       responseData: {},
//       status: "ERROR",
//       details: "An internal server error occurred",
//       getMessageInfo: "An internal server error occurred",
//     });
//   }
// };

// this is working channel
exports.getReportNormal = async (req, res) => {
  const { subCatId, empcode } = req.query;

  //console.log("inside get report normal query",req.query)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const searchName = req.query.searchName || '';

  try {
    let query1;
    let totalRowCountQuery; // Query to count total matching rows

    if (empcode && empcode !== "null" && empcode !== undefined) {
      query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%' LIMIT ${limit} OFFSET ${offset}`;
      totalRowCountQuery = `SELECT COUNT(*) as totalCount FROM user_mst1 WHERE reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%'`;
    } else {
      query1 = `select user_id, name, empcode, role from user_mst1 where status = 'Y' AND name LIKE '%${searchName}%' LIMIT ${limit} OFFSET ${offset}`;
      totalRowCountQuery = `SELECT COUNT(*) as totalCount FROM user_mst1 where status = 'Y' AND name LIKE '%${searchName}%'`;
    }
   //console.log("query1",query1)
    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getReportNormal",err);
          reject(err);
        } else {
          //console.log("result",result)
          resolve(result);
        }
      });
    });

    const totalRowCountResult = await new Promise((resolve, reject) => {
      db.query(totalRowCountQuery, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getReportNormal",err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });

    const totalRowCount = totalRowCountResult.totalCount;

    console.log("isnide getreport normal", users)

    const reportData = [];
    for (const user of users) {
      const query2 = "CALL GetReportData1(?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.user_id, subCatId],
            (err, result) => {
              if (err) {
              logger.error("controller/adminDashboard/getReportNormal",err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json({ reportData, totalRowCount }); // Send both data and total count
  } catch (error) {
    logger.error("controller/adminDashboard/getReportNormal",error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

exports.getReport = async (req, res) => {
  const { subCatId, rqId1, rqId2, empcode,filter, startDate, endDate } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const searchName = req.query.searchName || '';

  try {
    let query1;
    let totalRowCountQuery; // Query to count total matching rows

    if (empcode && empcode !== "null" && empcode !== undefined) {
      query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%' LIMIT ${limit} OFFSET ${offset}`;
      totalRowCountQuery = `SELECT COUNT(*) as totalCount FROM user_mst1 WHERE reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%'`;
    } else {
      query1 = `select user_id, name, empcode, role from user_mst1 where status = 'Y' AND name LIKE '%${searchName}%' LIMIT ${limit} OFFSET ${offset}`;
      totalRowCountQuery = `SELECT COUNT(*) as totalCount FROM user_mst1 where status = 'Y' AND name LIKE '%${searchName}%'`;
    }

    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getReport",err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const totalRowCountResult = await new Promise((resolve, reject) => {
      db.query(totalRowCountQuery, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getReport",err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });

    const totalRowCount = totalRowCountResult.totalCount;

    const reportData = [];
    for (const user of users) {
      const query2 = "CALL GetFilterReportData2(?,?,?,?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.user_id, subCatId, rqId1, rqId2,filter,startDate,endDate],
            (err, result) => {
              if (err) {
                logger.error("controller/adminDashboard/getReport",err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        //console.log(result)
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error("controller/adminDashboard/getReport",error.message);

        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json({ reportData, totalRowCount }); // Send both data and total count
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};


// report download api 

exports.downloadReportNormal = async (req, res) => {
  const { subCatId, empcode } = req.query;
  const searchName = req.query.searchName || '';

  console.log("query inside download report normal",req.query)

  try {
    let query1;
   

    if (empcode && empcode !== "null" && empcode !== undefined) {
      query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%'`;
    //   query1 = `WITH RECURSIVE EmployeeHierarchy AS (
    //     SELECT user_id,empcode, name, reporting
    //     FROM user_mst1
    //     WHERE reporting = ${empcode} AND name LIKE '%${searchName}%'
    //     UNION ALL
    //     SELECT e.user_id, e.empcode, e.name, e.reporting
    //     FROM user_mst1 e
    //     INNER JOIN EmployeeHierarchy eh ON e.reporting = eh.empcode
    // )
    // SELECT user_id, empcode, name
    // FROM EmployeeHierarchy
    // WHERE reporting IS NOT NULL;`
   

    // this is working 
//     query1=`
//     WITH RECURSIVE EmployeeHierarchy AS (
//       SELECT user_id, empcode, name, reporting
//       FROM user_mst1
//       WHERE empcode = ${empcode} AND name LIKE '%${searchName}%'
//       UNION ALL
//       SELECT e.user_id, e.empcode, e.name, e.reporting
//       FROM user_mst1 e
//       INNER JOIN EmployeeHierarchy eh ON e.empcode = eh.reporting
//   )
//   SELECT user_id, empcode, name
//   FROM EmployeeHierarchy
//   WHERE reporting IS NOT NULL
  
//   UNION

// SELECT user_id, empcode, name
// FROM user_mst1
// WHERE reporting = ${empcode} AND name LIKE '%${searchName}%';
//   `

//   query1 =`
//   WITH RECURSIVE EmployeeHierarchy AS (
//     SELECT 
//         user_id, 
//         empcode, 
//         name, 
//         reporting,
//         role
//     FROM user_mst1
//     WHERE empcode = ${empcode} AND name LIKE '%${searchName}%'
    
//     UNION ALL
    
//     SELECT 
//         e.user_id, 
//         e.empcode, 
//         e.name, 
//         e.reporting,
//         e.role
//     FROM user_mst1 e
//     INNER JOIN EmployeeHierarchy eh ON e.empcode = eh.reporting
// )
// SELECT user_id, empcode, name, reporting, role
// FROM EmployeeHierarchy
// WHERE reporting IS NOT NULL;`
    } else {
      query1 = `select user_id, name, empcode, role from user_mst1 where status = 'Y' AND name LIKE '%${searchName}%'`;
     
    }

    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/downloadReportNormal",err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const reportData = [];
    //console.log("user",users)
    for (const user of users) {
      const query2 = "CALL GetReportData1(?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.user_id, subCatId],
            (err, result) => {
              if (err) {
                logger.error("controller/adminDashboard/downloadReportNormal",err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json(reportData); // Send both data and total count
  } catch (error) {
    logger.error("controller/adminDashboard/downloadReportNormal",error.message);

    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};


//working code
exports.downloadReportFilter = async (req, res) => {
  const { subCatId, rqId1, rqId2, empcode,filter, startDate, endDate } = req.query;
  const searchName = req.query.searchName || '';

  try {
    let query1;
  

    if (empcode && empcode !== "null" && empcode !== undefined) {

      query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y' AND name LIKE '%${searchName}%'`;

  //     query1=`
  //     WITH RECURSIVE EmployeeHierarchy AS (
  //       SELECT user_id, empcode, name, reporting
  //       FROM user_mst1
  //       WHERE empcode = ${empcode} AND name LIKE '%${searchName}%'
  //       UNION ALL
  //       SELECT e.user_id, e.empcode, e.name, e.reporting
  //       FROM user_mst1 e
  //       INNER JOIN EmployeeHierarchy eh ON e.empcode = eh.reporting
  //   )
  //   SELECT user_id, empcode, name
  //   FROM EmployeeHierarchy
  //   WHERE reporting IS NOT NULL
    
  //   UNION
  
  // SELECT user_id, empcode, name
  // FROM user_mst1
  // WHERE reporting = ${empcode} AND name LIKE '%${searchName}%';
  //   `;
     
    } else {
      query1 = `select user_id, name, empcode, role from user_mst1 where status = 'Y' AND name LIKE '%${searchName}%'`;
     
    }

    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/downloadReportFilter",err);

          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const reportData = [];
    for (const user of users) {
      const query2 = "CALL GetFilterReportData2(?,?,?,?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.user_id, subCatId, rqId1, rqId2,filter,startDate,endDate],
            (err, result) => {
              if (err) {
                logger.error("controller/adminDashboard/downloadReportFilter",err);

                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error(error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json(reportData); // Send both data and total count
  } catch (error) {
    logger.error("controller/adminDashboard/downloadReportFilter",error.message);

    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};

// Hierarchy logic

  


exports.getTopLine = async (req, res) => {
  const { empcode } = req.body;

  const query =
    "select user_id,name,empcode,reporting from user_mst1 where reporting = ? and status = 'Y'";

  try {
    db.query(query, [empcode], (err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.send(error);
  }
};



  // download report hierekeywise 

  exports.getReportNumberWise = async (req, res) => {
    const { subCatId,startDate,endDate,zoneId } = req.query;
    
    
    const query = 'CALL  AV_GetCampReportFinalSummary_DateRange(?,?,?,?)'
    try {
      db.query(query,[subCatId,startDate,endDate,zoneId] ,(err, result) => {
        if (err) {
        logger.error("controller/adminDashboard/getReportNumberWise",err);

          res.status(500).json({
            errorCode: "0",
            errorDetail: err,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
        logger.info('Fetched All Records in NumberWise');

          res.status(200).json(result);
        }
      });
    } catch (error) {
      logger.error("controller/adminDashboard/getReportNumberWise",error.message);

      res.json(error);
    }
  };


  // for image download
  // exports.getDataForImageDownload = async (req, res) => {
    
  //   const query = `SELECT user_mst1.name, camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_img_mst.imgpath FROM user_mst1
  //   INNER JOIN camp_report_mst on user_mst1.user_id = camp_report_mst.user_id
  //   INNER JOIN camp_report_img_mst ON camp_report_mst.crid = camp_report_img_mst.crid;`
  //   try {
  //     db.query(query, (err, result) => {
  //       if (err) {
  //       logger.error(err.message);

  //         res.status(500).json({
  //           errorCode: "0",
  //           errorDetail: err.message,
  //           responseData: {},
  //           status: "ERROR",
  //           details: "An internal server error occurred",
  //           getMessageInfo: "An internal server error occurred"
  //         });
  //       }
  //       else{
  //       logger.info('Fetch Employee Successfully');

  //         res.status(200).json(result)
  //       } 
  //     });
  //   } catch (error) {
  //     logger.error(error.message);

  //     res.send(error)
  //   }
  // };

  // exports.getDataForImageDownload = async (req, res) => {
  //   const query = `
  //     SELECT 
  //       user_mst1.name,
  //       user_mst1.empcode, 
  //       camp_report_mst.doctor_name, 
  //       camp_report_mst.camp_date,
  //       camp_report_mst.created_date,
  //       camp_report_mst.crid, 
  //       camp_report_img_mst.imgpath 
  //     FROM 
  //       user_mst1
  //     INNER JOIN 
  //       camp_report_mst ON user_mst1.user_id = camp_report_mst.user_id
  //     INNER JOIN 
  //       camp_report_img_mst ON camp_report_mst.crid = camp_report_img_mst.crid;`;
  
  //   try {
  //     db.query(query, (err, result) => {
  //       if (err) {
  //         logger.error(err.message);
  
  //         res.status(500).json({
  //           errorCode: "0",
  //           errorDetail: err.message,
  //           responseData: {},
  //           status: "ERROR",
  //           details: "An internal server error occurred",
  //           getMessageInfo: "An internal server error occurred"
  //         });
  //       } else {
  //         logger.info('Fetch Employee Successfully');
  //         console.log(result)
  //         // Transform the data into the desired format
  //         const transformedData = transformData(result);
  
  //         res.status(200).json(transformedData);
  //       }
  //     });
  //   } catch (error) {
  //     logger.error(error.message);
  
  //     res.send(error);
  //   }
  // };
  
  // function transformData(data) {
  //   const transformedData = [];
  
  //   data.forEach((item) => {
  //     // Check if the person already exists in the transformed data
  //     const person = transformedData.find((p) => p.name === item.name);
  //     const empcode = transformedData.find((e)=>e.empcode === item.empcode)
  //     if (!empcode) {
  //       // If the person doesn't exist, create a new entry
  //       const newPerson = {
  //         name: item.name,
  //         empcode: item.empcode,
  //         doctordata: [
  //           {
  //             doctor_name: item.doctor_name,
  //             crid:item.crid,
  //             camp_date: item.camp_date,
  //             images: [{ imgpath: item.imgpath }]
  //           }
  //         ]
  //       };
  
  //       transformedData.push(newPerson);
  //     } else {
  //       // If the person already exists, check if the doctor exists
  //       const doctor = person.doctordata.find((d) => d.doctor_name === item.doctor_name);
  //         const crid = person.doctordata.find((d)=> d.crid === item.crid) 
  //       if (!crid) {
  //         // If the doctor doesn't exist, create a new entry
  //         const newDoctor = {
  //           doctor_name: item.doctor_name,
  //           crid:item.crid,
  //           camp_date:item.camp_date,
  //           images: [{ imgpath: item.imgpath }]
  //         };
  
  //         person.doctordata.push(newDoctor);
  //       } else {
  //         // If the doctor exists, add the image to the existing doctor
  //         doctor.images.push({ imgpath: item.imgpath });
  //       }
  //     }
  //   });
  
  //   return transformedData;
  // }


  // working code
  // exports.getDataForImageDownload = async (req, res) => {

  //   const userId = req.params.userId
  //   //console.log(userId)
  //   const query = `
  //   select eye_report_mst.doc_name1,
  //    eye_report_mst.erid, eye_report_mst.camp_date,camp_report_img_mst.imgpath
  //     from eye_report_mst INNER JOIN
  //      camp_report_img_mst on eye_report_mst.erid = camp_report_img_mst.crid WHERE eye_report_mst.created_by =? and camp_report_img_mst.subcat_id = 1 and eye_report_mst.status ='Y';
  //  `;
  //  const query2 = `
  //   select glaucoma_report_mst.doc_name1,
  //    glaucoma_report_mst.grid, glaucoma_report_mst.camp_date,camp_report_img_mst.imgpath
  //     from glaucoma_report_mst INNER JOIN
  //      camp_report_img_mst on glaucoma_report_mst.grid = camp_report_img_mst.crid WHERE glaucoma_report_mst.created_by =? and camp_report_img_mst.subcat_id = 2 and glaucoma_report_mst.status ='Y';
  //  `;

  //  const query3 = `
  //   select operative_mst.doctor_name,
  //    operative_mst.orid, operative_mst.camp_date,camp_report_img_mst.imgpath
  //     from operative_mst INNER JOIN
  //      camp_report_img_mst on operative_mst.orid = camp_report_img_mst.crid WHERE operative_mst.created_by =? and camp_report_img_mst.subcat_id = 3 and glaucoma_report_mst.status ='Y';
  //  `;
  
  //   try {
  //     db.query(query,[userId], (err, result) => {
  //       if (err) {
  //         logger.error(err.message);
  
  //         res.status(500).json({
  //           errorCode: "0",
  //           errorDetail: err.message,
  //           responseData: {},
  //           status: "ERROR",
  //           details: "An internal server error occurred",
  //           getMessageInfo: "An internal server error occurred"
  //         });
  //       } else {
  //         logger.info('Fetch Employee Successfully');
  //         //console.log(result)
  //         // Transform the data into the desired format
  //         const transformedData = transformData(result);
  
  //         res.status(200).json(transformedData);
  //         //res.status(200).json(result);

  //       }
  //     });
  //   } catch (error) {
  //     logger.error(error.message);
  
  //     res.send(error);
  //   }
  // };
  
  

  // function transformData(data) {
  //   const transformedData = [];
  //   console.log("taransformedData",transformedData)
  //   console.log("data",data)
  //   data.forEach((item) => {
  //     // Check if the person already exists in the transformed data
  //     const existingDoctor = transformedData.find((e) => e.crid === item.erid);
  
  //     if (!existingDoctor) {
  //       // If the doctor doesn't exist, create a new entry
  //       const newDoctor = {
  //         doctor_name: item.doc_name1,
  //         crid: item.erid,
  //         camp_date:moment(item.camp_date).format('DD-MM-YYYY'),
  //         images: [{ imgpath: item.imgpath }]
  //       };
  
  //       transformedData.push(newDoctor);
  //     } else {
  //       // If the doctor exists, add the image to the existing doctor
  //       existingDoctor.images.push({ imgpath: item.imgpath });
  //     }
  //   });
  //   console.log("transform data",transformedData)
  //   return transformedData;
  // }

  exports.getDataForImageDownload = async (req, res) => {
    const userId = req.params.userId;
  
    const query1 = `
      SELECT 'eye' AS report_type, eye_report_mst.doc_name1, eye_report_mst.erid AS report_id, eye_report_mst.camp_date, camp_report_img_mst.imgpath
      FROM eye_report_mst 
      INNER JOIN camp_report_img_mst ON eye_report_mst.erid = camp_report_img_mst.crid 
      WHERE eye_report_mst.created_by = ? 
        AND camp_report_img_mst.subcat_id = 1 
        AND eye_report_mst.status = 'Y';
    `;
  
    const query2 = `
      SELECT 'glaucoma' AS report_type, glaucoma_report_mst.doc_name1, glaucoma_report_mst.grid AS report_id, glaucoma_report_mst.camp_date, camp_report_img_mst.imgpath
      FROM glaucoma_report_mst 
      INNER JOIN camp_report_img_mst ON glaucoma_report_mst.grid = camp_report_img_mst.crid 
      WHERE glaucoma_report_mst.created_by = ? 
        AND camp_report_img_mst.subcat_id = 2 
        AND glaucoma_report_mst.status = 'Y';
    `;
  
    const query3 = `
      SELECT 'operative' AS report_type, operative_mst.doctor_name, operative_mst.orid AS report_id, operative_mst.camp_date, camp_report_img_mst.imgpath
      FROM operative_mst 
      INNER JOIN camp_report_img_mst ON operative_mst.orid = camp_report_img_mst.crid 
      WHERE operative_mst.created_by = ? 
        AND camp_report_img_mst.subcat_id = 3 
        AND operative_mst.status = 'Y';
    `;
  
    try {
      db.query(query1, [userId], (err1, result1) => {
        if (err1) {
          logger.error(err1.message);
          return res.status(500).json({
            errorCode: "0",
            errorDetail: err1.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred"
          });
        } else {
          db.query(query2, [userId], (err2, result2) => {
            if (err2) {
              logger.error(err2.message);
              return res.status(500).json({
                errorCode: "0",
                errorDetail: err2.message,
                responseData: {},
                status: "ERROR",
                details: "An internal server error occurred",
                getMessageInfo: "An internal server error occurred"
              });
            } else {
              db.query(query3, [userId], (err3, result3) => {
                if (err3) {
                  logger.error(err3.message);
                  return res.status(500).json({
                    errorCode: "0",
                    errorDetail: err3.message,
                    responseData: {},
                    status: "ERROR",
                    details: "An internal server error occurred",
                    getMessageInfo: "An internal server error occurred"
                  });
                } else {
                  logger.info('Fetch Data Successfully');
                  // Combine results from all three queries
                  const combinedResults = result1.concat(result2, result3);
                  // Transform the data into the desired format
                  const transformedData = transformData(combinedResults);
                  res.status(200).json(transformedData);
                }
              });
            }
          });
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.send(error);
    }
  };


  exports.getDataForImageDownload1 = async (req, res) => {
    const userId = req.params.empId;
  
    const query1 = `
      SELECT 'eye' AS report_type, eye_report_mst.doc_name1, eye_report_mst.erid AS report_id, eye_report_mst.camp_date, camp_report_img_mst.imgpath
      FROM eye_report_mst 
      INNER JOIN camp_report_img_mst ON eye_report_mst.erid = camp_report_img_mst.crid 
      WHERE eye_report_mst.mr_code = ? 
        AND camp_report_img_mst.subcat_id = 1 
        AND eye_report_mst.status = 'Y';
    `;
  
    const query2 = `
      SELECT 'glaucoma' AS report_type, glaucoma_report_mst.doc_name1, glaucoma_report_mst.grid AS report_id, glaucoma_report_mst.camp_date, camp_report_img_mst.imgpath
      FROM glaucoma_report_mst 
      INNER JOIN camp_report_img_mst ON glaucoma_report_mst.grid = camp_report_img_mst.crid 
      WHERE glaucoma_report_mst.mr_code = ? 
        AND camp_report_img_mst.subcat_id = 2 
        AND glaucoma_report_mst.status = 'Y';
    `;
  
    // const query3 = `
    //   SELECT 'operative' AS report_type, operative_mst.doctor_name, operative_mst.orid AS report_id, operative_mst.camp_date, camp_report_img_mst.imgpath
    //   FROM operative_mst 
    //   INNER JOIN camp_report_img_mst ON operative_mst.orid = camp_report_img_mst.crid 
    //   WHERE operative_mst.created_by = ? 
    //     AND camp_report_img_mst.subcat_id = 3 
    //     AND operative_mst.status = 'Y';
    // `;
  
    try {
      db.query(query1, [userId], (err1, result1) => {
        if (err1) {
          logger.error(err1.message);
          return res.status(500).json({
            errorCode: "0",
            errorDetail: err1.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred"
          });
        } else {
          db.query(query2, [userId], (err2, result2) => {
            if (err2) {
              logger.error(err2.message);
              return res.status(500).json({
                errorCode: "0",
                errorDetail: err2.message,
                responseData: {},
                status: "ERROR",
                details: "An internal server error occurred",
                getMessageInfo: "An internal server error occurred"
              });
            } else {

              logger.info('Fetch Data Successfully');
              // Combine results from all three queries
              const combinedResults = result1.concat(result2);
              // Transform the data into the desired format
              const transformedData = transformData(combinedResults);
              res.status(200).json(transformedData);
            }
          });
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.send(error);
    }
  };
  
  function transformData(data) {
    const transformedData = [];
    data.forEach((item) => {
      const uniqueId = `${item.report_type}_${item.report_id}`;
      const existingDoctor = transformedData.find((e) => e.uniqueId === uniqueId);
      if (!existingDoctor) {
        const newDoctor = {
          uniqueId: uniqueId,
          doctor_name: item.doc_name1 || item.doctor_name,
          report_type: item.report_type,
          report_id: item.report_id,
          camp_date: moment(item.camp_date).format('DD-MM-YYYY'),
          images: [{ imgpath: item.imgpath }]
        };
        transformedData.push(newDoctor);
      } else {
        existingDoctor.images.push({ imgpath: item.imgpath });
      }
    });
    // Remove uniqueId from final output
    return transformedData.map(({ uniqueId, ...rest }) => rest);
  }


  exports.getReportFromTop = async (req, res) => {
    const { empcode,subCatId,startDate,endDate,zoneId } = req.query;
    
     console.log("query",req.query);
    //const query = 'CALL AV_GetCampReportFinalSummary_EmpCodeDateRange(?,?,?,?)'
    //const query = ' CALL AV_GetCampReportSummaryByEmpcode_DateRangeWise(?,?,?,?)'
    const query = 'CALL AV_GetCampReportFinalSummary_EmpCodeDateRange(?,?,?,?,?)'
    try {
      db.query(query,[empcode,subCatId,startDate,endDate,zoneId] ,(err, result) => {
        if (err) {
        logger.error(err.message);

          res.status(500).json({
            errorCode: "0",
            errorDetail: err,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
        logger.info('Fetched All Records From TopLine');

          res.status(200).json(result);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };
  
// for doctor count
  exports.totalDoctorCount = async (req, res) => {
   
    const {catValue} = req.body;
    
    let query;
    if(catValue){

      query = `
       SELECT
       COUNT(DISTINCT doctor_name) AS doctor_count,
       MONTH(created_date) AS report_month,
       YEAR(created_date) AS report_year
       FROM
       camp_report_mst
       WHERE
       created_date >= CURDATE() - INTERVAL 6 MONTH
       AND subcat_id = ${catValue}
       GROUP BY
       report_year, report_month;
       `
    }
    else{
      query = `
      SELECT
      COUNT(DISTINCT doctor_name) AS doctor_count,
      MONTH(created_date) AS report_month,
      YEAR(created_date) AS report_year
      FROM
      camp_report_mst
      WHERE
      created_date >= CURDATE() - INTERVAL 6 MONTH
      GROUP BY
      report_year, report_month;
      `
    }

    try {
      db.query(query, (err, result) => {
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
          logger.info("Fetched total doctors");
          res.status(200).json(result);
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.json(error);
    }
  };


  // for Camp count
  // exports.totalCampCount = async (req, res) => {
   
  //   const {catValue} = req.body;
    
  //   let query;
  // if(catValue == 1){
  //   query = `
  //   SELECT
  //   COUNT(*) as Camp_Count,
  //   MONTH(camp_date) AS report_month,
  //   YEAR(camp_date) AS report_year
  // FROM
  //   eye_report_mst
  // WHERE
  //   camp_date >= CURDATE() - INTERVAL 6 MONTH
  //   AND subcat_id = ? and status = 'Y'
  // GROUP BY
  //   YEAR(camp_date), MONTH(camp_date);
  //     `
  // }

  // else if(catValue == 2){
  //   query = `
  //   SELECT
  //   COUNT(*) as Camp_Count,
  //   MONTH(camp_date) AS report_month,
  //   YEAR(camp_date) AS report_year
  // FROM
  //   glaucoma_report_mst
  // WHERE
  //   camp_date >= CURDATE() - INTERVAL 6 MONTH
  //   AND subcat_id = ? and status = 'Y'
  // GROUP BY
  //   YEAR(camp_date), MONTH(camp_date);
  //     `
  // }

  // else if (catValue ==3 ) {
  //   query = `
  //   SELECT
  //   COUNT(*) as Camp_Count,
  //   MONTH(camp_date) AS report_month,
  //   YEAR(camp_date) AS report_year
  // FROM
  //   operative_mst
  // WHERE
  //   camp_date >= CURDATE() - INTERVAL 6 MONTH
  //   AND subcat_id = ? and status = 'Y'
  // GROUP BY
  //   YEAR(camp_date), MONTH(camp_date);
  //     `
  // }
  // else{
  //   query = `
  //   (SELECT
  //     COUNT(*) as Camp_Count,
  //     MONTH(camp_date) AS report_month,
  //     YEAR(camp_date) AS report_year
  //   FROM
  //     eye_report_mst
  //   WHERE
  //     camp_date >= CURDATE() - INTERVAL 6 MONTH
  //     AND status = 'Y'
  //   GROUP BY
  //     YEAR(camp_date), MONTH(camp_date))
  //   UNION ALL
  //   (SELECT
  //     COUNT(*) as Camp_Count,
  //     MONTH(camp_date) AS report_month,
  //     YEAR(camp_date) AS report_year
  //   FROM
  //     glaucoma_report_mst
  //   WHERE
  //     camp_date >= CURDATE() - INTERVAL 6 MONTH
  //     AND status = 'Y'
  //   GROUP BY
  //     YEAR(camp_date), MONTH(camp_date))
  //   UNION ALL
  //   (SELECT
  //     COUNT(*) as Camp_Count,
  //     MONTH(camp_date) AS report_month,
  //     YEAR(camp_date) AS report_year
  //   FROM
  //     operative_mst
  //   WHERE
  //     camp_date >= CURDATE() - INTERVAL 6 MONTH
  //     AND status = 'Y'
  //   GROUP BY
  //     YEAR(camp_date), MONTH(camp_date));
  //   `;
  // }

  //   try {
  //     db.query(query,[catValue], (err, results) => {
  //       if (err) {
  //         logger.error(err.message);
  //         res.status(500).json({
  //           errorCode: "0",
  //           errorDetail: err.message,
  //           responseData: {},
  //           status: "ERROR",
  //           details: "An internal server error occurred",
  //           getMessageInfo: "An internal server error occurred",
  //         });
  //       } else {
  //         const mergedResults = {};
          
  //         results.forEach(result => {
  //           const key = `${result.report_month}-${result.report_year}`;
  //           if (!mergedResults[key]) {
             
  //             mergedResults[key] = result;
           
  //           } else {
  //             mergedResults[key].Camp_Count += result.Camp_Count;
              
  //           }
  //         });
  
  //         logger.info("Fetched total camps");
  //         res.status(200).json(Object.values(mergedResults));
  //       }
  //     });
  //   } catch (error) {
  //     logger.error(error.message);
  //     res.json(error);
  //   }
  // };

   // for Camp count
   exports.totalCampCount = async (req, res) => {
   
    const {catValue} = req.body;
    
    let query;
    if (catValue == 1) {
        query = `
            SELECT 
                zone_mst.zone_name,
                COUNT(eye_report_mst.zone_id) AS camp_count
            FROM 
                zone_mst
            LEFT JOIN 
                eye_report_mst ON zone_mst.zone_id = eye_report_mst.zone_id
                AND eye_report_mst.status = 'Y'
            GROUP BY 
                zone_mst.zone_name
        `;
    } else if (catValue == 2) {
        query = `
            SELECT 
                zone_mst.zone_name,
                COUNT(glaucoma_report_mst.zone_id) AS camp_count
            FROM 
                zone_mst
            LEFT JOIN 
                glaucoma_report_mst ON zone_mst.zone_id = glaucoma_report_mst.zone_id
                AND glaucoma_report_mst.status = 'Y'
            GROUP BY 
                zone_mst.zone_name
        `;
    } else if (catValue == 3) {
        query = `
            SELECT 
                zone_mst.zone_name,
                COUNT(operative_mst.zone_id) AS camp_count
            FROM 
                zone_mst
            LEFT JOIN 
                operative_mst ON zone_mst.zone_id = operative_mst.zone_id
                AND operative_mst.status = 'Y'
            GROUP BY 
                zone_mst.zone_name
        `;
    } else {
        query = `
            SELECT 
                z.zone_name,
                (IFNULL(e.camp_count, 0) + IFNULL(g.camp_count, 0) + IFNULL(o.camp_count, 0)) AS camp_count
            FROM 
                zone_mst z
            LEFT JOIN 
                (SELECT zone_id, COUNT(*) AS camp_count FROM eye_report_mst WHERE status = 'Y' GROUP BY zone_id) e ON z.zone_id = e.zone_id
            LEFT JOIN 
                (SELECT zone_id, COUNT(*) AS camp_count FROM glaucoma_report_mst WHERE status = 'Y' GROUP BY zone_id) g ON z.zone_id = g.zone_id
            LEFT JOIN 
                (SELECT zone_id, COUNT(*) AS camp_count FROM operative_mst WHERE status = 'Y' GROUP BY zone_id) o ON z.zone_id = o.zone_id
            GROUP BY 
                z.zone_name, e.camp_count, g.camp_count, o.camp_count
        `;
    }



    try {
      db.query(query,(err, results) => {
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
         
          logger.info("Fetched total camps");
          res.status(200).json(results);
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.json(error);
    }
  };
  

  // patient screened and doctor count

  // for Camp count
  exports.totalPatientScreened = async (req, res) => {
   
    const {catValue} = req.body;
    
    let query;
    if(catValue == 1){

      query = `
      SELECT COALESCE(SUM(answer), 0) AS Screened_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      eye_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = eye_report_mst.erid
  WHERE
      question_camp_rep_mapping.rqid IN (1, 4)
      AND question_camp_rep_mapping.subcat_id = ? and  eye_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date);
       `
    }

    else if(catValue ==2){

      query = `
      SELECT COALESCE(SUM(answer), 0) AS Screened_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      glaucoma_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = glaucoma_report_mst.grid
  WHERE
      question_camp_rep_mapping.rqid IN (1, 4)
      AND question_camp_rep_mapping.subcat_id = ? and  glaucoma_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date);
       `
    }

    else{
      query = `(
        SELECT COALESCE(SUM(answer), 0) AS Screened_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      eye_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = eye_report_mst.erid
  WHERE
      question_camp_rep_mapping.rqid IN (1, 4)
      AND question_camp_rep_mapping.subcat_id = ${1} and  eye_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date))
      UNION ALL
      (
        SELECT COALESCE(SUM(answer), 0) AS Screened_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      glaucoma_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = glaucoma_report_mst.grid
  WHERE
      question_camp_rep_mapping.rqid IN (1, 4)
      AND question_camp_rep_mapping.subcat_id = ${2} and  glaucoma_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date));`
    }
    
    try {
      db.query(query,[catValue], (err, results) => {
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
          logger.info("Fetched total screen");
          const mergedResults = {};
          
          results.forEach(result => {
            const key = `${result.report_month}-${result.report_year}`;
            if (!mergedResults[key]) {
             
              mergedResults[key] = result;
           
            } else {
              mergedResults[key].Screened_Count += result.Screened_Count;
              
            }
          });
  
          
          res.status(200).json(Object.values(mergedResults));
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.json(error);
    }
  };


  exports.totalPatientDiagnosed = async (req, res) => {
   
    const {catValue} = req.body;
    
    let query;
    if(catValue == 1){

      query = `
      SELECT COALESCE(SUM(answer), 0) AS Daignosed_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      eye_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = eye_report_mst.erid
  WHERE
      question_camp_rep_mapping.rqid IN (2,5)
      AND question_camp_rep_mapping.subcat_id = ? and eye_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date);
       `
    }
    else if(catValue == 2){
      query = `
      SELECT COALESCE(SUM(answer), 0) AS Daignosed_Count,
    MONTH(camp_date) AS report_month,
    YEAR(camp_date) AS report_year
FROM
    glaucoma_report_mst
    INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = glaucoma_report_mst.grid
WHERE
    question_camp_rep_mapping.rqid IN (2,5)
    AND question_camp_rep_mapping.subcat_id = ? and  glaucoma_report_mst.status = 'Y'
    AND camp_date >= CURDATE() - INTERVAL 6 MONTH
GROUP BY
    YEAR(camp_date), MONTH(camp_date);
      `
    }
   else{
    query = `
      ( SELECT COALESCE(SUM(answer), 0) AS Daignosed_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      eye_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = eye_report_mst.erid
  WHERE
      question_camp_rep_mapping.rqid IN (2,5)
      AND question_camp_rep_mapping.subcat_id = ${1} and eye_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date))
      UNION ALL
      (SELECT COALESCE(SUM(answer), 0) AS Daignosed_Count,
      MONTH(camp_date) AS report_month,
      YEAR(camp_date) AS report_year
  FROM
      glaucoma_report_mst
      INNER JOIN question_camp_rep_mapping ON question_camp_rep_mapping.crid = glaucoma_report_mst.grid
  WHERE
      question_camp_rep_mapping.rqid IN (2,5)
      AND question_camp_rep_mapping.subcat_id = ${2} and  glaucoma_report_mst.status = 'Y'
      AND camp_date >= CURDATE() - INTERVAL 6 MONTH
  GROUP BY
      YEAR(camp_date), MONTH(camp_date))
    `
   } 

    try {
      db.query(query, [catValue],(err, results) => {
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
          logger.info("Fetched total Diagnose");
          const mergedResults = {};
          
          results.forEach(result => {
            const key = `${result.report_month}-${result.report_year}`;
            if (!mergedResults[key]) {
             
              mergedResults[key] = result;
           
            } else {
              mergedResults[key].Daignosed_Count += result.Daignosed_Count;
              
            }
          });
  
          
          res.status(200).json(Object.values(mergedResults));
        }
      });
    } catch (error) {
      logger.error(error.message);
      res.json(error);
    }
  };


  // api for employee wise data

  exports.getEmpWiseData = async (req, res) => {
  const { subCatId, empcode,startDate,endDate } = req.body;
  //const searchName = req.query.searchName || '';

  try {
   
     let query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y'`;
   
    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getEmpWiseData",err);
          reject(err);
        } else {
          //console.log("result",result)
          resolve(result);
        }
      });
    });

    const reportData = [];
    for (const user of users) {
      const query2 = "CALL GetEmpWiseData(?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.empcode, subCatId,startDate,endDate],
            (err, result) => {
              if (err) {
              logger.error("controller/adminDashboard/getEmpWiseData",err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error("controller/adminDashboard/getEmpWiseData",error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json(reportData); // Send both data and total count
  } catch (error) {
    logger.error("controller/adminDashboard/getEmpWiseData",error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};


exports.getEmpWiseDataUser = async (req, res) => {
  const { subCatId, empcode,startDate,endDate } = req.body;
  
 

  try {
   
    // let query1 = `select user_id, name, empcode, role from user_mst1 where reporting=${empcode} AND status = 'Y'`;
   
    const query1 = `WITH RECURSIVE cte AS (
      -- Base case: Select the topmost employee
      SELECT user_id, name, empcode, role, reporting
      FROM user_mst1
      WHERE reporting =${empcode}
        AND status = 'Y'
  
      UNION ALL
      SELECT u.user_id, u.name, u.empcode, u.role, u.reporting
      FROM user_mst1 u
      INNER JOIN cte c ON u.reporting = c.empcode
      WHERE u.status = 'Y'
  )
  
  SELECT user_id, name, empcode, role
  FROM cte
  WHERE role = 5;
  `
    const users = await new Promise((resolve, reject) => {
      db.query(query1, (err, result) => {
        if (err) {
          logger.error("controller/adminDashboard/getEmpWiseData",err);
          reject(err);
        } else {
          //console.log("result",result)
          resolve(result);
        }
      });
    });

    const reportData = [];
    for (const user of users) {
      const query2 = "CALL GetEmpWiseData(?,?,?,?)";
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(
            query2,
            [user.empcode, subCatId,startDate,endDate],
            (err, result) => {
              if (err) {
              logger.error("controller/adminDashboard/getEmpWiseData",err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        reportData.push(result[0][0]);
      } catch (error) {
        logger.error("controller/adminDashboard/getEmpWiseData",error.message);
        // Handle the error here, but don't send a response in the loop.
      }
    }

    logger.info("Employee Report get Successfully");
    res.status(200).json(reportData); // Send both data and total count
  } catch (error) {
    logger.error("controller/adminDashboard/getEmpWiseData",error.message);
    res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred",
    });
  }
};



exports.getFirstLine = async (req, res) => {

  const query =
    "select user_id,name,empcode,reporting from user_mst1 where role = 4 and status ='Y'";

//   const query = `WITH RECURSIVE cte AS (
//     -- Base case: Select the topmost employee
//     SELECT user_id, name, empcode, role, reporting
//     FROM user_mst1
//     WHERE reporting =${empcode}
//       AND status = 'Y'

//     UNION ALL
//     SELECT u.user_id, u.name, u.empcode, u.role, u.reporting
//     FROM user_mst1 u
//     INNER JOIN cte c ON u.reporting = c.empcode
//     WHERE u.status = 'Y'
// )

// SELECT user_id, name, empcode, role
// FROM cte
// WHERE role = 5;
// `

  try {
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.getAllDataForEmp = async (req, res) => {

  const {subCatId,userId} = req.body
  const query =
    "CALL GetReportDataForEmp(?,?)";

  try {
    db.query(query,[subCatId,userId], (err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        const formattedResult = result[0].map((row) => ({
          ...row,
          camp_date: moment(row.camp_date).format('DD-MM-YYYY'), // Format the date here
        }));
      
        res.status(200).json(formattedResult);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.getPostOperativeAllData = async (req, res) => {

  const {userId} = req.body
  const query = ` select 'operative entry' AS report_type, operative_mst.doctor_name,operative_mst.camp_date,
 operative_mst.hospital_name,operative_mst.brand_replaced,operative_mst.brand_name,
operative_mst.center_name,
  operative_mst.address,
basic_mst.description,states.state_name,cities.city_name,zone_mst.zone_name,
user_mst1.name 
  from operative_mst 
  LEFT JOIN user_mst1 ON operative_mst.created_by = user_mst1.user_id
  LEFT JOIN basic_mst ON operative_mst.brand_name = basic_mst.basic_id 
   LEFT JOIN states ON operative_mst.state_id = states.id
 LEFT JOIN cities ON operative_mst.city_id = cities.id
  LEFT JOIN zone_mst ON operative_mst.zone_id = zone_mst.zone_id
  where operative_mst.created_by = ?  and operative_mst.status ='Y';`

  try {
    db.query(query,[userId], (err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        const formattedResult = result.map((row) => ({
          ...row,
          camp_date: moment(row.camp_date).format('DD-MM-YYYY'), // Format the date here
        }));
      
        res.status(200).json(formattedResult);
      }
    });
  } catch (error) {
    res.send(error);
  }
};


exports.getPostOperativeData = async (req, res) => {

  const {subCatId,userId,startDate,endDate} = req.body

  console.log("inside post operaitve", req.body);
  const query =
    "CALL GetPostOPerativeData(?,?,?,?)";

  try {
    db.query(query,[userId,subCatId,startDate,endDate], (err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred",
        });
      } else {
        console.log("inside get post operative data",result)
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.send(error);
  }
};
  


// user manegment api


exports.addEmployee = async (req, res) => {
  const { name, empcode, state, hq, designation, reporting, password, role,userId } =
    req.body;
    
    //console.log(req.body)
  const query =
    "insert into user_mst1(name,empcode,state,hq,designation,reporting,password,role,created_by) values(?,?,?,?,?,?,?,?,?)";
  try {
    db.query(
      query,
      [name, empcode, state, hq, designation, reporting, password, role, userId],
      (err, result) => {
        if (err) {
          logger.error(`error in addEmployee : ${err.message}`);
          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred",
          });
        } else {
          logger.info("Employee Added Successfully");

          res
            .status(200)
            .json({ message: "Employee Added Successfully", errorCode: "1" });
        }
      }
    );
  } catch (error) {
    logger.error(`error in addEmployee : ${error.message}`);
    res.send(error);
  }
};

exports.getAllEmployee = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const searchName = req.query.searchName || '';


  const query =`select user_id,name,empcode,hq,state,designation,reporting from user_mst1 where status = 'Y' and name LIKE '%${searchName}%' LIMIT ${limit} OFFSET ${offset}`
  totalRowCountQuery = `SELECT COUNT(*) as totalCount FROM user_mst1 where status = 'Y' and name LIKE '%${searchName}%'`;

  try {
    const users = await new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          logger.error(`error in getAllEmployee : ${err.message}`);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const totalRowCountResult = await new Promise((resolve, reject) => {
      db.query(totalRowCountQuery, (err, result) => {
        if (err) {
          logger.error(`error in getAllEmployee : ${err.message}`);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });

    res.status(200).json({users,totalCount:totalRowCountResult.totalCount})
  } catch (error) {
    logger.error(`error in getAllEmployee : ${error.message}`);
    res.send(error);
  }
};


exports.deleteEmployee = async (req, res) => {

    const {userId,delId} = req.body;
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    //const query = 'delete from user_mst1 where user_id =?'
    const query = 'update user_mst1 set status = "N",modified_by = ?, modified_date = ?  where user_id =?'

    try {
      db.query(query, [userId,currentDateTime,delId], (err, result) => {
        if (err) {
          logger.error(`error in deleteEmployee : ${err.message}`);

          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred"
          });
        }
        else{
        logger.info('Employee Delete Successfully');

          res.status(200).json({ message: "Employee Deleted Successfully",errorCode: "1"})
        } 
      });
    } catch (error) {
      logger.error(`error in deleteEmployee : ${error.message}`);
      res.send(error)
    }
  };

  exports.getEmployeeWithId = async (req, res) => {
    const userId = req.params.id;  
 
    const query = 'select * from user_mst1 where user_id = ? and status = "Y"'
    try {
      db.query(query, [userId], (err, result) => {
        if (err) {
          logger.error(`error in getEmployeeWithId : ${err.message}`);

          res.status(500).json({
            errorCode: "0",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred"
          });
        }
        else{
        logger.info('Fetch Employee Successfully');

          res.status(200).json({ user:result,errorCode: "1"})
        } 
      });
    } catch (error) {
      logger.error(`error in getEmployeeWithId : ${error.message}`);
      res.send(error)
    }
  };


  exports.UpdateEmployee = (req, res) => {
    const id = req.params.id;

    const { name, empcode, state, hq, designation, reporting, password, role,userId } = req.body;
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (empcode) {
      updateData.empcode = empcode;
    }
    if (state) {
      updateData.state = state;
    }
    if (hq) {
      updateData.hq = hq;
    }
    if (designation) {
      updateData.designation = designation;
    }
    if (reporting) {
      updateData.reporting = reporting;
    }
    if(password){
      updateData.password = password
    }
    if(role){
      updateData.role = role
    }
    updateData.modified_by = userId;
    updateData.modified_date = currentDateTime

  
    db.query("UPDATE user_mst1 SET ? WHERE user_id = ?", [updateData, id], (err, rows) => {
       try {
        if (err) {
          logger.error(`error in UpdateEmployee : ${err.message}`);
  
            res.status(500).json({
              errorCode: "0",
              errorDetail: err.message,
              responseData: {},
              status: "ERROR",
              details: "An internal server error occurred",
              getMessageInfo: "An internal server error occurred"
            });
          }
          else{
          logger.info('Employee Update Successfully');
  
            res.status(200).json({ message:"Employee Update Successfully",errorCode: "1"})
          }
       } catch (error) {
        logger.error(`error in UpdateEmployee : ${error.message}`);
        res.send(error)
       } 
    });
  };  

  
  