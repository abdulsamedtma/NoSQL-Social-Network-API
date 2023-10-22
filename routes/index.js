const router = require("express").Router(); // Import the Router object from Express.js
const apiRoutes = require("./api"); // Import the API routes from the /api/index.js file

router.use("/api", apiRoutes); // Add prefix of `/api` to all of the api routes imported from the `api` directory

router.use((req, res) => {
  res.status(404).send("<h1>😝 Wrong routes!</h1>");
});

module.exports = router; // Export the router