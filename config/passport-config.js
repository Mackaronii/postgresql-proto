const LocalStrategy = require('passport-local').Strategy;
const {SHA256} = require("../SHA256_v3");
 
function initialize(passport, getUserByUsername, getUserById) {
	const authenticate = async (username, password, done) => {
		const user = getUserByUsername(username);
		if (user == null) {
			return done(null, false, { message: 'No user with that username' });
		}

		try {
			console.log("CHECKPOINT 1A: COMPARING PASSWORD TO STORED HASH");
			if (await SHA256(password) === user.password) {
				console.log("CHECKPOINT 2A: PASSWORDS MATCH");
				return done(null, user);
			} else {
				console.log("CHECKPOINT 2B: PASSWORDS DIFFER");
				return done(null, false, { message: 'Password incorrect' });
			}
		} catch (e) {
			console.log("CHECKPOINT 1B: ERROR");
			return done(e);
		}
	}
	
	
	console.log("CHECKPOINT: SETTING PASSPORT UP");
	passport.use(new LocalStrategy({ usernameField: 'username' }, authenticate))
	console.log("CHECKPOINT: SET SERIALIZE USER METHOD");
	passport.serializeUser((user, done) => {
		console.log("CHECKPOINT: SERIALIZING USER");
		return done(null, user.id)
	});
	console.log("CHECKPOINT: SET DESERIALIZE USER METHOD");
	passport.deserializeUser((id, done) => {
		console.log("CHECKPOINT: DESERIALIZING USER");
		return done(null, getUserById(id));
	});
};
 
module.exports = initialize;