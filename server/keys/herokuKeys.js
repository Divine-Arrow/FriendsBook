const mongo = {
    database: process.env.MONGODB_URI
}

const google = {
    clientID : process.env.GOOGLE_GOOGLEID,
    clientSecret: process.env.GOOGLE_GOOGLE_SECRET
}

module.exports = {
    mongo,
    google
}