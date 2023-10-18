const{ Thought, User } = require('../models'); // import the Thought and User models
 
// create the thoughtController object
const thoughtController = {
// GET to get all thoughts
getAllThoughts(req, res) {
    Thought.find({})
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
},
// GET to get a single thought by its _id
getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
},
// Create new thought 
// Create a new thought document in the database using the data in the 'body' object
createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        // After creating the thought, find the user with the specified '_id' and push the '_id' of the new thought to the user's 'thoughts' array
        return User.findOneAndUpdate(
          { _id: body.userId }, // Find the user by their '_id'
          { $push: { thoughts: _id } }, // Push the '_id' of the new thought to the user's 'thoughts' array
          { new: true } // Return the updated user data after the update
        );
      })
      .then((dbUserData) => {
        // If the user is not found, return a 404 status with an error message
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
  
        // If everything is successful, respond with a success message
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err)); // If there's an error at any point, catch it and respond with the error
  },

  // Update thought by its _id
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { 
        new: true, runValidators: true 
    })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.json(err));   
},
// Delete a thought
// Function for deleting a thought and removing it from a user's thoughts array
deleteThought({ params }, res) {
    // Step 1: Find and delete the thought by its '_id' from the 'Thought' collection
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        // Step 2: Check if the thought was not found, and if so, return a 404 status with an error message
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
  
        // Step 3: Remove the deleted thought's '_id' from the user's 'thoughts' field in the 'User' collection
        return User.findOneAndUpdate(
          { thoughts: params.id }, // Find the user(s) with the thought's '_id' in their 'thoughts' array
          { $pull: { thoughts: params.id } }, // Use $pull to remove the thought's '_id' from the user's 'thoughts' array
          { new: true } // Return the updated user data after the update
        );
      })
      .then((dbUserData) => {
        // Step 4: Check if the user was not found, and if so, return a 404 status with an error message
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
  
        // Step 5: If everything is successful, respond with a success message
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err)); // Step 6: If there's an error at any point, catch it and respond with the error
  },

  //Add a reaction to a thought
  // Function for adding a reaction to a thought
addReaction({ params, body }, res) {
    // Step 1: Find the thought by its '_id' and add the reaction to the 'reactions' array
    Thought.findOneAndUpdate(
      { _id: params.thoughtId }, // Find the thought by its '_id'
      { $push: { reactions: body } }, // Add the reaction to the 'reactions' array
      { new: true } // Return the updated thought data after the update
    )
      .then((dbThoughtData) => {
        // Step 2: Check if the thought was not found, and if so, return a 404 status with an error message
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
  
        // Step 3: If everything is successful, respond with the updated thought data, which now includes the new reaction
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err)); // Step 4: If there's an error at any point, catch it and respond with the error
  },
  
// Remove a reaction from a thought
removeReaction({ params }, res) {
    // Step 1: Find the thought by its '_id' and remove the reaction with the specified 'reactionId' from the 'reactions' array
    Thought.findOneAndUpdate(
        { _id: params.thoughtId }, // Find the thought by its '_id'
        { $pull: { reactions: { reactionId: params.reactionId } } }, // Use $pull to remove the reaction from the 'reactions' array based on 'reactionId'
        { new: true } // Return the updated thought data after the update
    )
    .then(dbThoughtData => res.json(dbThoughtData)) // Step 2: If successful, respond with the updated thought data, which no longer contains the removed reaction
    .catch(err => res.json(err)); // Step 3: If there's an error at any point, catch it and respond with the error
}
};

module.exports = thoughtController; // Export the thoughtController object with the defined functions
  
