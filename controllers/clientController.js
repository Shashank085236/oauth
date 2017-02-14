// A logged in user can ave multiple clients

// Load required packages
var Client = require('../models/client');

// Create endpoint /api/client for POST
exports.postClients = (req, res) => {
  // Create a new instance of the Client model
  var client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client.id = req.body.id;         // We could have decided to auto generate it.
  client.secret = req.body.secret; // We could have decided to auto generate it.
  client.userId = req.user._id;

  // Save the client and check for errors
  client.save((err) => {
    if (err)
      res.send(err);

    res.json({ message: 'Client added to the locker!', data: client });
  });
};

// Create endpoint /api/clients for GET
exports.getClients = (req, res) => {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, (err, clients) => {
    if (err)
      res.send(err);

    res.json(clients);
  });
};