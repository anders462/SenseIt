module.exports = {
    'secretKey': process.env.SECRET_KEY,
    'mongoUrl' : process.env.MONGO_URI,
    'facebook': {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }
}
