const express = require("express");
const { getAllCategory, getSubCategory, getPosterCategory, getPosterSubCategory } = require("../controller/cat");

const router = express.Router();

router.get("/getAllCategory",getAllCategory)
router.get("/getSubCategory", getSubCategory)
router.get('/getPosterCategory', getPosterCategory)
router.post('/getPosterSubCategory', getPosterSubCategory)

module.exports= router;