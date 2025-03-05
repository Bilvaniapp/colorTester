const express = require('express');
const multer = require('multer');
const { uploadExcel } = require('../../controller/importfromexcel/importfromexcel'); // Adjust path if needed
const router = express.Router();

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Store files in memory instead of saving to disk

// Route for uploading Excel file
router.post('/upload-excel', upload.single('file'), uploadExcel);

module.exports = router;
