const express = require("express");
const { getReport, getTopLine, getSubCatData, AdminLogin, totalCamps, totalDoctor, totalPaScreened, totalPaDiagnosed, subCatInfo, addEmployee, getSubCatFiterData, getReportNormal, downloadReportNormal, downloadReportFilter, getAllEmployee, deleteEmployee, getEmployeeWithId, UpdateEmployee, getDataForImageDownload, getReportNumberWise, getReportFromTop, totalDoctorCount, totalCampCount, totalPatientScreened, totalPatientDiagnosed, getSubCatFilterDataWithZoneId, getSubCatFilterDataWithStateId, getEmpWiseData, getDataForImageDownload1, getFirstLine, getAllDataForEmp, getPostOperativeData, getPostOperativeAllData, loginUser, getEmpWiseDataUser } = require("../controller/adminDashboard");


const router = express.Router();


router.get("/totalCamp",totalCamps)
router.get("/totalDoctor",totalDoctor)
router.get("/totalPatientScreened",totalPaScreened)
router.get("/totalPatientDiagnosed",totalPaDiagnosed)

router.get("/getSubCatData",getSubCatData)
router.get("/getSubCatFilterData",getSubCatFiterData)

// for zonewise and statewise
router.get('/getZoneWiseData', getSubCatFilterDataWithZoneId) 
router.get('/getStateWiseData', getSubCatFilterDataWithStateId) 


// for graph 

router.post('/getDoctorCount', totalDoctorCount)
router.post('/getCampCount', totalCampCount)
router.post('/getScreenedCount', totalPatientScreened)
router.post('/getDiagnosedCount', totalPatientDiagnosed)

router.get("/subCatInfo",subCatInfo)
router.post("/login",AdminLogin);
router.post('/user-login',loginUser)

router.post("/getEmp",getTopLine)



router.get("/getReport",getReport) 
router.get("/getReportNormal",getReportNormal)
router.get("/downloadReport", downloadReportNormal) 
router.get("/downloadReportFilter",downloadReportFilter) 
router.post('/getReportNumberWise', getReportNumberWise) // --
router.post('/getReportFromTop', getReportFromTop) //--
router.get('/imageDownload/:userId', getDataForImageDownload) //--

// for employee wise data report

router.post('/getEmpReporting', getEmpWiseData)
router.post('/getEmpReportingUser', getEmpWiseDataUser)
router.get('/imageDownload1/:empId', getDataForImageDownload1) 

// for hirerkey

router.get('/getFirstLine', getFirstLine);
router.post('/getAllDataForEmp', getAllDataForEmp)

/// fro geting post operative data 

router.post('/getPostOperativeData',getPostOperativeData);
router.post('/getPostOperativeAllData',getPostOperativeAllData);


// api for user manegment 

router.post("/addEmp",addEmployee)
router.get("/getAllEmployee",getAllEmployee)
router.post('/deleteEmp',deleteEmployee)
router.get('/getEmpWithId/:id',getEmployeeWithId)
router.patch('/updateEmpWithId/:id',UpdateEmployee)

module.exports= router;