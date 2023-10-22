// Import necessary modules or dependencies
const { User, Thought } = require("../models");

const userController = {
  // Function to get all users
  getAllUser(req, res) {
    // Step 1: Find all users and populate their 'friends' field
    User.find({})
      .populate({
        path: "friends",
        select: "-__v", // Exclude '__v' field from the 'friends' data
      })
      .select("-__v") // Exclude '__v' field from the users' data
      .sort({ _id: -1 }) // Sort users by '_id' in descending order
      .then((dbUserData) => res.json(dbUserData)) // Step 2: Respond with the list of users in JSON format
      .catch((err) => {
        console.log(err);
        res.sendStatus(400); // Step 3: Handle errors and respond with a status code 400 in case of an error
      });
  },

  // Function to get one user by id
  getUserById({ params }, res) {
    // Step 1: Find a user by their '_id' and populate their 'thoughts' and 'friends' fields
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v", // Exclude '__v' field from the 'thoughts' data
      })
      .populate({
        path: "friends",
        select: "-__v", // Exclude '__v' field from the 'friends' data
      })
      .select("-__v") // Exclude '__v' field from the user's data
      .then((dbUserData) => {
        if (!dbUserData) {
          // Step 2: Check if the user was not found and return a 404 status with an error message
          return res.status(404).json({ message: "No user found with this id!" });
        }
        res.json(dbUserData); // Step 3: Respond with the user's data in JSON format
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400); // Step 4: Handle errors and respond with a status code 400 in case of an error
      });
  },

  // Function to create a user
  createUser({ body }, res) {
    // Step 1: Create a new user using the data in the 'body' object
    User.create(body)
      .then((dbUserData) => res.json(dbUserData)) // Step 2: Respond with the created user's data in JSON format
      .catch((err) => res.json(err)); // Step 3: Handle errors and respond with the error details
  },

  // Function to update a user by id
  updateUser({ params, body }, res) {
    // Step 1: Find and update a user by their '_id' with the data in the 'body' object
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true, // Return the updated user data after the update
      runValidators: true, // Run data validation before the update
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          // Step 2: Check if the user was not found and return a 404 status with an error message
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData); // Step 3: Respond with the updated user's data in JSON format
      })
      .catch((err) => res.json(err)); // Step 4: Handle errors and respond with the error details
  },

  // Function to delete a user
  deleteUser({ params }, res) {
    // Step 1: Find and delete a user by their '_id'
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          // Step 2: Check if the user was not found and return a 404 status with an error message
          return res.status(404).json({ message: "No user with this id!" });
        }
        // BONUS: get ids of user's `thoughts` and delete them all
        // $in to find specific thoughts and delete them
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        // Step 3: Respond with a message indicating successful deletion of the user and associated thoughts
        res.json({ message: "User and associated thoughts deleted!" });
      })
      .catch((err) => res.json(err)); // Step 4: Handle errors and respond with the error details
  },

  // Function to add a friend to a user
  addFriend({ params }, res) {
    // Step 1: Find a user by their '_id' and add the 'friendId' to their 'friends' array
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } }, // Use $addToSet to avoid duplicate friends
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          // Step 2: Check if the user was not found and return a 404 status with an error message
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(dbUserData); // Step 3: Respond with the updated user data in JSON format
      })
      .catch((err) => res.json(err)); // Step 4: Handle errors and respond with the error details
  },

  // Function to remove a friend from a user
  removeFriend({ params }, res) {
    // Step 1: Find a user by their '_id' and remove the 'friendId' from their 'friends' array
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          // Step 2: Check if the user was not found and return a 404 status with an error message
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(dbUserData); // Step 3: Respond with the updated user data in JSON format
      })
      .catch((err) => res.json(err)); // Step 4: Handle errors and respond with the error details
  },
};

module.exports = userController; // Export the userController object with the defined functions