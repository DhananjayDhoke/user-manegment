const express = require("express");
const { totalDoctor, totalCamps, totalCampsWithSubCatId, totalPaScreened, totalPaDiagnosed, getFilterCampReport, getFilterCampReportCsv, getFilterCampReportCsvWithId, totalCampCount } = require("../controller/dashboard");

const router = express.Router();

router.post("/getTotalDoctors",totalDoctor)
router.post("/getTotalCamps",totalCamps)
//router.post("/getTotalCampsWithId",totalCampsWithSubCatId)
//router.post("/getTotalPaScreened",totalPaScreened)
//router.post("/getTotalPaDiagnosed",totalPaDiagnosed)
router.post("/getFilterCampReport",getFilterCampReport)
router.post("/getFilterCampReportCsv",getFilterCampReportCsv)
//router.get("/getFilterCampReportCsv",getFilterCampReportCsv)

router.post("/getFilterCampReportCsvWithId", getFilterCampReportCsvWithId)

// camp count for graph

router.post('/getCampCount',totalCampCount)

module.exports= router;