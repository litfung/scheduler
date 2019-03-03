const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Group = mongoose.model('Group');

// User Login Function
const loginUser = async ({ email, password, req }) => {
	return new Promise((resolve, reject) => {
		passport.authenticate('local', (err, user) => {
			if (err) reject(err);
			if (!user) reject('Invalid credentials');

			req.logIn(user, (err) => {
				if (err) reject(err);

				user.password = null;
				resolve(user);
			});
		})({ body: { email, password } });
	});
};

// User Register Function
const registerUser = async ({ name, email, password, req }) => {
	if (!email || !password) throw new Error('You must provide an email and password');

	// Querying existing user with the Email
	const oldUser = await User.findOne({ email, googleId: { $exists: false }, facebookId: { $exists: false } });
	if (oldUser) throw new Error('Email in use');

	// Saving new User
	const newUser = await new User({
		name,
		email,
		password,
		avatar_url: `/avatar_url/${name.match(/^[a-zA-Z]{1}/) ? name.split('')[0].toLowerCase() : 'a'}.png`
	}).save();

	await new Group({
		title: 'Tasks',
		_rank: 0,
		_isPermanent: true,
		_creator: newUser._id
	}).save();

	return new Promise((resolve, reject) => {
		req.logIn(newUser, (err) => {
			if (err) {
				reject(err);
			}

			newUser.password = null;
			resolve(newUser);
		});
	});
};

module.exports = { registerUser, loginUser };
