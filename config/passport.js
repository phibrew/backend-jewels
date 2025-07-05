import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';

export async function setupPassport(){
    // console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID); // should not be undefined
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            accessType: 'offline', // 'offline' to get refresh token
            prompt: 'consent', // 'consent' to ensure refresh token
        },
        async (accessToken, refreshToken, profile, done) => {
            try { 
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    await user.save(); // Save the updated user document
                }else {
                    user = await new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile._json.picture,
                    }).save();
                }
                return done(null, user)
            } catch (error) {
                return done(error, null);
            }
        })
    );
    // Serialize and deserialize user instances to and from the session
    // This is used to store user information in the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
        //serialize the user id to the session

    passport.deserializeUser((id, done) => {
        try {
            User.findById(id).then((user) => {
                done(null, user);
            });
            //deserialize the user id from the session
        } catch (error) {
            done(error, null);
        }
    })
} 

