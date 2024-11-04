const express = require("express");
const { getAllQuestionWithSubCatId, addAnswer, getAllCampReport, addReportWithInfo, getBrandWithId, updateReportWithInfo, updateAnswer, getReportInfoWithId, getAnswerWithId, getImages, deleteReportWithId, getReport, getEmpData, getEmpDataWithId, deleteSingalReportImg, findDoctorReportPresent, getEditEmpData, getMrList, getCenterList } = require("../controller/report");


const router = express.Router();



router.post("/getAllCampReport",getAllCampReport)
router.post("/addReportWithInfo",addReportWithInfo)
router.post("/getBrandName",getBrandWithId)
router.patch("/updateReportWithInfo",updateReportWithInfo)

router.post("/getReportInfoWithId",getReportInfoWithId)


router.delete("/deleteReportWithId",deleteReportWithId)
router.post("/getEmpData",getEmpData)
router.post("/getEditEmpData",getEditEmpData)
router.post("/getEmpDataWithId",getEmpDataWithId)
router.post("/findDoctorPresent",findDoctorReportPresent);

////

router.post("/getMrList", getMrList)
router.get("/getCenterList", getCenterList)
router.post("/getQuestionWithSubCatId",getAllQuestionWithSubCatId)
router.post("/addAnswer",addAnswer);
router.post("/updateAnswer",updateAnswer);
router.post("/getAnswerWithId",getAnswerWithId);
router.post("/getImages",getImages);
router.post("/deleteSingalImg",deleteSingalReportImg)
module.exports= router;