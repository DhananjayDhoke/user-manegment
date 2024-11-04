
const db = require("../config/db")
const moment = require('moment');
const logger = require('../utils/logger')
const fs = require('fs');
const path = require('path');

exports.addReportWithInfo = async (req, res) => {  
  const {campName,campDate,centerType,campCenter,address,state,city,zone,mrcode,doc1,doc2,doc3,doc4,userId,subCatId} = req.body;
  const formattedCampDate = moment(campDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const query = 'insert into eye_report_mst (camp_name,camp_date,center_type,center_name, address,state_id, city_id, zone_id, mr_code,doc_name1,doc_name2,doc_name3,doc_name4,subcat_id,created_by,modified_by) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  
  //const query = 'CALL AddCampReportWithInfo(?, ?, ?, ?, ?)'
  try {
    db.query(query, [campName,formattedCampDate,centerType,campCenter,address,state,city,zone,mrcode,doc1,doc2,doc3,doc4,subCatId,userId,userId], (err, result) => {
      if (err) {
        logger.error(`Error in /controller/eyereport/addReportWithInfo: ${err.message}. SQL query: ${query}`);
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
        const ecrid = result.insertId;
        logger.info('Eye Camp Report added Successfully');

        res.status(200).json({ message: "Eye Camp Report Added Successfully",errorCode: "1",ecrid})
      } 
    });
  } catch (error) {
    logger.error(`Error in /controller/eyereport/addReportWithInfo: ${error.message}`);
    res.send(error)
  }
};

exports.updateReportWithInfo = async (req,res)=>{
  
  const {campName,campDate,centerType,campCenter,address,state,city,zone,mrcode,doc1,doc2,doc3,doc4,userId,erId} = req.body;
  
  const formattedCampDate = moment(campDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
   const query = 'CALL UpdateEyeCampReportWithInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  try {
    db.query(query, [erId, campName,formattedCampDate,centerType,campCenter,address,state,city,zone,mrcode,doc1,doc2,doc3,doc4,userId], (err, result) => {
      if (err) {
        console.log(err)
        logger.error(`Error in /controller/eyereport/updateReportWithInfo: ${err.message}. SQL query: ${query}`);
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
        logger.info('Report Updated Successfully');

        res.status(200).json({
           message: "ReportInfo Update Successfully",
           errorCode: "1"
          })
      } 
    });
  } catch (error) {
    logger.error(`Error in /controller/eyereport/updateReportWithInfo: ${error.message}.`);
    res.send(error)
  }
}


exports.getReportInfoWithId = async (req, res) => {
  const {erId} = req.body;
  const query = `select eye_report_mst.camp_name,
  eye_report_mst.camp_date,eye_report_mst.center_type,eye_report_mst.center_name,
  eye_report_mst.address,eye_report_mst.city_id,eye_report_mst.zone_id,
  eye_report_mst.state_id,eye_report_mst.mr_code,
  eye_report_mst.doc_name1,eye_report_mst.doc_name2,eye_report_mst.doc_name3,
  eye_report_mst.doc_name4,eye_report_mst.subcat_id,eye_report_mst.created_by,
  center_mst.center_name,
  states.state_name,cities.city_name,zone_mst.zone_name,
  user_mst1.name
  from eye_report_mst
  LEFT JOIN center_mst ON eye_report_mst.center_type = center_mst.cid
  LEFT JOIN states ON eye_report_mst.state_id = states.id
  LEFT JOIN cities ON eye_report_mst.city_id = cities.id
  LEFT JOIN zone_mst ON eye_report_mst.zone_id = zone_mst.zone_id
  LEFT JOIN user_mst1 ON eye_report_mst.mr_code = user_mst1.empcode
  where eye_report_mst.erid = ? and eye_report_mst.status ='Y'`
  
  try {
    db.query(query,[erId],(err, result) => {
      if (err) {
        logger.error(`Error in /controller/eyereport/getReportInfoWithId: ${err.message}. SQL query: ${query}`);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
        const formattedResult = result.map((row) => ({
          ...row,
          camp_date: moment(row.camp_date).format('DD-MM-YYYY'), // Format the date here
        }));
        logger.info('Fetched camp Report Successfully');
        
        res.status(200).json(formattedResult);
      } 
    });
  } catch (error) {
    logger.error(`Error in /controller/eyereport/getReportInfoWithId: ${error.message}.`);
    res.send(error)
  }
};  


  
  exports.getAllQuestionWithSubCatId = async (req, res) => {
      
    const {subCatId} = req.body
        
    const query = 'select rqid, question from report_ques_mst  where subcat_id=?'
    //const query = 'CALL GetQuestionsBySubcatId(?)'
    try {
      db.query(query,[subCatId],(err, result) => {
        if (err) {
          logger.error(`Error in /controller/eyereport/getReportInfoWithId: ${err.message}. SQL query: ${query}`);
          res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorDetail: err.message,
            responseData: {},
            status: "ERROR",
            details: "An internal server error occurred",
            getMessageInfo: "An internal server error occurred"
          });
        }
        else{
        logger.info('Get Question Report Successfully');

          res.status(200).json(result)
        } 
      });
    } catch (error) {
      logger.error(`Error in /controller/eyereport/getReportInfoWithId: ${error.message}`);
      res.send(error)
    }
  };


 // image upload 
//  exports.uploadImage = async (req, res) => { 
//     const {crId,user_id} = req.body;
//     const filenames = req.files.map((file)=>file.filename)
//     const query = 'insert into camp_report_img_mst (crid,imgpath,created_by,modified_by) values(?,?,?,?)';
//     const values = filenames.map((filename)=>[crId,filename,user_id,user_id])
//     try {
//       db.query(query,values, (err, result) => {
//         if (err) {
//           res.status(500).json({
//             errorCode: "INTERNAL_SERVER_ERROR",
//             errorDetail: err,
//             responseData: {},
//             status: "ERROR",
//             details: "An internal server error occurred",
//             getMessageInfo: "An internal server error occurred"
//           });
//         }
//         else{
//           res.status(200).json({ message: "Images Upload Successfully"})
//         } 
//       });
//     } catch (error) {
//       res.send(error)
//     }
//   };

exports.uploadImage = async (req, res) => { 
  const { crId, userId,feedback} = req.body;
  const filenames = req.files.map((file) => file.filename);

  // Create placeholders for each set of values
  const placeholders = filenames.map(() => "(?, ?, ?, ?, ?)").join(', ');

  // Flatten the values into a single array
  const values = filenames.flatMap((filename) => [crId, filename, feedback, userId, userId]);

  // Construct the SQL query with the correct number of placeholders
  const query = `INSERT INTO camp_report_img_mst (crid, imgpath, feedback, created_by, modified_by) VALUES ${placeholders}`;

  try {
    db.query(query, values, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      } else {
        logger.info('Image Uploaded Successfully');

        res.status(200).json({ message: "Images Upload Successfully", errorCode: "1"});
      } 
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error);
  }
};


exports.getImages = async (req, res) => {
  const {crId} = req.body;
  const query = 'select crimgid,imgpath,feedback,status from camp_report_img_mst where crid = ?'

  try {
    db.query(query,[crId],(err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
        logger.info('Image get Successfully');

        res.status(200).json(result)
      } 
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error)
  }
}; 

// exports.updateImages = async (req, res) => {
//   // const { imageUpdates } = req.body;

//   // // Create placeholders for each set of values
//   // const placeholders = imageUpdates.map(() => "(?, ?, ?, ?)").join(', ');

//   // // Flatten the values into a single array
//   // const values = imageUpdates.flatMap((update) => [update.crId, update.imgpath, update.feedback, update.userId]);
   
//   const { crId, userId,feedback} = req.body;
//   const filenames = req.files.map((file) => file.filename);

//   // Create placeholders for each set of values
//   const placeholders = filenames.map(() => "(?, ?, ?, ?)").join(', ');

//   // Flatten the values into a single array
//   const values = filenames.flatMap((filename) => [crId, filename, feedback, userId]);
//   // Construct the SQL update query with the correct number of placeholders
//   const query = `
//     UPDATE camp_report_img_mst
//     SET feedback = ?,
//         modified_by = ?,
//         imgpath = ?,
//         modified_date = NOW()
//     WHERE crid = ?
//   `;

//   try {
//     db.query(query, values, (err, result) => {
//       if (err) {
//         res.status(500).json({
//           errorCode: "INTERNAL_SERVER_ERROR",
//           errorDetail: err,
//           responseData: {},
//           status: "ERROR",
//           details: "An internal server error occurred",
//           getMessageInfo: "An internal server error occurred"
//         });
//       } else {
//         // Check if any rows were affected (0 indicates an error)
//         if (result.affectedRows > 0) {
//           res.status(200).json({ message: "Images Updated Successfully", errorCode: "1" });
//         } else {
//           res.status(500).json({
//             errorCode: "INTERNAL_SERVER_ERROR",
//             errorDetail: "No rows were affected by the query",
//             responseData: {},
//             status: "ERROR",
//             details: "An internal server error occurred",
//             getMessageInfo: "An internal server error occurred"
//           });
//         }
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// };


// exports.addAnswer = async (req, res) => { 
//   const { dataArray } = req.body;

//   // Create placeholders for each set of values
//   const placeholders = dataArray.map(() => "(?, ?, ?)").join(', ');
   
//   // Flatten the values into a single array
//   const values = dataArray.flatMap((data) => [data.user_id, data.rqid, data.value]);

//   const query = "INSERT INTO report_ques_mapping (user_id, rqid, value) VALUES " + placeholders;

//   try {
//     db.query(query, values, (err, result) => {
//       if (err) {
//         res.status(500).json({
//           errorCode: "INTERNAL_SERVER_ERROR",
//           errorDetail: err,
//           responseData: {},
//           status: "ERROR",
//           details: "An internal server error occurred",
//           getMessageInfo: "An internal server error occurred"
//         });
//       } else {
//         res.status(200).json({ message: "Answers Added Successfully" });
//       } 
//     });
//   } catch (error) {
//     res.send(error);
//   }
// };

// exports.updateImages = async (req, res) => {
//   const {crimgId, crId, userId, feedback } = req.body;
//   const filenames = req.files.map((file) => file.filename);

//   try {
//     for (const filename of filenames) {
//       // Use the filename as the new imgpath value
      

//       // Construct the SQL update query with placeholders for imgpath
//       const query = `
//         UPDATE camp_report_img_mst
//         SET imgpath = ?,
//             feedback = ?,
//             modified_by = ?,
//             modified_date = NOW()
//         WHERE crid = ? AND crimgid = ?;
//       `;

//       // Execute the update query for each image
//       db.query(query, [filename, feedback, userId, crId,crimgId], (err, result) => {
//         if (err) {
//           console.error(err);
//         }
//       });
//     }

//     res.status(200).json({ message: "Images Updated Successfully", errorCode: "1" });
//   } catch (error) {
//     logger.error(error.message);

//     res.status(500).json({
//       errorCode: "INTERNAL_SERVER_ERROR",
//       errorDetail: error,
//       responseData: {},
//       status: "ERROR",
//       details: "An internal server error occurred",
//       getMessageInfo: "An internal server error occurred"
//     });
//   }
// };

exports.updateImages = async (req, res) => {
  const { crId, userId, feedback } = req.body;
  const filenames = req.files.map((file) => file.filename);
   
  let values;
  let query;
  if (filenames.length > 0) {
    const placeholders = filenames.map(() => "(?, ?, ?, ?, ?)").join(', ');
     values = filenames.flatMap((filename) => [crId, filename, feedback, userId, userId]);
     query = `INSERT INTO camp_report_img_mst (crid, imgpath, feedback, created_by, modified_by) VALUES ${placeholders}`;
  } else {
    
     query = `UPDATE camp_report_img_mst 
    SET feedback = ?, created_by = ?, modified_by = ? 
    WHERE crid = ?`;
     values = [feedback, userId, userId,crId];
  }

  try {
    db.query(query, values, (err, result) => {
      if (err) {
        logger.error(err.message);
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      } else {
        logger.info('Data Inserted Successfully');
        res.status(200).json({ message: "Data Inserted Successfully", errorCode: "1" });
      }
    });
  } catch (error) {
    logger.error(error.message);
    res.send(error);
  }
};




exports.addAnswer = async (req, res) => { 
  const { dataArray } = req.body;

  // Create placeholders for each set of values
  const placeholders = dataArray.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(', ');
   
  // Flatten the values into a single array
  const values = dataArray.flatMap((data) => [data.rqid,data.subCatId,data.value,data.crid,data.brand_id,data.user_id,data.user_id]);
   
  const query = "INSERT INTO question_camp_rep_mapping (rqid, subcat_id, answer, crid, brand_id, created_by, modified_by) VALUES " + placeholders;
   console.log(values)
   console.log(placeholders)
  try {
    db.query(query, values, (err, result) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      } else {
        logger.info('Answer added Successfully');

        res.status(200).json({ message: "Answers Added Successfully",errorCode:"1" });
      } 
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error);
  }
};


exports.updateAnswer = async (req, res) => {
  const { dataArray } = req.body;

  try {
    // Begin a transaction
    db.beginTransaction(async (err) => {
      if (err) {
        logger.error(err.message);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
        return;
      }

      for (const data of dataArray) {
        const { rqid,crid, brand_id, value, user_id } = data;



        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // Update the row where crid = 1 for each data item
        const updateQuery = `
          UPDATE question_camp_rep_mapping
          SET answer = ?, brand_id = ?, modified_by = ?, modified_date = ?
          WHERE crid = ? AND rqid = ?;
        `;

        // Execute the update query
        await db.query(updateQuery, [value, brand_id, user_id, currentDateTime, crid, rqid]);
      }

      // Commit the transaction when all updates are successful
      db.commit((err) => {
        if (err) {
          // Rollback the transaction on error
          logger.error(err.message)
          db.rollback(() => {
            res.status(500).json({
              errorCode: "INTERNAL_SERVER_ERROR",
              errorDetail: err,
              responseData: {},
              status: "ERROR",
              details: "An internal server error occurred",
              getMessageInfo: "An internal server error occurred"
            });
          });
        } else {
        logger.info('Answer Updated Successfully');

          res.status(200).json({ message: "Answers Updated Successfully", errorCode: "1" });
        }
      });
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error);
  }
};

// working code
// exports.getAnswerWithId = async (req, res) => {
//   const {crId} = req.body;
//   //const query = 'select rqid,answer,brand_id,status from question_camp_rep_mapping where crid = ?'
//   const query = 'select question_camp_rep_mapping.rqid,question_camp_rep_mapping.answer,question_camp_rep_mapping.brand_id,question_camp_rep_mapping.status,basic_mst.description from question_camp_rep_mapping INNER JOIN basic_mst on question_camp_rep_mapping.brand_id= basic_mst.basic_id WHERE question_camp_rep_mapping.crid =?'
//   try {
//     db.query(query,[crId],(err, result) => {
//       if (err) {
//         logger.error(err.message);

//         res.status(500).json({
//           errorCode: "INTERNAL_SERVER_ERROR",
//           errorDetail: err.message,
//           responseData: {},
//           status: "ERROR",
//           details: "An internal server error occurred",
//           getMessageInfo: "An internal server error occurred"
//         });
//       }
//       else{
//         logger.info('Get Answer with Id Successfully');

//         res.status(200).json(result)
//       } 
//     });
//   } catch (error) {
//     logger.error(err.message);

//     res.send(error)
//   }
// }; 


exports.getAnswerWithId = async (req, res) => {
  const { crId } = req.body;
  const query = `
  SELECT
    rqid,
    answer,
    GROUP_CONCAT(basic_mst.basic_id) AS brand_id,
    question_camp_rep_mapping.status,
    GROUP_CONCAT(basic_mst.description) AS description
  FROM
    question_camp_rep_mapping
    INNER JOIN basic_mst ON FIND_IN_SET(basic_mst.basic_id, question_camp_rep_mapping.brand_id)
  WHERE
    question_camp_rep_mapping.crid = ?
  GROUP BY
    rqid, answer, question_camp_rep_mapping.status;
`;

try {
  db.query(query, [crId], (err, result) => {
    if (err) {
      logger.error(err.message);
      res.status(500).json({
        errorCode: "INTERNAL_SERVER_ERROR",
        errorDetail: err.message,
        responseData: {},
        status: "ERROR",
        details: "An internal server error occurred",
        getMessageInfo: "An internal server error occurred"
      });
    } else {
      logger.info('Get Answer with Id Successfully');
      res.status(200).json(result)
    }
  });
} catch (error) {
  logger.error(error.message);
  res.send(error)
}

};






exports.getAllCampReport = async (req, res) => {
   
   const {userId,subCatId} = req.body;

  const query = `select eye_report_mst.erid,eye_report_mst.doc_name1, 
  eye_report_mst.doc_name2, eye_report_mst.doc_name3,eye_report_mst.doc_name4,
  eye_report_mst.camp_date, user_mst1.name
  from eye_report_mst 
  LEFT JOIN user_mst1 ON eye_report_mst.mr_code = user_mst1.empcode
  where eye_report_mst.created_by = ? and eye_report_mst.subcat_id = ? and eye_report_mst.status = "Y"`

  //const query = 'CALL GetAllCampReport(?,?)'
  try {
    db.query(query,[userId,subCatId],(err, result) => {
      if (err) {
        logger.error(`Error in /controller/eyereport/getAllCampReport: ${err.message}. SQL query: ${query}`);

        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
        const formattedResult = result.map((row) => ({
          ...row,
          camp_date: moment(row.camp_date).format('DD-MM-YYYY'), // Format the date here
        }));
        res.status(200).json(formattedResult)
      } 
    });
  } catch (error) {
    logger.error(`Error in /controller/eyereport/getAllCampReport: ${error.message}.`);
    res.send(error)
  }
};

exports.getReportWithId = async (req, res) => {
   
  const {userId,subCatId} = req.body;
 //const query = 'select crid,doctor_name,camp_date from camp_report_mst where user_id=? and subcat_id =?'
 try {
   db.query(query,[userId,subCatId],(err, result) => {
     if (err) {
      logger.error(err.message);

       res.status(500).json({
         errorCode: "INTERNAL_SERVER_ERROR",
         errorDetail: err.message,
         responseData: {},
         status: "ERROR",
         details: "An internal server error occurred",
         getMessageInfo: "An internal server error occurred"
       });
     }
     else{
       res.status(200).json(result)
     } 
   });
 } catch (error) {
  logger.error(error.message);

   res.send(error)
 }
};


// get brand name with id 


exports.getBrandWithId = async (req, res) => {
   
  const {subCatId} = req.body;

 //const query = 'select basic_id,description,status from basic_mst where code =?'
 const query = 'CALL GetBrandName(?)'
 try {
   db.query(query,[subCatId],(err, result) => {
     if (err) {
      logger.error(err.message);

       res.status(500).json({
         errorCode: "INTERNAL_SERVER_ERROR",
         errorDetail: err.message,
         responseData: {},
         status: "ERROR",
         details: "An internal server error occurred",
         getMessageInfo: "An internal server error occurred"
       });
     }
     else{
       res.status(200).json(result)
     } 
   });
 } catch (error) {
  logger.error(error.message);

   res.send(error)
 }
};



// exports.deleteReportWithId = async (req, res) => {
//   const { crId } = req.body;

//   // Step 1: Retrieve the image file names associated with the report from the database
//   const queryGetImageFileNames = 'SELECT imgpath FROM camp_report_img_mst WHERE crid = ?';

//   try {
//     db.query(queryGetImageFileNames, [crId], (err, result) => {
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
//         if (result.length === 0) {
//           // Report not found
//           res.status(404).json({ message: "Report not found", errorCode: "0" });
//         } else {

//           console.log("selecting images",result[0].imgpath)
//           const images = result;

//           // Step 2: Delete the report's data from the database
//           //const queryDeleteReport = 'DELETE FROM camp_report_mst WHERE crid = ?';

//           db.query(queryDeleteReport, [crId], (deleteErr, deleteResult) => {
//             if (deleteErr) {
//               logger.error(deleteErr.message);

//               res.status(500).json({
//                 errorCode: "0",
//                 errorDetail: deleteErr.message,
//                 responseData: {},
//                 status: "ERROR",
//                 details: "An internal server error occurred",
//                 getMessageInfo: "An internal server error occurred"
//               });
//             } else {
//               logger.info('Report Deleted Successfully');

//               // Step 3: Delete the image files from the file system if they exist
//               deleteImagesFromFileSystem(images);

//               res.status(200).json({ message: "Report Deleted Successfully", errorCode: "1" });
//             }
//           });
//         }
//       }
//     });
//   } catch (error) {
//     logger.error(error.message);

//     res.send(error);
//   }
// };

// function deleteImagesFromFileSystem(imageFileNames) {
//   // Specify the directory where the images are stored
//   const imageDirectory = 'your-image-directory';

//   // Loop through the array of image file names and delete each one
//   imageFileNames.forEach((imageName) => {
//     fs.unlink(`./uploads/report/${imageName.imgpath}`, (unlinkErr) => {
//       if (unlinkErr) {
//         console.error('Error deleting image: ', unlinkErr);
//       }
//       res.status(200).json({ message: 'Doctor data and image deleted successfully' });
//     });
//   });
// }


// working code
exports.deleteReportWithId = async (req, res) => {
  const { crId, subCatId } = req.body;  

  try {
      const query1 = "UPDATE eye_report_mst SET status = 'N' WHERE erid = ?";
      const query2 = "UPDATE question_camp_rep_mapping SET status = 'N' WHERE crid = ? and subcat_id = ?";
      const query3 = "UPDATE camp_report_img_mst SET status = 'N' WHERE crid = ? and subcat_id = ?";

      const [result1, result2, result3] = await Promise.all([
          db.query(query1, [crId]),
          db.query(query2, [crId,subCatId]),
          db.query(query3, [crId,subCatId])
      ]);

      if (result1.affectedRows === 0 || result2.affectedRows === 0 || result3.affectedRows === 0) {
          // If no rows were affected, report an error
          throw new Error("No rows were updated.");
      }

      logger.info('Report deleted successfully');
      res.status(200).json({ message: "Report Deleted Successfully", errorCode: "1" });

  } catch (error) {
    logger.error(`Error in /controller/eyereport/deleteReportWithId: ${err.message}.`);

      res.status(500).json({
          errorCode: "0",
          errorDetail: error.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
      });
  }
};

// working delete image from file syatem aloso
// exports.deleteReportWithId = async (req, res) => {
//   const { crId, subCatId } = req.body;  

//   try {
//       const query1 = "UPDATE eye_report_mst SET status = 'N' WHERE erid = ?";
//       const query2 = "UPDATE question_camp_rep_mapping SET status = 'N' WHERE crid = ? and subcat_id = ?";
//       const query3 = "UPDATE camp_report_img_mst SET status = 'N' WHERE crid = ? and subcat_id = ?";
//       const query4 = "SELECT imgpath FROM camp_report_img_mst WHERE crid = ? and subcat_id = ?"
//       const [result1, result2, result3] = await Promise.all([
//           db.query(query1, [crId]),
//           db.query(query2, [crId, subCatId]),
//           db.query(query3, [crId, subCatId])
//       ]);

//       if (result1.affectedRows === 0 || result2.affectedRows === 0 || result3.affectedRows === 0) {
//           // If no rows were affected, report an error
//           throw new Error("No rows were updated.");
//       }
//       //console.log("inside result",result4);

    

//       db.query(query4, [crId,subCatId], (deleteErr, deleteResult) => {
//                     if (deleteErr) {
//                       logger.error(deleteErr.message);
        
//                       res.status(500).json({
//                         errorCode: "0",
//                         errorDetail: deleteErr.message,
//                         responseData: {},
//                         status: "ERROR",
//                         details: "An internal server error occurred",
//                         getMessageInfo: "An internal server error occurred"
//                       });
//                     } else {
//                       deleteResult.forEach((imageName) => {
//                          console.log(imageName)
//                         fs.unlink(`./uploads/report/${imageName.imgpath}`, (unlinkErr) => {
//                           if (unlinkErr) {
//                             console.error('Error deleting image: ', unlinkErr);
//                           }
//                         });
//                       });
                      
//                     }
//                   });

//       logger.info('Report deleted successfully');
//       res.status(200).json({ message: "Report Deleted Successfully", errorCode: "1" });

//   } catch (error) {
//       logger.error(`Error in /controller/eyereport/deleteReportWithId: ${error.message}.`);

//       res.status(500).json({
//           errorCode: "0",
//           errorDetail: error.message,
//           responseData: {},
//           status: "ERROR",
//           details: "An internal server error occurred",
//           getMessageInfo: "An internal server error occurred"
//       });
//   }
// };





exports.deleteSingalReportImg = async (req, res) => {
  const {crimgid} = req.body;  

  const getImgFileName = 'select imgpath from camp_report_img_mst where crimgid = ?'
  //const query = 'delete from camp_report_img_mst where crimgid=?'

  try {
    db.query(getImgFileName, [crimgid], (err, result) => {
      if (err) {
      logger.error(err.message);

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

        if(result.length===0){
          res.status(404).json({ message: "img not found", errorCode: "0" });
        }
        else{
          let imageFileName = result[0].imgpath;
           const query = 'delete from camp_report_img_mst where crimgid=?'
  
            db.query(query, [crimgid], (deleteErr, deleteResult) => {
              if (deleteErr) {
                logger.error(deleteErr.message);
  
                res.status(500).json({
                  errorCode: "0",
                  errorDetail: deleteErr.message,
                  responseData: {},
                  status: "ERROR",
                  details: "An internal server error occurred",
                  getMessageInfo: "An internal server error occurred"
                });
              } else {
                logger.info('Image Delete Successfully');
                fs.unlink(`./uploads/report/${imageFileName}`, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error('Error deleting image: ', unlinkErr);
                  }
                });
                logger.info('image deleted successfully');

                res.status(200).json({ message: "Image Deleted Successfully",errorCode: "1"})
              }
            });
        }
      
      } 
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error)
  }
};


  exports.getEmpData = async (req, res) => {
    const {empcode} = req.body;
     const query = 'select user_mst1.user_id,user_mst1.role,user_mst1.name,user_mst1.empcode,user_mst1.hq,user_mst1.reporting, role_mst.rolename from user_mst1 INNER JOIN role_mst on user_mst1.role = role_mst.role_id where user_mst1.reporting= ?'
     
       try {
         db.query(query,[empcode],(err, result) => {
           if (err) {
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
             res.status(200).json(result)
           } 
         });
       } catch (error) {
         res.send(error)
       }
     };



  exports.getEditEmpData = async (req, res) => {
    const {empcode,repocode} = req.body;
     //const query = 'select user_mst1.user_id,user_mst1.role,user_mst1.name,user_mst1.empcode,user_mst1.hq,user_mst1.reporting, role_mst.rolename from user_mst1 INNER JOIN role_mst on user_mst1.role = role_mst.role_id where user_mst1.reporting= ?'
     const query = `
     select um.user_id,um.name, um.empcode,um.hq,um.reporting, rm.rolename,um.role, um1.empcode as empcode1,um1.name as name1,um1.reporting as reporting1,um1.role as role1 , um2.empcode as empcode2,um2.name as name2,um2.reporting as reporting2,um2.role as role1, um3.empcode as empcode3,um3.name as name3,um3.reporting as reporting3,um3.role as role1, um4.empcode as empcode4,um4.name as name4,um4.reporting as reporting4,um4.role as role1, um5.empcode as empcode5,um5.name as name5,um5.reporting as reporting5,um5.role as role1 from user_mst1 um INNER JOIN role_mst rm on um.role = rm.role_id and um.reporting= ? AND um.empcode= ? inner join user_mst1 um1 on um.reporting=um1.empcode inner join user_mst1 um2 on um1.reporting=um2.empcode inner join user_mst1 um3 on um2.reporting=um3.empcode LEFT join user_mst1 um4 on um3.reporting=um4.empcode LEFT join user_mst1 um5 on um4.reporting=um5.empcode;`
       try {
         db.query(query,[repocode,empcode],(err, result) => {
           if (err) {
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
            console.log(result)
             res.status(200).json(result)
           } 
         });
       } catch (error) {
         res.send(error)
       }
     };

     exports.getEmpDataWithId = async (req, res) => {
      const {userId} = req.body;
       const query = 'select user_id,name,empcode,hq,reporting from user_mst1 where user_id = ?'
       
         try {
           db.query(query,[userId],(err, result) => {
             if (err) {
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
               res.status(200).json(result)
             } 
           });
         } catch (error) {
           res.send(error)
         }
       };

       
       exports.findDoctorReportPresent = async (req, res) => {
        const {name,date,empcode} = req.body;
        const formattedCampDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const query = 'SELECT crid FROM camp_report_mst WHERE doctor_name = ? and camp_date =? and user_empcode =?';
     
        try {
          db.query(query,[name,formattedCampDate,empcode],(err, result) => {
            if (err) {
            logger.error(err.message);
    
              res.status(500).json({
                errorCode: "0",
                errorDetail: err.message,
                responseData: {},
                status: "ERROR",
                details: "An internal server error occurred",
                getMessageInfo: "An internal server error occurred"
              });
            }
            else if (result.length === 0) {
              logger.warn('Doctor Not Found');
              res.status(404).json({
                errorCode: "0",
                errorDetail: "Doctor not found",
                responseData: {},
                status: "ERROR",
                details: "Not Found",
                getMessageInfo: "Doctor not found"
              });
            }
            else{
            logger.info('Doctor find Successfully');
              
              res.status(200).json({ message: "Doctor find Successfully",errorCode: "1"
            })
            } 
          });
        } catch (error) {
          logger.error(error.message);
    
          res.send(error)
        }
      };
