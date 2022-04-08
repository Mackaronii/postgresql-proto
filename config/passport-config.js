const LocalStrategy = require('passport-local').Strategy;
const {SHA256} = require("../SHA256_v3");
 
function initialize(passport, getUserByUsername, getUserById) {
	const authenticate = async (username, password, done) => {
		const user = getUserByUsername(username);
		if (user == null) {
			return done(null, false, { message: 'No user with that username' });
		}

		try {
			if (await SHA256(password) === user.password) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Password incorrect' });
			}
		} catch (e) {
			return done(e);
		}
	}
	
	
	passport.use(new LocalStrategy({ usernameField: 'username' }, authenticate))
	passport.serializeUser((user, done) => {
		return done(null, user.id)
	});
	passport.deserializeUser((id, done) => {
		return done(null, getUserById(id));
	});
};
 
module.exports = initialize;