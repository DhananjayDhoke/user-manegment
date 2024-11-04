const express = require("express");
const { addCamp, getAllCamp, updateCamp, deleteCamp, deleteAllCamp, getCampData } = require("../controller/camp");


const router = express.Router();

// camp routes
router.post("/addCamp/:id",addCamp)
router.post("/getCampData",getCampData)
router.get("/getAllCamp/:id",getAllCamp)
router.patch("/updateCamp/:id",updateCamp)
router.delete("/deleteCamp",deleteCamp)
router.delete("/deleteAllCamp/:id",deleteAllCamp)

module.exports= router;