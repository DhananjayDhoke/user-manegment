const express = require("express");
const {login, getAppVersion, getEmpData, logout} = require("../controller/auth")
const router = express.Router();

router.post("/login",login)
router.post("/logout",logout)

router.get("/getAppVersion",getAppVersion)


module.exports= router;