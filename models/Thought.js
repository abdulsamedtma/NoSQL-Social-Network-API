const { Schema, model, Types } = require("mongoose"); // import the Mongoose package
const dateFormat = require("../utils/dateFormat"); // import the dateFormat module

// Reaction Schema
const ReactionSchema = new Schema(
    {
        reactionId: {
            // Mongoose's ObjectId data type
            type: Schema.Types.ObjectId,
            // Default value is set to a new ObjectId
            default: () => new Types.ObjectId(),
          },
      
          reactionBody: {
            type: String,
            required: true,
            maxlength: 300,
          },
      
          username: {
            type: String,
            required: true,
          },
      
          createdAt: {
            type: Date,
            // Set default value to the current timestamp
            default: Date.now,
            // Use a getter method to format the timestamp on query
            get: (timestamp) => dateFormat(timestamp),
          },
        },
        {
          toJSON: {
            getters: true,
          },
          id: false,
        }
      );
      
      const ThoughtSchema = new Schema(
        {
          thoughtText: {
            type: String,
            required: "Thought is Required",
            minlength: 15,
            maxlength: 300,
          },
      
          createdAt: {
            type: Date,
            default: Date.now,
            // Use a getter method to format the timestamp on query
            get: (timestamp) => dateFormat(timestamp),
          },
      
          username: {
            type: String,
            required: true,
          },
      
          // array of nested documents created with the reactionSchema
          reactions: [ReactionSchema],
        },
        {
          toJSON: {
            virtuals: true,
            getters: true,
          },
          id: false,
        }
      );
      
      ThoughtSchema.virtual("reactionCount").get(function () {
        return this.reactions.length;
      });
      
      const Thought = model("Thought", ThoughtSchema);
      
      module.exports = Thought; // export the Thought model
    