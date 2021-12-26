const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        //To remove the hashed password from response after signup was successful
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({
            user
        });
    });
};