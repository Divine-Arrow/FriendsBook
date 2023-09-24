/* const mongo = {
    database: process.env.MONGODB_URI || ''
}

const google = {
    clientID : process.env.GOOGLE_GOOGLEID || '',
    clientSecret: process.env.GOOGLE_GOOGLE_SECRET || ''
}

const fb = {
    clientID : process.env.FB_FBID || '',
    clientSecret: process.env.FB_FB_SECRET || ''
}

const nodemailer = {
    service: process.env.MAILER_SERVICE || '',
    adminEmailId : process.env.MAILER_ADMIN_MAILID || '',
    adminEmailPassword: process.env.MAILER_ADMIN_PASSWORD || '',
    from: process.env.MAILER_FROM || ''
}

module.exports = {
    mongo,
    google,
    fb,
    nodemailer
} */

const mongo = {
    // database: "mongodb://127.0.0.1:27017/friendsBook"
    database: "mongodb+srv://bhupenders225:bhupenders225@mydb.g5gr5m3.mongodb.net/friendsBook?retryWrites=true&w=majority"
}

const google = {
    clientID : "870608762660-mqg6p1u406dmrhn7illo4orjo8r4lv5d.apps.googleusercontent.com",
    clientSecret: "5L0xVpRKbyBGTKAZa0nkSrE3"
}

const fb = {
    clientID : "342163789884481",
    clientSecret: "12711450318c8e04dd69583ed31fde28"
}

const nodemailer = {
    service: 'gmail',
    adminEmailId : 'divinearrowb@gmail.com',
    adminEmailPassword: 'bhupenders225',
    from: 'divinearrowb@gmail.com'
}

// https://console.developers.google.com/apis/api/legacypeople.googleapis.com/overview?project=870608762660


module.exports = {
    mongo,
    google,
    fb,
    nodemailer
}