const {Schema, model} = require('mongoose'); // Import the Mongoose package and extract the Schema and model objects from it

const UserSchema = new Schema( // Create a new UserSchema object    
{
    username: { // Define the username field
        type: String, // Set the field type
        unique: true, // Set the field to be unique
        required: "Username is Required", // Set the field to be required
        trim: true // Set the field to be trimmed
    },
    email: { // Define the email field
        type: String, // Set the field type
        unique: true, // Set the field to be unique
        required: "Email is Required", // Set the field to be required
        match: [/.+\@.+\..+/] // Set the field to match an email address pattern
    },
    thoughts: [{ // Define the thoughts field as an array of subdocuments using the ThoughtSchema
        type: Schema.Types.ObjectId, // Set the field type
        ref: "Thought" // Set the field to reference the Thought model
    }],
    friends: [{ // Define the friends field as an array of subdocuments using the UserSchema (self-reference)
        type: Schema.Types.ObjectId, // Set the field type
        ref: "User" // Set the field to reference the User model
    }]
},
{
    toJSON: { // Enable getters
        virtuals: true, // Enable virtuals
        getters: true // Enable getters
    },
    id: false // Disable the '_id' field
}
);
UserSchema.virtual('friendCount').get(function() { // Create a virtual called 'friendCount' that retrieves the length of the user's friends array field on query
    return this.friends.length;
});
const User = model('User', UserSchema); // Create the User model using the UserSchema
module.exports = User; // Export the User model



