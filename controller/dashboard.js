const db = require("../config/db");
const json2csv = require('json2csv').Parser;
const moment = require('moment');
const logger = require('../utils/logger')
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');


exports.totalDoctor = async (req, res) => {
  const {userId} = req.body
  
  //const query = "SELECT COUNT(*) as doctor_count FROM doctor_mst WHERE user_id=?;";
  const query =  'CALL GetTotalDoctorCount(?)';
  try {
    db.query(query,[userId], (err, result) => {
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
        logger.info('Fetched total doctors');
        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    logger.error(error.message);
    res.json(error);
  }
};


exports.totalCamps = async (req, res) => {
    //const query = "SELECT COUNT(*) as camp_count FROM doctor_camp_mapping where user_id =?";
    const {userId} = req.body
  const query = 'CALL GetTotalCampCount(?)';

    try {
      db.query(query,[userId], (err, result) => {
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
        logger.info('Fetched total Camps');

          res.status(200).json(result[0]);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };

  exports.totalCampsWithSubCatId = async (req, res) => {
    const { subCatId, userId } = req.body;
    //const query = "SELECT COUNT(*) as camp_count FROM doctor_camp_mapping WHERE subcat_id =?";
    const query = 'CALL GetTotalCampsWithSubCatId(?,?)';
    try {
      db.query(query,[subCatId,userId] ,(err, result) => {
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
        logger.info('Fetched total Camps with respect to user');

          res.status(200).json(result[0]);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };


  exports.totalPaScreened = async (req, res) => {
    const { subCatId, userId } = req.body;
   
    //const query = 'SELECT SUM(answer) as screened_count FROM question_camp_rep_mapping WHERE rqid=1 AND subcat_id=? and created_by=?;'
   const query = 'CALL GetTotalPaScreened(?,?)'
    try {
      db.query(query,[subCatId,userId] ,(err, result) => {
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
          logger.info('Fetched total patient screened');

          res.status(200).json(result[0]);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };


  exports.totalPaDiagnosed = async (req, res) => {
    const { subCatId, userId } = req.body;
    //const query = 'SELECT SUM(answer) as diagnosed_count FROM question_camp_rep_mapping WHERE rqid=2 AND subcat_id=?;'
     
    const query = 'CALL GetTotalPaDiagnosed(?,?)'
    try {
      db.query(query,[subCatId,userId] ,(err, result) => {
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
        logger.info('Fetched total patients diagnosed');

          res.status(200).json(result[0]);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };





  // exports.getFilterCampReportCsv = async (req, res) => {
  //   const id = req.params.id
  //   const query =
  //     'SELECT camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE camp_report_mst.crid=?';
  
  //   try {
  //     db.query(query,[id], (err, result) => {
  //       if (err) {
  //         res.status(500).json({
  //           errorCode: 'INTERNAL_SERVER_ERROR',
  //           errorDetail: err.message,
  //           responseData: {},
  //           status: 'ERROR',
  //           details: 'An internal server error occurred',
  //           getMessageInfo: 'An internal server error occurred',
  //         });
  //       } else {
  //         // Create an object to store the transformed data
  //         const transformedData = {};
  
  //         // Loop through the result to group by doctor_name and camp_date
  //         result.forEach((row) => {
  //           const { doctor_name, camp_date,created_date, rqid, answer } = row;
  //           if (!transformedData[doctor_name]) {
  //             transformedData[doctor_name] = {
  //               doctor_name,
  //               camp_date,
  //               created_date,
  //               question: [],
  //             };
  //           }
  
  //           // Add the question object to the question array
  //           transformedData[doctor_name].question.push({ rqid, answer });
  //         });
  
  //         // Convert the object values into an array
  //         const transformedArray = Object.values(transformedData);
  
  //         res.status(200).json(transformedArray);
  //       }
  //     });
  //   } catch (error) {
  //     res.json(error);
  //   }
  // };
  


// exports.getFilterCampReportCsv = async (req, res) => {
//   const id = req.params.id;
//   const query =
//     'SELECT camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE camp_report_mst.crid=?';

//   try {
//     db.query(query, [id], (err, result) => {
//       if (err) {
//         res.status(500).json({
//           errorCode: 'INTERNAL_SERVER_ERROR',
//           errorDetail: err.message,
//           responseData: {},
//           status: 'ERROR',
//           details: 'An internal server error occurred',
//           getMessageInfo: 'An internal server error occurred',
//         });
//       } else {
//         // Create an object to store the transformed data
//         const transformedData = {};

//         // Loop through the result to group by doctor_name and camp_date
//         result.forEach((row) => {
//           const { doctor_name, camp_date, created_date, rqid, answer } = row;
//           if (!transformedData[doctor_name]) {
//             transformedData[doctor_name] = {
//               doctor_name,
//               camp_date,
//               created_date,
//               question: [],
//             };
//           }

//           // Add the answer to the question array
//           transformedData[doctor_name].question.push(answer);
//         });

//         // Convert the object values into an array
//         const transformedArray = Object.values(transformedData);

//         // Define the fields for CSV columns
//         const fields = ['Doctor Name', 'Camp Date', 'CampCreatedDate', 'No of Patient Screened ', 'No of Patient Diagnosed', 'No of Prescription Generated'];

//         // Create a JSON to CSV parser
//         const json2csvParser = new json2csv({ fields });

//         // Convert the data to CSV format
//         const csv = json2csvParser.parse(transformedArray);

//         // Set the response headers for CSV download
//         res.header('Content-Type', 'text/csv');
//         res.attachment('camp_report.csv');

//         // Send the CSV data as the response
//         res.status(200).send(csv);
//       }
//     });
//   } catch (error) {
//     res.json(error);
//   }
// };

// exports.getFilterCampReportCsvWithId = async (req, res) => {
//   const {crid} = req.query
// // const query =
// //  'SELECT camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE camp_report_mst.crid=?';
// // working  const query = 'SELECT camp_report_mst.crid,camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,question_camp_rep_mapping.brand_id FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE camp_report_mst.crid=?;'
// // const query = 'CALL GetCampReportCsv(?,?)'

// const query = `SELECT
// crid,
// doctor_name,
// camp_date,
// created_date,
// rqid,
// answer,
// brand_id,
// GROUP_CONCAT(DISTINCT description) AS description
// FROM (
// SELECT
//     camp_report_mst.crid,
//     camp_report_mst.doctor_name,
//     camp_report_mst.camp_date,
//     camp_report_mst.created_date,
//     question_camp_rep_mapping.rqid,
//     question_camp_rep_mapping.answer,
//     question_camp_rep_mapping.brand_id,
//     basic_mst.description
// FROM
//     camp_report_mst
// INNER JOIN
//     question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid
// INNER JOIN
//     basic_mst ON FIND_IN_SET(basic_mst.basic_id, question_camp_rep_mapping.brand_id)
// WHERE
//     camp_report_mst.crid = ?
// ) AS subquery
// GROUP BY
// crid, doctor_name, camp_date, created_date, rqid, answer, brand_id;
// `
// try {
//   db.query(query, [crid], (err, result) => {
//     if (err) {
//       logger.error(err.message);

//       res.status(500).json({
//         errorCode: '0',
//         errorDetail: err.message,
//         responseData: {},
//         status: 'ERROR',
//         details: 'An internal server error occurred',
//         getMessageInfo: 'An internal server error occurred',
//       });
//     } else {
//       // Create an object to store the transformed data
//       const transformedData = {};
//       console.log("for brand id",result)   
//       // Loop through the result to group by doctor_name and camp_date
//       result.forEach((row) => {
//         const { doctor_name, camp_date, created_date, rqid, answer,description } = row;

//         const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
//         const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
//         if (!transformedData[doctor_name]) {
//           transformedData[doctor_name] = {
//             'Doctor Name': doctor_name,
//             'Camp Date': formattedDate2,
//             'Camp Created Date': formattedDate,
//             'Brand Name': description,
//             'No of Patient Screened': 0,
//             'No of Patient Diagnosed': 0,
//             'No of Prescription Generated': 0,
//           };
//         }

//         // Add the answer to the corresponding field
//         if (rqid == 1 || rqid == 4 ||rqid == 7 ||rqid == 10 ||rqid == 13 ) {
//           transformedData[doctor_name]['No of Patient Screened'] = answer;
//         } else if (rqid === 2 || rqid === 5 || rqid === 8 || rqid === 11 || rqid === 15) {
//           transformedData[doctor_name]['No of Patient Diagnosed'] = answer;
//         } else if (rqid === 3 || rqid === 6 || rqid === 9 || rqid === 12 || rqid === 16) {
//           transformedData[doctor_name]['No of Prescription Generated'] = answer;
//         }


        
//       });

//       // Convert the object values into an array
//       console.log(transformedData);
//       const transformedArray = Object.values(transformedData);
      
//       // Define the fields for CSV columns
//       const fields = ['Doctor Name', 'Camp Date', 'Camp Created Date', 'Brand Name', 'No of Patient Screened', 'No of Patient Diagnosed', 'No of Prescription Generated'];

//       // Create a JSON to CSV parser
//       const json2csvParser = new json2csv({ fields });

//       // Convert the data to CSV format
//       const csv = json2csvParser.parse(transformedArray);

//       // Set the response headers for CSV download
//       res.header('Content-Type', 'text/csv');
//       res.attachment('camp_report.csv');

//       // Send the CSV data as the response
//       res.status(200).send(csv);
//     }
//   });
// } catch (error) {
//   logger.error(error.message);

//   res.json(error);
// }
// };


// usings this
// exports.getFilterCampReportCsv = async (req, res) => {
//     const {userId,subCatId} = req.query
//  // const query =
//   //  'SELECT camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE camp_report_mst.crid=?';
//    const query = 'SELECT camp_report_mst.crid,camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,question_camp_rep_mapping.brand_id FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE question_camp_rep_mapping.subcat_id=? and question_camp_rep_mapping.created_by=?;'
//   // const query = 'CALL GetCampReportCsv(?,?)'
//   try {
//     db.query(query, [subCatId,userId], (err, result) => {
//       if (err) {
//         logger.error(err.message);

//         res.status(500).json({
//           errorCode: '0',
//           errorDetail: err.message,
//           responseData: {},
//           status: 'ERROR',
//           details: 'An internal server error occurred',
//           getMessageInfo: 'An internal server error occurred',
//         });
//       } else {
//         // Create an object to store the transformed data
//         const transformedData = {};

//         // Loop through the result to group by doctor_name and camp_date
//         result.forEach((row) => {
//           const { doctor_name, camp_date, created_date, rqid, answer } = row;

//           const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
//           const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
//           if (!transformedData[doctor_name]) {
//             transformedData[doctor_name] = {
//               'Doctor Name': doctor_name,
//               'Camp Date': formattedDate2,
//               'Camp Created Date': formattedDate,
//               'No of Patient Screened': 0,
//               'No of Patient Diagnosed': 0,
//               'No of Prescription Generated': 0,
//             };
//           }

//           // Add the answer to the corresponding field
//           if (rqid === 1) {
//             transformedData[doctor_name]['No of Patient Screened'] = answer;
//           } else if (rqid === 2) {
//             transformedData[doctor_name]['No of Patient Diagnosed'] = answer;
//           } else if (rqid === 3) {
//             transformedData[doctor_name]['No of Prescription Generated'] = answer;
//           }
//         });

//         // Convert the object values into an array
//         const transformedArray = Object.values(transformedData);
        
//         // Define the fields for CSV columns
//         const fields = ['Doctor Name', 'Camp Date', 'Camp Created Date', 'No of Patient Screened', 'No of Patient Diagnosed', 'No of Prescription Generated'];

//         // Create a JSON to CSV parser
//         const json2csvParser = new json2csv({ fields });

//         // Convert the data to CSV format
//         const csv = json2csvParser.parse(transformedArray);

//         // Set the response headers for CSV download
//         res.header('Content-Type', 'text/csv');
//         res.attachment('camp_report.csv');

//         // Send the CSV data as the response
//         res.status(200).send(csv);
//       }
//     });
//   } catch (error) {
//     logger.error(error.message);

//     res.json(error);
//   }
// };

// working code
exports.getFilterCampReportCsv = async (req, res) => {
  const { userId,subCatId,startDate, endDate, filterBy,empcode } = req.body; 

  let query;

  if(subCatId ==1){
     query =`SELECT eye_report_mst.erid,eye_report_mst.doc_name1,eye_report_mst.doc_name2,
     eye_report_mst.doc_name3, eye_report_mst.doc_name4,
      eye_report_mst.camp_date, eye_report_mst.created_date,
      eye_report_mst.camp_location,eye_report_mst.camp_name,
      eye_report_mst.center_name,
      question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,
       states.state_name,cities.city_name,zone_mst.zone_name
      FROM eye_report_mst
       LEFT JOIN states ON eye_report_mst.state_id = states.id
       LEFT JOIN cities ON eye_report_mst.city_id = cities.id
       LEFT JOIN zone_mst ON eye_report_mst.zone_id = zone_mst.zone_id
       LEFT JOIN question_camp_rep_mapping ON eye_report_mst.erid = question_camp_rep_mapping.crid 
       where question_camp_rep_mapping.subcat_id = ?
        and question_camp_rep_mapping.created_by = ?
        and eye_report_mst.status = 'Y'`;
  }

  else if(subCatId ==2){
   query =`SELECT glaucoma_report_mst.grid, glaucoma_report_mst.camp_location,
    glaucoma_report_mst.doc_name1, glaucoma_report_mst.doc_name2,
    glaucoma_report_mst.doc_name3,glaucoma_report_mst.doc_name4,
    glaucoma_report_mst.doc_name3, glaucoma_report_mst.doc_name4,
    glaucoma_report_mst.camp_date, glaucoma_report_mst.created_date,
    glaucoma_report_mst.center_name,
    question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,
    states.state_name,cities.city_name,zone_mst.zone_name
    FROM glaucoma_report_mst 
    LEFT JOIN states ON glaucoma_report_mst.state_id = states.id
    LEFT JOIN cities ON glaucoma_report_mst.city_id = cities.id
    LEFT JOIN zone_mst ON glaucoma_report_mst.zone_id = zone_mst.zone_id
    LEFT JOIN question_camp_rep_mapping ON glaucoma_report_mst.grid = question_camp_rep_mapping.crid 
    where question_camp_rep_mapping.subcat_id = ? and question_camp_rep_mapping.created_by = ?
    and glaucoma_report_mst.status = 'Y'`;
  }

 
 try {
    db.query(query,[subCatId,userId], (err, result) => {
      if (err) {
      logger.error(err.message);

        res.status(500).json({
          errorCode: 'INTERNAL_SERVER_ERROR',
          errorDetail: err.message,
          responseData: {},
          status: 'ERROR',
          details: 'An internal server error occurred',
          getMessageInfo: 'An internal server error occurred',
        });
      } else {
        // Create an object to store the transformed data
        const transformedData = {};
         
       
        // Loop through the result to group by doctor_name and camp_date
          if(subCatId == 1){
            result.forEach((row) => {
              const { erid,doc_name1, doc_name2, doc_name3, doc_name4, camp_name, camp_location, zone_name,center_name,city_name, state_name, camp_date, created_date, rqid, answer} = row;
              console.log("row data1",row)
              //const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
                      //  const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
                        if (!transformedData[erid]) {
                          transformedData[erid] = {
                            'Doctor_Name1': doc_name1,
                            'Doctor_Name2': doc_name2,
                            'Doctor_Name3': doc_name3,
                            'Doctor_Name4': doc_name4,
                            'Camp_Center':center_name,
                            //'Camp_Location':camp_location,
                            'Zone':zone_name,
                            'City':city_name,
                            'State':state_name,
                            'Camp_Date': camp_date,
                            'Camp_Created_Date': created_date,
                            'No_of_Patient_Screened': 0,
                            'No_of_Patient_Diagnosed': 0,
                            'No_of_Rx_Generated': 0,
                          };
                        }
                         //console.log("rqid", rqid)
                        // Add the answer to the corresponding field
                        if (rqid == 1) {
                          transformedData[erid]['No_of_Patient_Screened'] = answer;
                        } else if (rqid === 2 ) {
                          transformedData[erid]['No_of_Patient_Diagnosed'] = answer;
                        } else if (rqid === 3 ) {
                          transformedData[erid]['No_of_Rx_Generated'] = answer;
                        }
            });
          }

          else if(subCatId == 2){

            console.log("iside subcat 2")
            result.forEach((row) => {
              const { grid,doc_name1, doc_name2, doc_name3, doc_name4, camp_date, center_name, zone_name,state_name,city_name, created_date, rqid, answer} = row;
              
              //const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
                      //  const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
                        if (!transformedData[grid]) {
                          transformedData[grid] = {
                            'Doctor_Name1': doc_name1,
                            'Doctor_Name2': doc_name2,
                            'Doctor_Name3': doc_name3,
                            'Doctor_Name4': doc_name4,
                            'Camp_Center':center_name,
                            //'Camp_Location':camp_location,
                            'Zone':zone_name,
                            'City':city_name,
                            'State':state_name,
                            'Camp_Date': camp_date,
                            'Camp_Created_Date': created_date,
                            'No_of_Patient_Screened': 0,
                            'No_of_Patient_Diagnosed': 0,
                            'No_of_Rx_Generated': 0,
                          };
                        }
                         //console.log("rqid", rqid)
                        // Add the answer to the corresponding field
                        if (rqid == 4) {
                          transformedData[grid]['No_of_Patient_Screened'] = answer;
                        } else if (rqid === 5 ) {
                          transformedData[grid]['No_of_Patient_Diagnosed'] = answer;
                        } else if (rqid === 6 ) {
                          transformedData[grid]['No_of_Rx_Generated'] = answer;
                        }
            });
          }
         
          
                  // Convert the object values into an array
                  const transformedArray = Object.values(transformedData);
                   
                  // Define the fields for CSV columns

                  let fields;
                  if(subCatId == 1){

                    fields = ['Doctor_Name1', 'Doctor_Name2','Doctor_Name3','Doctor_Name4','Camp_Center','Zone','City','State','Camp_Date', 'Camp_Created_Date', 'No_of_Patient_Screened', 'No_of_Patient_Diagnosed', 'No_of_Rx_Generated'];
                  }
                  else if(subCatId == 2){

                    fields = ['Doctor_Name1', 'Doctor_Name2','Doctor_Name3','Doctor_Name4','Camp_Center','Zone','City','State','Camp_Date', 'Camp_Created_Date', 'No_of_Patient_Screened', 'No_of_Patient_Diagnosed', 'No_of_Rx_Generated'];
                  }
                  else{
                    fields = ['Doctor_Name', 'Camp_Date', 'Camp_Created_Date', 'Brand_Name', 'Camp_Location', 'Hospital_Name'];

                  }

        // Apply different filters based on filterBy parameter
        let filteredData = [];

        if (filterBy === 'month') {
          // Filter by the last 30 days (month-wise)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          filteredData = transformedArray.filter((item) => {
            const itemDate = new Date(item.Camp_Date);
            return (
              (!startDate || itemDate >= new Date(startDate)) &&
              (!endDate || itemDate <= new Date(endDate)) &&
              itemDate >= thirtyDaysAgo
            );
          });
        } else if (filterBy === 'week') {
          // Filter by the last 7 days (week-wise)
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          filteredData = transformedArray.filter((item) => {
            const itemDate = new Date(item.Camp_Date);
            return (
              (!startDate || itemDate >= new Date(startDate)) &&
              (!endDate || itemDate <= new Date(endDate)) &&
              itemDate >= sevenDaysAgo
            );
          });
        } else {
          // Custom filter, use the provided start and end dates
          filteredData = transformedArray.filter((item) => {
            const itemDate = new Date(item.Camp_Date);
            return (
              (!startDate || itemDate >= new Date(startDate)) &&
              (!endDate || itemDate <= new Date(endDate))
            );
          });
        }

        // Sort the filtered data by created_date (ascending)
        filteredData.sort((a, b) => new Date(a.Camp_Date) - new Date(b.Camp_Date));
        
        const formattedResult = filteredData.map((item) => ({
          ...item,
          Camp_Date: moment(item.Camp_Date).format('DD-MM-YYYY'),
          Camp_Created_Date: moment(item.Camp_Created_Date).format('DD-MM-YYYY'), // Convert date format
           // Convert date format
        }));

        //console.log(formattedResult);
        const ws = XLSX.utils.json_to_sheet(formattedResult);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Camp Report');

        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('camp_report.xlsx');
        res.send(buffer)

       
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};


exports.getFilterCampReportCsvWithId = async (req, res) => {
  const {crId ,subCatId} = req.body; 

  let query;

  if(subCatId == 1){
    //  query =`SELECT eye_report_mst.erid,eye_report_mst.doc_name1,
    //  eye_report_mst.doc_name2,eye_report_mst.doc_name3,
    //   eye_report_mst.doc_name4, eye_report_mst.camp_date,
    //    eye_report_mst.created_date,eye_report_mst.camp_location,
    //    eye_report_mst.camp_name, question_camp_rep_mapping.rqid, 
    //    question_camp_rep_mapping.answer FROM eye_report_mst 
    //    INNER JOIN question_camp_rep_mapping ON 
    //    eye_report_mst.erid = question_camp_rep_mapping.crid and
    //     eye_report_mst.erid = ? and eye_report_mst.subcat_id = ?`;

        query =`SELECT eye_report_mst.erid,eye_report_mst.doc_name1,eye_report_mst.doc_name2,
        eye_report_mst.doc_name3, eye_report_mst.doc_name4,
         eye_report_mst.camp_date, eye_report_mst.created_date,
         eye_report_mst.camp_location,eye_report_mst.camp_name,
         eye_report_mst.center_name,
         question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,
          states.state_name,cities.city_name,zone_mst.zone_name
         FROM eye_report_mst
          LEFT JOIN states ON eye_report_mst.state_id = states.id
          LEFT JOIN cities ON eye_report_mst.city_id = cities.id
          LEFT JOIN zone_mst ON eye_report_mst.zone_id = zone_mst.zone_id
          LEFT JOIN question_camp_rep_mapping ON eye_report_mst.erid = question_camp_rep_mapping.crid 
          where  eye_report_mst.erid = ? and eye_report_mst.subcat_id = ?
           and eye_report_mst.status = 'Y'`;
  }

  else if(subCatId == 2){
  //  query =`SELECT glaucoma_report_mst.grid, 
  //  glaucoma_report_mst.camp_location, glaucoma_report_mst.doc_name1, 
  //  glaucoma_report_mst.doc_name2,glaucoma_report_mst.doc_name3,glaucoma_report_mst.doc_name4,glaucoma_report_mst.doc_name3, 
  //  glaucoma_report_mst.doc_name4, glaucoma_report_mst.camp_date, glaucoma_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer 
  //  FROM glaucoma_report_mst INNER JOIN question_camp_rep_mapping ON 
  //  glaucoma_report_mst.grid = question_camp_rep_mapping.crid and
  // glaucoma_report_mst.grid = ? and glaucoma_report_mst.subcat_id = ?`;


  query =`SELECT glaucoma_report_mst.grid, glaucoma_report_mst.camp_location,
  glaucoma_report_mst.doc_name1, glaucoma_report_mst.doc_name2,
  glaucoma_report_mst.doc_name3,glaucoma_report_mst.doc_name4,
  glaucoma_report_mst.doc_name3, glaucoma_report_mst.doc_name4,
  glaucoma_report_mst.camp_date, glaucoma_report_mst.created_date,
  glaucoma_report_mst.center_name,
  question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer,
  states.state_name,cities.city_name,zone_mst.zone_name
  FROM glaucoma_report_mst 
  LEFT JOIN states ON glaucoma_report_mst.state_id = states.id
  LEFT JOIN cities ON glaucoma_report_mst.city_id = cities.id
  LEFT JOIN zone_mst ON glaucoma_report_mst.zone_id = zone_mst.zone_id
  LEFT JOIN question_camp_rep_mapping ON glaucoma_report_mst.grid = question_camp_rep_mapping.crid 
  where  glaucoma_report_mst.grid = ? and glaucoma_report_mst.subcat_id = ?
  and glaucoma_report_mst.status = 'Y'`;
  }


 
 try {
    db.query(query,[crId,subCatId], (err, result) => {
      if (err) {
      logger.error(err.message);

        res.status(500).json({
          errorCode: 'INTERNAL_SERVER_ERROR',
          errorDetail: err.message,
          responseData: {},
          status: 'ERROR',
          details: 'An internal server error occurred',
          getMessageInfo: 'An internal server error occurred',
        });
      } else {
        // Create an object to store the transformed data
        const transformedData = {};
         
        //console.log("inside filterreport csv",result)
        // Loop through the result to group by doctor_name and camp_date
          if(subCatId == 1){
            result.forEach((row) => {
              const { erid,doc_name1, doc_name2, doc_name3, doc_name4, camp_name, camp_location,center_name,zone_name,city_name,state_name, camp_date, created_date, rqid, answer} = row;
              console.log("row data1",row)
              //const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
                      //  const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
                        if (!transformedData[erid]) {
                          transformedData[erid] = {
                            'Doctor_Name1': doc_name1,
                            'Doctor_Name2': doc_name2,
                            'Doctor_Name3': doc_name3,
                            'Doctor_Name4': doc_name4,
                            'Camp_Center':center_name,
                            //'Camp_Location':camp_location,
                            'Zone':zone_name,
                            'City':city_name,
                            'State':state_name,
                            'Camp_Date': camp_date,
                            'Camp_Created_Date': created_date,
                            'No_of_Patient_Screened': 0,
                            'No_of_Patient_Diagnosed': 0,
                            'No_of_Rx_Generated': 0,
                          };
                        }
                         //console.log("rqid", rqid)
                        // Add the answer to the corresponding field
                        if (rqid == 1) {
                          transformedData[erid]['No_of_Patient_Screened'] = answer;
                        } else if (rqid === 2 ) {
                          transformedData[erid]['No_of_Patient_Diagnosed'] = answer;
                        } else if (rqid === 3 ) {
                          transformedData[erid]['No_of_Rx_Generated'] = answer;
                        }
            });
          }

          else if(subCatId == 2){

            console.log("iside subcat 2")
            result.forEach((row) => {
              const { grid,doc_name1, doc_name2, doc_name3, doc_name4, camp_date, camp_location,center_name,zone_name,city_name,state_name, created_date, rqid, answer} = row;
              
              //const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
                      //  const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
                        if (!transformedData[grid]) {
                          transformedData[grid] = {
                            'Doctor_Name1': doc_name1,
                            'Doctor_Name2': doc_name2,
                            'Doctor_Name3': doc_name3,
                            'Doctor_Name4': doc_name4,
                            'Camp_Center':center_name,
                            //'Camp_Location':camp_location,
                            'Zone':zone_name,
                            'City':city_name,
                            'State':state_name,
                            'Camp_Date': camp_date,
                            'Camp_Created_Date': created_date,
                            'No_of_Patient_Screened': 0,
                            'No_of_Patient_Diagnosed': 0,
                            'No_of_Rx_Generated': 0,
                          };
                        }
                         //console.log("rqid", rqid)
                        // Add the answer to the corresponding field
                        if (rqid == 4) {
                          transformedData[grid]['No_of_Patient_Screened'] = answer;
                        } else if (rqid === 5 ) {
                          transformedData[grid]['No_of_Patient_Diagnosed'] = answer;
                        } else if (rqid === 6 ) {
                          transformedData[grid]['No_of_Rx_Generated'] = answer;
                        }
            });
          }
        
          
                  // Convert the object values into an array
                  const transformedArray = Object.values(transformedData);
                   
                  // Define the fields for CSV columns

                  let fields;
                  if(subCatId == 1){

                    fields = ['Doctor_Name1', 'Doctor_Name2','Doctor_Name3','Doctor_Name4','Camp_Center','Zone','City','State','Camp_Date', 'Camp_Created_Date', 'No_of_Patient_Screened', 'No_of_Patient_Diagnosed', 'No_of_Rx_Generated'];
                  }
                  else if(subCatId == 2){

                    fields = ['Doctor_Name1', 'Doctor_Name2','Doctor_Name3','Doctor_Name4','Camp_Center','Zone','City','State','Camp_Date', 'Camp_Created_Date', 'No_of_Patient_Screened', 'No_of_Patient_Diagnosed', 'No_of_Rx_Generated'];
                  }
                  else{
                    fields = ['Doctor_Name', 'Camp_Date', 'Camp_Created_Date', 'Brand_Name', 'Camp_Location', 'Hospital_Name'];

                  }

       
      

        const formattedResult = transformedArray.map((item) => ({
          ...item,
          Camp_Date: moment(item.Camp_Date).format('DD-MM-YYYY'),
          Camp_Created_Date: moment(item.Camp_Created_Date).format('DD-MM-YYYY'), // Convert date format
           // Convert date format
        }));
        
        const ws = XLSX.utils.json_to_sheet(formattedResult);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Camp Report');

        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('camp_report.xlsx');
        res.send(buffer)

     
        // const json2csvParser = new json2csv({ fields });

        // // Convert the data to CSV format
        // const csv = json2csvParser.parse(formattedResult);

        // // Set the response headers for CSV download
        // res.header('Content-Type', 'text/csv');
        // res.attachment('camp_report.csv');

        // // Send the CSV data as the response
        // res.status(200).send(csv);
        
      }
    });
  } catch (error) {
    logger.error(error.message);

    res.json(error);
  }
};

// exports.getFilterCampReportCsv = async (req, res) => {
//   const { userId,subCatId,startDate, endDate, filterBy,empcode } = req.body; 

// const query ='SELECT eye_report_mst.erid,eye_report_mst.doc_name1, eye_report_mst.camp_date, eye_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM eye_report_mst LEFT JOIN question_camp_rep_mapping ON eye_report_mst.erid = question_camp_rep_mapping.crid;';
// //const query = 'SELECT camp_report_mst.crid,camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.user_id AND camp_report_mst.subcat_id = question_camp_rep_mapping.created_by AND question_camp_rep_mapping.subcat_id where camp_report_mst.user_id =1 AND camp_report_mst.subcat_id=1;'
 
// //  const query1 = `WITH RECURSIVE EmployeeHierarchy AS (
// //   SELECT user_id, empcode, name, reporting
// //   FROM user_mst1
// //   WHERE reporting =${empcode}
// //   UNION ALL
// //   SELECT e.user_id, e.empcode, e.name, e.reporting
// //   FROM user_mst1 e
// //   INNER JOIN EmployeeHierarchy eh ON e.reporting = eh.empcode
// // )
// // SELECT user_id, empcode, name
// // FROM EmployeeHierarchy
// // WHERE reporting IS NOT NULL;`;

 
//  try {
//     db.query(query, (err, result) => {
//       if (err) {
//       logger.error(err.message);

//         res.status(500).json({
//           errorCode: 'INTERNAL_SERVER_ERROR',
//           errorDetail: err,
//           responseData: {},
//           status: 'ERROR',
//           details: 'An internal server error occurred',
//           getMessageInfo: 'An internal server error occurred',
//         });
//       } else {
//         // Create an object to store the transformed data
//         const filterEmpId = result.map((employee)=>employee.user_id);
//         filterEmpId.unshift(userId)
//  //const query = 'SELECT camp_report_mst.crid,camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE question_camp_rep_mapping.subcat_id=? and question_camp_rep_mapping.created_by IN (?);'
//  const query = `SELECT
//  crid,
//  doctor_name,
//  camp_date,
//  created_date,
//  rqid,
//  answer,
//  brand_id,
//  GROUP_CONCAT(DISTINCT description) AS description
//  FROM (
//  SELECT
//      camp_report_mst.crid,
//      camp_report_mst.doctor_name,
//      camp_report_mst.camp_date,
//      camp_report_mst.created_date,
//      question_camp_rep_mapping.rqid,
//      question_camp_rep_mapping.answer,
//      question_camp_rep_mapping.brand_id,
//      basic_mst.description
//  FROM
//      camp_report_mst
//  INNER JOIN
//      question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid
//  INNER JOIN
//      basic_mst ON FIND_IN_SET(basic_mst.basic_id, question_camp_rep_mapping.brand_id)
//  WHERE
//   question_camp_rep_mapping.subcat_id=? and question_camp_rep_mapping.created_by IN (?)
//  ) AS subquery
//  GROUP BY
//  crid, doctor_name, camp_date, created_date, rqid, answer, brand_id;
//  `   
//         try {
//               db.query(query,[subCatId,filterEmpId], (err, result) => {
//                 if (err) {
//                 logger.error(err.message);
          
//                   res.status(500).json({
//                     errorCode: 'INTERNAL_SERVER_ERROR',
//                     errorDetail: err,
//                     responseData: {},
//                     status: 'ERROR',
//                     details: 'An internal server error occurred',
//                     getMessageInfo: 'An internal server error occurred',
//                   });
//                 } else {
//                   // Create an object to store the transformed data
//                   const transformedData = {};
                   
//                   //console.log(result)
//                   // Loop through the result to group by doctor_name and camp_date
//                   result.forEach((row) => {
//                     const { doctor_name, camp_date, created_date, rqid, answer, description } = row;
          
//                     //const formattedDate = moment(created_date).format('DD-MM-YYYY hh:mm:ss a');
//                             //  const formattedDate2 = moment(camp_date).format('DD-MM-YYYY hh:mm:ss a');
//                               if (!transformedData[doctor_name]) {
//                                 transformedData[doctor_name] = {
//                                   'Doctor_Name': doctor_name,
//                                   'Camp_Date': camp_date,
//                                   'Camp_Created_Date': created_date,
//                                   'Brand_Name':description,
//                                   'No_of_Patient_Screened': 0,
//                                   'No_of_Patient_Diagnosed': 0,
//                                   'No_of_Prescription_Generated': 0,
//                                 };
//                               }
                    
//                               // Add the answer to the corresponding field
//                               if (rqid == 1 || rqid == 4 ||rqid == 7 ||rqid == 10 ||rqid == 13 ) {
//                                                       transformedData[doctor_name]['No_of_Patient_Screened'] = answer;
//                                                     } else if (rqid === 2 || rqid === 5 || rqid === 8 || rqid === 11 || rqid === 15) {
//                                                       transformedData[doctor_name]['No_of_Patient_Diagnosed'] = answer;
//                                                     } else if (rqid === 3 || rqid === 6 || rqid === 9 || rqid === 12 || rqid === 16) {
//                                                       transformedData[doctor_name]['No_of_Prescription_Generated'] = answer;
//                                                     }
//                             });
                    
//                             // Convert the object values into an array
//                             const transformedArray = Object.values(transformedData);
//                              console.log("a2",transformedArray)
//                             // Define the fields for CSV columns
//                             const fields = ['Doctor_Name', 'Camp_Date', 'Camp_Created_Date','Brand_Name', 'No_of_Patient_Screened', 'No_of_Patient_Diagnosed', 'No_of_Prescription_Generated'];
          
//                   // Apply different filters based on filterBy parameter
//                   let filteredData = [];
          
//                   if (filterBy === 'month') {
//                     // Filter by the last 30 days (month-wise)
//                     const thirtyDaysAgo = new Date();
//                     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
//                     filteredData = transformedArray.filter((item) => {
//                       const itemDate = new Date(item.Camp_Date);
//                       return (
//                         (!startDate || itemDate >= new Date(startDate)) &&
//                         (!endDate || itemDate <= new Date(endDate)) &&
//                         itemDate >= thirtyDaysAgo
//                       );
//                     });
//                   } else if (filterBy === 'week') {
//                     // Filter by the last 7 days (week-wise)
//                     const sevenDaysAgo = new Date();
//                     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
//                     filteredData = transformedArray.filter((item) => {
//                       const itemDate = new Date(item.Camp_Date);
//                       return (
//                         (!startDate || itemDate >= new Date(startDate)) &&
//                         (!endDate || itemDate <= new Date(endDate)) &&
//                         itemDate >= sevenDaysAgo
//                       );
//                     });
//                   } else {
//                     // Custom filter, use the provided start and end dates
//                     filteredData = transformedArray.filter((item) => {
//                       const itemDate = new Date(item.Camp_Date);
//                       return (
//                         (!startDate || itemDate >= new Date(startDate)) &&
//                         (!endDate || itemDate <= new Date(endDate))
//                       );
//                     });
//                   }
          
//                   // Sort the filtered data by created_date (ascending)
//                   filteredData.sort((a, b) => new Date(a.Camp_Date) - new Date(b.Camp_Date));
//                   console.log("filterdata",filteredData)
//                   const formattedResult = filteredData.map((item) => ({
//                     ...item,
//                     Camp_Date: moment(item.Camp_Date).format('DD-MM-YYYY'),
//                     Camp_Created_Date: moment(item.Camp_Created_Date).format('DD-MM-YYYY'), // Convert date format
//                      // Convert date format
//                   }));
//                   //const fields = ['doctor_name', 'camp_date', 'created_date', 'No of Patient Screened', 'No of Patient Diagnosed', 'No of Prescription Generated'];
//                   const json2csvParser = new json2csv({ fields });
                  
//                   // Convert the data to CSV format
//                   const csv = json2csvParser.parse(formattedResult);
                  
//                   // Set the response headers for CSV download
//                   res.header('Content-Type', 'text/csv');
//                   res.attachment('camp_report.csv');
                  
//                   // Send the CSV data as the response
//                   res.status(200).send(csv);
                  
//                 }
//               });
//             } catch (error) {
//               logger.error(error.message);
          
//               res.json(error);
//             }
        
//       }
//     });
//   } catch (error) {
//     logger.error(error.message);

//     res.json(error);
//   }
// };

// working code
  exports.getFilterCampReport = async (req, res) => {
    const { userId,subCatId,startDate, endDate, filterBy } = req.body; 
  
    let query;
    if(subCatId == 1){
       query = 'SELECT erid, doc_name1, doc_name2, doc_name3, doc_name4, camp_date, created_date from eye_report_mst WHERE subcat_id= ? and created_by=? and status = "Y";'
    }
    else if(subCatId == 2){
      query = 'SELECT grid, doc_name1, doc_name2, doc_name3, doc_name4, camp_date, created_date from glaucoma_report_mst WHERE subcat_id= ? and created_by=? and status = "Y";'
   }
//    else if(subCatId == 3){
//     query = 'SELECT orid, doctor_name, camp_date, created_date from operative_mst WHERE subcat_id= ? and created_by=? and status = "Y";'
//  }
 
   

   

  
   try {
      db.query(query,[subCatId,userId], (err, result) => {
        if (err) {
        logger.error(err.message);

          res.status(500).json({
            errorCode: 'INTERNAL_SERVER_ERROR',
            errorDetail: err.message,
            responseData: {},
            status: 'ERROR',
            details: 'An internal server error occurred',
            getMessageInfo: 'An internal server error occurred',
          });
        } else {
          // Create an object to store the transformed data
          const transformedData = {};
  
          // Loop through the result to group by doctor_name and camp_date
         if(subCatId == 1){
          result.forEach((row) => {
            const { erid,doc_name1, doc_name2, doc_name3, doc_name4, camp_date, created_date } = row;
            if (!transformedData[erid]) {
              transformedData[erid] = {
                erid,
                doc_name1,
                doc_name2,
                doc_name3,
                doc_name4,
                camp_date,
                created_date, 
              };
            }
  
            // Add the question object to the question array
            //transformedData[erid].question.push({ rqid, answer });
          });
         }
         else if(subCatId == 2){
          result.forEach((row) => {
            const { grid,doc_name1, doc_name2, doc_name3, doc_name4, camp_date, created_date } = row;
            if (!transformedData[grid]) {
              transformedData[grid] = {
                grid,
                doc_name1,
                doc_name2,
                doc_name3,
                doc_name4,
                camp_date,
                created_date, 
              };
            }
  
            // Add the question object to the question array
            //transformedData[erid].question.push({ rqid, answer });
          });
         }

        //  else if(subCatId == 3){
        //   result.forEach((row) => {
        //     const { orid,doctor_name , camp_date, created_date } = row;
        //     if (!transformedData[orid]) {
        //       transformedData[orid] = {
        //         orid,
        //         doctor_name,
        //         camp_date,
        //         created_date, 
        //       };
        //     }
  
        //     // Add the question object to the question array
        //     //transformedData[erid].question.push({ rqid, answer });
        //   });
        //  }
  
          // Convert the object values into an array
          const transformedArray = Object.values(transformedData);
          
          
          // Apply different filters based on filterBy parameter
          let filteredData = [];
  
          if (filterBy === 'month') {
            // Filter by the last 30 days (month-wise)
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
        
            filteredData = transformedArray.filter((item) => {
                const itemDate = new Date(item.camp_date);
                return (
                   
                    itemDate >= thirtyDaysAgo &&
                    itemDate <= today // Add this condition to filter till today's date
                );
            });
        } else if (filterBy === 'week') {
            // Filter by the last 7 days (week-wise)
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
  
            filteredData = transformedArray.filter((item) => {
              const itemDate = new Date(item.camp_date);
              return (
                
                itemDate >= sevenDaysAgo &&
                itemDate <= today 
              );
            });
          } else {
            // Custom filter, use the provided start and end dates
            filteredData = transformedArray.filter((item) => {
              const itemDate = new Date(item.camp_date);
              return (
                (!startDate || itemDate >= new Date(startDate)) &&
                (!endDate || itemDate <= new Date(endDate))
              );
            });
          }
  
          // Sort the filtered data by created_date (ascending)
          filteredData.sort((a, b) => new Date(a.camp_date) - new Date(b.camp_date));
  
          res.status(200).json(filteredData);
        }
      });
    } catch (error) {
      logger.error(error.message);

      res.json(error);
    }
  };


//   exports.getFilterCampReport = async (req, res) => {
//    const { userId,subCatId,startDate, endDate, filterBy,empcode } = req.body; 

//    const query1 = `WITH RECURSIVE EmployeeHierarchy AS (
//     SELECT user_id, empcode, name, reporting
//     FROM user_mst1
//     WHERE reporting =${empcode}
//     UNION ALL
//     SELECT e.user_id, e.empcode, e.name, e.reporting
//     FROM user_mst1 e
//     INNER JOIN EmployeeHierarchy eh ON e.reporting = eh.empcode
// )
// SELECT user_id, empcode, name
// FROM EmployeeHierarchy
// WHERE reporting IS NOT NULL;`;
  
   
   
//    //const query = 'CALL GetFilterCampReport(?,?)'
   
//    try {
//       db.query(query1, (err, result) => {
//         if (err) {
//         logger.error(err.message);

//           res.status(500).json({
//             errorCode: 'INTERNAL_SERVER_ERROR',
//             errorDetail: err.message,
//             responseData: {},
//             status: 'ERROR',
//             details: 'An internal server error occurred',
//             getMessageInfo: 'An internal server error occurred',
//           });
//         } else {
//           // Create an object to store the transformed data
//               //console.log(result)
//           const filterEmpId = result.map((employee)=>employee.user_id);
//           filterEmpId.unshift(userId)
//           //console.log(filterEmpId);
//           //const query2 = 'SELECT camp_report_mst.crid, camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE question_camp_rep_mapping.subcat_id=? AND question_camp_rep_mapping.created_by=? AND camp_report_mst.user_id IN (?);';
//           const query = 'SELECT camp_report_mst.crid,camp_report_mst.doctor_name, camp_report_mst.camp_date, camp_report_mst.created_date, question_camp_rep_mapping.rqid, question_camp_rep_mapping.answer FROM camp_report_mst INNER JOIN question_camp_rep_mapping ON camp_report_mst.crid = question_camp_rep_mapping.crid WHERE question_camp_rep_mapping.subcat_id=? and question_camp_rep_mapping.created_by IN (?);'
            
//           try {
//                 db.query(query,[subCatId,filterEmpId], (err, result) => {
//                   if (err) {
//                   logger.error(err.message);
          
//                     res.status(500).json({
//                       errorCode: 'INTERNAL_SERVER_ERROR',
//                       errorDetail: err.message,
//                       responseData: {},
//                       status: 'ERROR',
//                       details: 'An internal server error occurred',
//                       getMessageInfo: 'An internal server error occurred',
//                     });
//                   } else {
//                     // Create an object to store the transformed data
//                     const transformedData = {};
            
//                     // Loop through the result to group by doctor_name and camp_date
//                     result.forEach((row) => {
//                       const { crid,doctor_name, camp_date, created_date, rqid, answer } = row;
//                       if (!transformedData[doctor_name]) {
//                         transformedData[doctor_name] = {
//                           crid,
//                           doctor_name,
//                           camp_date,
//                           created_date,
//                           question: [],
//                         };
//                       }
            
//                       // Add the question object to the question array
//                       transformedData[doctor_name].question.push({ rqid, answer });
//                     });
            
//                     // Convert the object values into an array
//                     const transformedArray = Object.values(transformedData);
                    
                    
//                     // Apply different filters based on filterBy parameter
//                     let filteredData = [];
            
//                     if (filterBy === 'month') {
//                       // Filter by the last 30 days (month-wise)
//                       const thirtyDaysAgo = new Date();
//                       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
//                       filteredData = transformedArray.filter((item) => {
//                         const itemDate = new Date(item.camp_date);
//                         return (
//                           (!startDate || itemDate >= new Date(startDate)) &&
//                           (!endDate || itemDate <= new Date(endDate)) &&
//                           itemDate >= thirtyDaysAgo
//                         );
//                       });
//                     } else if (filterBy === 'week') {
//                       // Filter by the last 7 days (week-wise)
//                       const sevenDaysAgo = new Date();
//                       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
//                       filteredData = transformedArray.filter((item) => {
//                         const itemDate = new Date(item.camp_date);
//                         return (
//                           (!startDate || itemDate >= new Date(startDate)) &&
//                           (!endDate || itemDate <= new Date(endDate)) &&
//                           itemDate >= sevenDaysAgo
//                         );
//                       });
//                     } else {
//                       // Custom filter, use the provided start and end dates
//                       filteredData = transformedArray.filter((item) => {
//                         const itemDate = new Date(item.camp_date);
//                         return (
//                           (!startDate || itemDate >= new Date(startDate)) &&
//                           (!endDate || itemDate <= new Date(endDate))
//                         );
//                       });
//                     }
            
//                     // Sort the filtered data by created_date (ascending)
//                     filteredData.sort((a, b) => new Date(a.camp_date) - new Date(b.camp_date));
            
//                     res.status(200).json(filteredData);
//                   }
//                 });
//               } catch (error) {
//                 logger.error(error.message);
          
//                 res.json(error);
//               }
//         }
//       });
//     } catch (error) {
//       logger.error(error.message);

//       res.json(error);
//     }
//   };
 



const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const convertMonthNumberToName = (monthNumber) => {
  return monthNames[monthNumber - 1];
};


exports.totalCampCount = async (req, res) => {
   
  const {userId,subCatId} = req.body;
  
  let query;
  if(subCatId == 1){
    query = `
    SELECT
    COUNT(*) as Camp_Count,
    MONTH(camp_date) AS report_month,
    YEAR(camp_date) AS report_year
  FROM
    eye_report_mst
  WHERE
    camp_date >= CURDATE() - INTERVAL 6 MONTH
    AND created_by = ? and subcat_id = ? and status = 'Y'
  GROUP BY
    YEAR(camp_date), MONTH(camp_date);
      `
  }

  else if(subCatId == 2){
    query = `
    SELECT
    COUNT(*) as Camp_Count,
    MONTH(camp_date) AS report_month,
    YEAR(camp_date) AS report_year
  FROM
    glaucoma_report_mst
  WHERE
    camp_date >= CURDATE() - INTERVAL 6 MONTH
    AND created_by = ? and subcat_id = ? and status = 'Y'
  GROUP BY
    YEAR(camp_date), MONTH(camp_date);
      `
  }

  // else {
  //   query = `
  //   SELECT
  //   COUNT(*) as Camp_Count,
  //   MONTH(camp_date) AS report_month,
  //   YEAR(camp_date) AS report_year
  // FROM
  //   operative_mst
  // WHERE
  //   camp_date >= CURDATE() - INTERVAL 6 MONTH
  //   AND created_by = ? and subcat_id = ? and status = 'Y'
  // GROUP BY
  //   YEAR(camp_date), MONTH(camp_date);
  //     `
  // }
  
  

  try {
    db.query(query,[userId,subCatId],(err, result) => {
      if (err) {
        logger.error(`Error in /controller/dashboard/totalCampCount: ${err.message}. SQL query: ${query}`);
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
         
        const sortedData = result.sort((a, b) => {
          // If years are different, sort by year
          if (a.report_year !== b.report_year) {
              return a.report_year - b.report_year;
          }
          // If years are the same, sort by month
          return a.report_month - b.report_month;
      });

      const xValues = sortedData.map(item => `${convertMonthNumberToName(item.report_month)} ${item.report_year}`);
      const yValues = sortedData.map(item => ({ y: item.Camp_Count }));
  
   

      res.status(200).json({xValues,yValues});
        //res.status(200).json(result);
      }
    });
  } catch (error) {
    logger.error(`Error in /controller/dashboard/totalCampCount: ${err.message}.`);
    res.json(error);
  }
};