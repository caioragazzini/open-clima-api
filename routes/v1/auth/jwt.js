const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { User } = require('../../../models');



passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY 
    },async (jwtPayload, done) => {
        try{
            const usuario = await User.findOne({
                _id: jwtPayload.id, 
                confirmado: true,
        });
            console.log("🚀 ~ usuario:", usuario)
            done(null, usuario);

        }catch(err){
            done(err);
        }
    }
))