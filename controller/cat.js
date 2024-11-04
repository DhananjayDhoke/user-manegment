const db = require("../config/db")
const logger = require('../utils/logger')

exports.getAllCategory = async(req, res)=>{
    const query = "select category_id,categeory_name from category_mst where status = 'Y' order by display_order"
    //const query = "CALL GetCategories()";
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/cat/getAllCategory: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched all categories');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/cat/getAllCategory: ${error.message}`);
        res.send(error)
    }
}


exports.getSubCategory = async(req, res)=>{
    //const categoryId = req.params.id
    const query = "select subcategory_id,subcategory_name  from subcategory_mst where status = 'Y' order by display_order"
    // const query = 'CALL GetSubcategories()'
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/cat/getSubCategory: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched subcategories');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/cat/getSubCategory: ${err.message}`);
        res.send(error)
    }
}

exports.getPosterCategory = async(req, res)=>{
    //const categoryId = req.params.id
    const query = "select pcat_id, cat_name  from poster_cat_mst where status = 'Y' order by display_order"
    // const query = 'CALL GetSubcategories()'
    try {
        db.query(query,(err, result)=>{
            if(err){
            logger.error(`Error in /controller/cat/getPosterCategory: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched subcategories');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/cat/getPosterCategory: ${err.message}`);
        res.send(error)
    }
}


exports.getPosterSubCategory = async(req, res)=>{
    //const categoryId = req.params.id
    const {pcatId} = req.body;
    const query = "select psubcat_id, cat_name, subcat_id  from poster_subcat_mst where pcat_id = ? and status = 'Y' order by display_order"
    // const query = 'CALL GetSubcategories()'
    try {
        db.query(query,[pcatId],(err, result)=>{
            if(err){
            logger.error(`Error in /controller/cat/getPosterCategory: ${err.message}. SQL query: ${query}`);
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
               logger.info('Fetched subcategories');
               res.status(200).json(result);
            }
         })
    } catch (error) {
        logger.error(`Error in /controller/cat/getPosterCategory: ${err.message}`);
        res.send(error)
    }
}