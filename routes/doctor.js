const express = require("express");
const { addDoctor, updateDoctor, getDoctorWithUserId, getDoctorWithId, deleteDoctorWithId, searchDoctorWithUserId, getDoctorWithIdForPoster, getDoctorPoster, findDoctorPresent, getDoctorDataWithUserId, getNormalPoster } = require("../controller/doctor");



const router = express.Router();


router.post("/getDoctorDataWithUserId",getDoctorDataWithUserId)
router.post("/getDoctorWithId",getDoctorWithId)
router.post("/deleteDoctor",deleteDoctorWithId)
router.post("/getPoster",getDoctorPoster)
router.post('/getNormalPoster', getNormalPoster);


router.post("/searchWithUserId",searchDoctorWithUserId)
router.post("/getDoctorPoster",getDoctorWithIdForPoster)

router.post("/findDoctorPresent",findDoctorPresent)
module.exports= router;