const express = require("express");
const { getAllQuestionWithSubCatId, addAnswer, getAllCampReport, addReportWithInfo, getBrandWithId, updateReportWithInfo, updateAnswer, getReportInfoWithId, getAnswerWithId, getImages, deleteReportWithId, getReport, getEmpData, getEmpDataWithId, deleteSingalReportImg, findDoctorReportPresent, getEditEmpData } = require("../controller/glaucomareport");


const router = express.Router();


// router.post("/addAnswer",addAnswer)


// router.post("/getBrandName",getBrandWithId)

// router.patch("/updateAnswer",updateAnswer)

// router.post("/getAnswerWithId",getAnswerWithId)
// router.post("/getImages",getImages)
// router.delete("/deleteReportWithId",deleteReportWithId)
// router.post("/getEmpData",getEmpData)
// router.post("/getEditEmpData",getEditEmpData)
// router.post("/getEmpDataWithId",getEmpDataWithId)
// //router.delete("/deleteSingalImg",deleteSingalReportImg)
// router.post("/findDoctorPresent",findDoctorReportPresent);


////
router.post("/addReportWithInfo",addReportWithInfo)
router.post("/updateReportWithInfo",updateReportWithInfo)
router.post("/getReportInfoWithId",getReportInfoWithId)
router.post("/getQuestionWithSubCatId",getAllQuestionWithSubCatId)
router.post("/deleteReportWithId",deleteReportWithId);
router.post("/getAllCampReport",getAllCampReport)

module.exports= router;