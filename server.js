const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors'); // Import the cors middleware
const userData = require('./data.json');
// To save data from html to json local file
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');




app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



// Home API
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, './frontend/index.html');
     res.sendFile(filePath);
});

// Get users by ID API
app.get('/api/user/:id', (req, res) => {
  // Retrieve the parameter from the URL correctly using req.params.id
  const id = parseInt(req.params.id);

  // Find the data object with the matching ID
  const result = userData.find(item => item.id === id); // Use userData instead of data

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// Get all data API
app.get('/alldata', (req, res) => {
    res.json(userData)
  });

// Create a route to handle POST requests to save data
app.post('/api/user/save', (req, res) => {
    try {
      const newData = req.body; // Assuming you're sending JSON data from your HTML form
      const jsonData = JSON.parse(fs.readFileSync('./data.json')); // Read the existing JSON data
      jsonData.push(newData); // Append the new data to the array
      fs.writeFileSync('./data.json', JSON.stringify(jsonData, null, 2)); // Write the updated data back to the file
      res.json({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving data' });
    }
  });


// Create a route to handle DELETE requests to delete data by ID
app.delete('/api/user/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Find the index of the data object with the matching ID
    const index = userData.findIndex(item => item.id === id);

    if (index !== -1) {
        // Remove the data object from the array
        userData.splice(index, 1);

        // Write the updated data back to the file
        fs.writeFileSync('./data.json', JSON.stringify(userData, null, 2));

        res.json({ message: 'Data deleted successfully' });
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

// listen server at port variable
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
