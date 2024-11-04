const express = require("express");
const { getPosterType, getLanguage, getNormalPoster, getState, getCity, getZone, getStateZoneWise } = require("../controller/basic");


const router = express.Router();

router.get("/getLanguage", getLanguage)
router.get("/getPosterType", getPosterType)
router.post('/getNormalPoster', getNormalPoster)
router.get('/getStates', getState);
router.post('/getStatesZoneWise', getStateZoneWise);
router.post('/getCities', getCity);
router.get('/getZone',getZone);



module.exports= router;