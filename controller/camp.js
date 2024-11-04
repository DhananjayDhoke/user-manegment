
const db = require("../config/db")
const moment = require('moment');

// camp related controller 
exports.addCamp = async (req, res) => {
  const doctor_id = req.params.id;  
  const {user_id,camp_date,camp_venu} = req.body;
  //const query = 'insert into doctor_camp_mapping (doctor_id,camp_date,camp_venu,created_by,modified_by) values(?,?,?,?,?)';
  const query = 'CALL AddCamp(?, ?, ?, ?, ?)'
  try {
    db.query(query, [doctor_id,camp_date,camp_venu,user_id,user_id], (err, result) => {
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
        res.status(200).json({ message: "Camp Added Successfully",errorCode: "1"})
      } 
    });
  } catch (error) {
    res.send(error)
  }
};


exports.updateCamp = async (req, res) => {
    const dc_id = req.params.id;  
    const {user_id,camp_date,camp_venu} = req.body;
    const updateData = {};
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if(camp_date){
      updateData.camp_date = camp_date;
    }
    if(camp_venu){
      updateData.camp_venu = camp_venu;
    }
    if(currentDateTime){
      updateData.modified_date = currentDateTime
    }
    updateData.modified_by = user_id
    const query = "UPDATE doctor_camp_mapping SET ? WHERE dc_id = ?"
  
    try {
      db.query(query, [updateData, dc_id], (err, result) => {
        if (err) {
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
          res.status(200).json({
             result,
             message: "Camp Update Successfully"})
        } 
      });
    } catch (error) {
      res.send(error)
    }
  };

  // delete all camp with respect to doctor id
  exports.deleteAllCamp = async (req, res) => {
    const doctor_id = req.params.id;  

    const query = 'delete from doctor_camp_mapping where doctor_id=?'
  
    try {
      db.query(query, [doctor_id], (err, result) => {
        if (err) {
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
          res.status(200).json({ message: "Camp Deleted Successfully"})
        } 
      });
    } catch (error) {
      res.send(error)
    }
  };
   
  // delete singal camp with respect to doctor camp id
  exports.deleteCamp = async (req, res) => {
    const {dcId} = req.body;

    //const query = 'delete from doctor_camp_mapping where dc_id=?'
    const query = 'CALL DeleteCamp(?)'
    try {
      db.query(query, [dcId], (err, result) => {
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
          res.status(200).json({ message: "Camp Deleted Successfully",errorCode: "1"})
        } 
      });
    } catch (error) {
      res.send(error)
    }
  };

  exports.getAllCamp = async (req, res) => {
    const doctor_id = req.params.id;  

    //const query = 'select dc_id,doctor_id,camp_date,camp_venu from doctor_camp_mapping where doctor_id=?'
    const query = 'CALL GetAllCamps(?)'
    try {
      db.query(query,[doctor_id],(err, result) => {
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


  exports.getCampData = async (req, res) => {

    const {userId,subCatId} = req.body;
    const query = 'CALL GetCampData(?, ?)';
    //const query = 'SELECT doctor_mst.doctor_id, doctor_mst.doctor_name, doctor_camp_mapping.camp_date, doctor_camp_mapping.camp_venue, doctor_camp_mapping.status FROM doctor_mst INNER JOIN doctor_camp_mapping ON doctor_mst.doctor_id = doctor_camp_mapping.doctor_id WHERE doctor_mst.subcat_id = ? AND doctor_mst.user_id= ?;'
    try {
      db.query(query,[userId, subCatId],(err, result) => {
        if (err) {
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
      res.send(error)
    }
  };


