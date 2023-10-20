// Import required modules
const express = require("express"); // Import the Express framework
const db = require("./config/connection"); // Import the database connection configuration
const routes = require("./routes"); // Import your application's route definitions

// Create an Express application instance
const app = express();

// Define the port to listen on, defaulting to 3001 if the PORT environment variable is not set
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming JSON data
app.use(express.json());

// Middleware to parse incoming URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Use the defined routes for handling API endpoints
app.use(routes);

// Wait for the database connection to open
db.once('open', () => {
  // Start the Express server and listen on the specified port
  app.listen(PORT, () => {
    // Log a message to indicate that the API server is running on the chosen port
    console.log(`API server running on port ${PORT}!`);
  });
});
