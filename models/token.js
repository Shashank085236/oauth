//model that will store our access tokens. Access tokens are the final step in the OAuth2 process. 
//With an access token, an application client is able to make a request on behalf of the use
// A particular user and client pair can hold a token

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
  value: { type: String, required: true }, //access token value
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);