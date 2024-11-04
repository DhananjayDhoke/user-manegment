const db = require("../config/db")
const logger = require('../utils/logger')

exports.getLanguage = async(req, res)=>{
    const query = "select lang_id, langkey, langvalue from language_mst where status = 'Y' order by display_order"
   
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/basic/getLanguage: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all language');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/basic/getLanguage: ${error.message}`);
        res.send(error)
    }
}


exports.getPosterType = async(req, res)=>{
   
    const query = "select ptid,ptype from poster_type_mst where status = 'Y' order by display_order"
    try {
        db.query(query,(err, result)=>{
            if(err){
                logger.error(`Error in /controller/basic/getPosterType: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched PosterType');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(error.message);
        res.send(error)
    }
}

exports.getNormalPoster = async(req,res)=>{
   const {pType} = req.body;
    const query = 'select poster_id, poster_path from poster_mst1 where posterType = ?'
    try {

        db.query(query,[pType],(error, result)=>{
            if(error){
                logger.error(`Error in /controller/basic/getNormalPoster: ${err.message}. SQL query: ${query}`);
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
                logger.info('Fetched Normal Poster');
                res.status(200).json(result);
            }
        })
        
    } catch (error) {
        res.send(error);
    }
}


exports.getState = async(req, res)=>{
    const query = "select id,state_name from states where status = 'Y'"
   
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/basic/getState: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all state');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/basic/getState: ${error.message}`);
        res.send(error)
    }
}

exports.getStateZoneWise = async(req, res)=>{

    const {zoneId} = req.body;
    let query
    if(zoneId){
      query = "select id,state_name from states where zone_id = ? and status = 'Y'"
    }
    else{
     query = "select id,state_name from states where status = 'Y'"
    }
   
   
    try {
        db.query(query,[zoneId],(err, result)=>{
            if(err){
            logger.error(`Error in /controller/basic/getState: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all state');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/basic/getState: ${error.message}`);
        res.send(error)
    }
}

exports.getCity = async(req, res)=>{
    const {stateId} = req.body;
    const query = "select id,city_name, state_id from cities where state_id = ?"
   
    try {
        db.query(query,[stateId],(err, result)=>{
            if(err){
            logger.error(`Error in /controller/basic/getCity: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all city');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/basic/getCity: ${error.message}`);
        res.send(error)
    }
}

exports.getZone = async(req, res)=>{
    const query = "select zone_id,zone_name from zone_mst where status = 'Y'"
   
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/basic/getZone: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all zone');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/basic/getZone: ${error.message}`);
        res.send(error)
    }
}