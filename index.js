const express = require('express');
const cors = require('cors');
const body = require('body-parser');
require("dotenv").config();

require('./mongodb/config');
require('./mongodb/savedMixColorMongo/saveMixeColorMongo');
require('./mongodb/signupMongo/signupMongo');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    credentials: true,    
}));

app.use(body.json());

// Import routes
const savemixcolor = require('./routes/saveMixColorRoutes/saveMixColorRoutes');
const importfromexcel = require('./routes/importfromexcelRoutes/importfromexcelRoutes');

// Use routes
app.use('/', savemixcolor);
app.use('/', importfromexcel);

// Default route
app.get('/', (req, res) => {
    res.send("Jai Shree Ram");
});

// Start the server
const port = 3000;	
app.listen(port, () => {
    console.log(`Server is listening on port number ${port}`);
});
