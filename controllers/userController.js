// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = (req, res) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save((err) => {
    if (err)
      res.send(err);

    res.json({ message: 'New beer drinker added to the locker room!' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = (req, res) => {
  User.find((err, users) => {
    if (err)
      res.send(err);

    res.json(users);
  });
};