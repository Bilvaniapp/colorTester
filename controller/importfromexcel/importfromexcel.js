const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Color = require('../../mongodb/savedMixColorMongo/saveMixeColorMongo'); // Adjust path if needed
const dbConfig = require('../../mongodb/config'); // Adjust path to your MongoDB config file

// Controller to handle Excel file upload and processing
exports.uploadExcel = async (req, res) => {
  try {
   

    // Access the uploaded file directly from the request buffer
    const fileBuffer = req.file.buffer;

    // Read the Excel file from the buffer
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Prepare data for bulk insertion
    const bulkInsertData = [];
    for (const row of sheetData) {
      console.log("Processing row:", row); // Debugging: Log the row to ensure data is parsed correctly

      // Use the correct key for the name field (case-sensitive)
      const { name, C, M, Y, K, W, R, G, B, O, P } = row;

      // Ensure name exists in the row
      if (!name) {
        console.warn("Row skipped due to missing name:", row);
        continue;
      }

      const selectedColors = [
        { hex: "#0000ff", shade: 'C', intensity: C },
        { hex: "#800000", shade: 'M', intensity: M },
        { hex: "#ffff00", shade: 'Y', intensity: Y },
        { hex: "#000000", shade: 'K', intensity: K },
        { hex: "#ffffff", shade: 'W', intensity: W },
        { hex: "#ff0000", shade: 'R', intensity: R },
        { hex: "#f5f5dc", shade: 'G', intensity: G },
        { hex: "#946b00", shade: 'B', intensity: B },
        { hex: "#ffa500", shade: 'O', intensity: O },
        { hex: "#ff9999", shade: 'P', intensity: P },
      ].filter((color) => parseFloat(color.intensity) > 0); // Ensure non-zero and valid intensities

      // Create a random mixedColorHex value
      const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

      // Prepare the data object
      const colorData = {
        permanentId: `pid-${name}`, // Generate a mock permanent ID, replace with actual logic if needed
        name, // Explicitly include name in the document
        colors: selectedColors,
        mixedColorHex: randomHex,
        userName: `User-${name}`, // Replace with actual user data if available
        userPhone: `+1234567890${name}`, // Replace with actual phone data
        colorNumber: bulkInsertData.length + 1, // Incremental color number
      };

      bulkInsertData.push(colorData);
    }

    // Insert into MongoDB
    const insertedColors = await Color.insertMany(bulkInsertData);
    res.status(200).send(`${insertedColors.length} colors inserted successfully.`);
  } catch (error) {
    console.error('Error processing Excel and inserting data:', error);
    res.status(500).send('Error processing Excel and inserting data.');
  } 
};


