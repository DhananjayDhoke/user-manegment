const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth")
const catRoutes = require("./routes/cat")
const campRoutes = require("./routes/camp")
const docRoutes = require("./routes/doctor")
const dashRoutes = require("./routes/dashboard")
const repoRoutes = require("./routes/report")
const eyeRoutes = require("./routes/eyereport")
const glaucomaRoutes = require("./routes/glaucomareport")
const operativeRoutes = require("./routes/operative")
const adminRoutes = require("./routes/adminDashboard")
const basicRoutes = require('./routes/basic')
const logger = require("./utils/logger");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const axios = require('axios')
const moment = require('moment');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const nodemailer = require("nodemailer");
const {registerFont, createCanvas, loadImage } = require('canvas');

const db = require("./config/db")
const { addDoctor, updateDoctor, addDoctor1 } = require("./controller/doctor");
const { uploadImage, updateImages } = require("./controller/report");


// Middleware and configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// multer configuration
const uploadsfile = path.join(__dirname, "./uploads/profile");
app.use("/uploads/profile",express.static(uploadsfile));

const uploadsfile1 = path.join(__dirname, "./uploads/report");
app.use("/uploads/report",express.static(uploadsfile1));

const uploadsfile2 = path.join(__dirname, "./uploads/poster");
app.use("/uploads/poster",express.static(uploadsfile2));

const uploadsfile3 = path.join(__dirname, "");
app.use("",express.static(uploadsfile3));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"./uploads/profile"))
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now()+ Math.random().toString();
    cb(null, uniquePrefix+file.originalname)
  }
})


// multer configuration for report upload images

const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "./uploads/report");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + Math.random().toString();
    cb(null, uniquePrefix + file.originalname);
  },
});

// file filter to set image type
const imageFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG files are allowed."), false);
  }
};

const upload = multer({ storage: storage,fileFilter: imageFilter })

const uploadExcel = multer({ dest: 'uploads/' });

const imageUpload = multer({ storage: reportStorage, fileFilter: imageFilter });

// routes with file upload
app.post("/doc/addDoctor",upload.single('image'),addDoctor);
//app.post("/doc/addDoctorWithNormal",upload.single('image'),addDoctor1);

app.post("/doc/updateDoctor", upload.single('image'),updateDoctor)
app.post("/report/uploadImages",imageUpload.array("images", 10),uploadImage);
app.post("/report/updateImages",imageUpload.array("images", 10),updateImages);


//Auth Routes
app.use("/auth",authRoutes)

// Category Routes
app.use("/cat",catRoutes)

// Camp Routes
app.use("/camp",campRoutes)

// Doctor Routes
app.use('/doc',docRoutes)

// Dashboard Routes
app.use("/dashboard",dashRoutes)

// Camp Report Routes
app.use("/report",repoRoutes)

// Dry eye report 
app.use("/eyeReport",eyeRoutes)

// glaucoma report 
app.use("/glaucomaReport",glaucomaRoutes)

// glaucoma report 
app.use("/operativeReport",operativeRoutes)

// Admin Routes
app.use("/admin",adminRoutes)

app.use("/basic",basicRoutes)
// image combining code 

















app.post('/api/upload', uploadExcel.single('file'), (req, res) => {
  const filePath = req.file.path;

  // Parse the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: 1 });

  // Extract the first row (column names) from the Excel data
  const excelColumns = data[0];
   
  console.log("coloumn from excel",excelColumns);
  console.log("data", data);
  // Get the column names from the database table
  const sql = 'SHOW COLUMNS FROM user_mst1';
  db.query(sql, (err, result) => {
    if (err) throw err;

    const dbColumns = result.map(row => row.Field);

       console.log("database coloumn",dbColumns)
    // Check if all Excel columns are present in the database table
    const missingColumns = excelColumns.filter(col => !dbColumns.includes(col));
        console.log("missing coloumn",missingColumns);
    if (missingColumns.length > 0) {
      return res.status(400).json({ error: `Missing columns: ${missingColumns.join(', ')}` });
    }

    // If all columns exist, proceed to insert data into the database
    data.slice(1).forEach(row => {
      const rowData = {};
      excelColumns.forEach((col, index) => {
        rowData[col] = row[index];
      });
       
      //console.log("rowData", rowData);
      const insertSql = 'INSERT INTO user_mst1 SET ?';
      db.query(insertSql, rowData, (err) => {
        if (err) throw err;
      });
    });

    res.send('File uploaded and data inserted into the database.');
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  auth: {
      user: "dhananjaydhoke33@gmail.com",
      pass: "qetkjtijntaeatdt"
   
  },
});
app.post('/api/upload-csv', uploadExcel.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const emails = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.email) {
        emails.push(row.email);
      }
    })
    .on('end', () => {
      fs.unlinkSync(filePath); // Remove the file after processing

      // Optional: Insert emails into MySQL database
      // emails.forEach((email) => {
      //   const query = 'INSERT INTO emails (email) VALUES (?)';
      //   db.query(query, [email], (err, result) => {
      //     if (err) console.error('Error inserting email:', err);
      //   });
      // });

      console.log("emails",emails)

      // Send emails
      emails.forEach((email) => {
        const mailOptions = {
          from: 'dhananjaydhoke33@gmail.com',
          to: email,
          subject: 'Test Email',
          text: 'This is a test email sent to multiple users.',
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email to:', email, error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      });

      res.json({ message: 'Emails sent successfully' });
    });
});

app.listen(8089, async () => {
  try {
    console.log("listining on port 8089");
  } catch (error) {
    console.log(error);
  }
});
