
const db = require("../config/db")
const logger = require('../utils/logger')


exports.login = async (req, res) => {
  const { empcode, password } = req.body;
  const query = 'select user_id, empcode, password, role from user_mst1 where empcode=? and status = "Y"';

  try {
    db.query(query, [empcode], (err, result) => {
      if (err) {
        logger.error(`Error in /controller/auth/login: ${err.message}. SQL query: ${query}`);
        return res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      } else if (result.length === 0) {
        logger.warn('Invalid Email or Password');
        return res.status(401).json({
          errorCode: "0",
          errorDetail: "Invalid Email or Password",
          responseData: {},
          status: "ERROR",
          details: "UNAUTHORIZED",
          getMessageInfo: "Invalid Email or Password"
        });
      } else {
        const user = result[0];
        if (password == user.password) {
          //logger.info('Login successful', { empID: user.empcode, user_id: user.user_id });

          const loginTime = new Date();
          const historyQuery = 'insert into user_login_history (user_id, login_datetime) values (?, ?)';
          db.query(historyQuery, [user.user_id, loginTime], (err, result) => {
            if (err) {
              logger.error(`Error in /controller/auth/login: ${err.message}. SQL query: ${query}`);
              return res.status(500).json({
                errorCode: "0",
                errorDetail: err.message,
                responseData: {},
                status: "ERROR",
                details: "An internal server error occurred",
                getMessageInfo: "An internal server error occurred"
              });
            } else {
              logger.info("login history added successfully");
              const historyId = result.insertId;
              console.log(result)
              return res.json({
                errorCode: "1",
                errorDetail: "",
                responseData: {
                  message: "Login successful",
                  empID: user.empcode,
                  user_id: user.user_id,
                  role: user.role,
                  sessionID:historyId
                },
                status: "SUCCESS",
                details: "",
                getMessageInfo: ""
              });
            }
          });
        } else {
          logger.warn('Invalid Email or Password');
          return res.status(401).json({
            errorCode: "UNAUTHORIZED",
            errorDetail: "Invalid Email or Password",
            responseData: {},
            status: "ERROR",
            details: "Invalid Email or Password",
            getMessageInfo: "Invalid Email or Password"
          });
        }
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      errorCode: "0",
      errorDetail: error.message,
      responseData: {},
      status: "ERROR",
      details: "An internal server error occurred",
      getMessageInfo: "An internal server error occurred"
    });
  }
};


exports.logout = async (req, res) => {
  const {sessionId } = req.body;
  const logoutTime = new Date();
  const query = 'update user_login_history set logout_datetime =? where lh_id = ?'
  try {
    db.query(query, [logoutTime,sessionId], (err, result) => {
      if (err) {
      logger.error(err.message);

        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
      logger.info('Logout Successfully');

        res.status(200).json({ message: "Logout Successfully",errorCode: "1"})
      } 
    });
  } catch (error) {
    logger.error(error.message);

    res.send(error)
  }
};

exports.getAppVersion = async (req, res) => {
 
const query = 'select version from app_version_mst'

  try {
    db.query(query,(err, result) => {
      if (err) {
        res.status(500).json({
          errorCode: "0",
          errorDetail: err.message,
          responseData: {},
          status: "ERROR",
          details: "An internal server error occurred",
          getMessageInfo: "An internal server error occurred"
        });
      }
      else{
        res.status(200).json(result)
      } 
    });
  } catch (error) {
    res.send(error)
  }
};





