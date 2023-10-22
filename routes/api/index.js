// Import all of the API routes to prefix their endpoint names and package them up
const router = require("express").Router();
const userRoutes = require("./user-routes"); // Import the user-routes.js file as userRoutes
const thoughtRoutes = require("./thought-routes"); // Import the thought-routes.js file as thoughtRoutes

router.use("/users", userRoutes); // Add prefix of `/users` to routes created in `user-routes.js`
router.use("/thoughts", thoughtRoutes); // Add prefix of `/thoughts` to routes created in `thought-routes.js`

module.exports = router; // Export the router
