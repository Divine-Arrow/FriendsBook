const mongo = {
    database: process.env.MONGODB_URI
}

const google = {
    clientID : process.env.GOOGLE_GOOGLEID,
    clientSecret: process.env.GOOGLE_GOOGLE_SECRET
}

const fb = {
    clientID : process.env.FB_FBID,
    clientSecret: process.env.FB_FB_SECRET
}

const nodemailer = {
    service: process.env.MAILER_SERVICE,
    adminEmailId : process.env.MAILER_ADMIN_MAILID,
    adminEmailPassword: process.env.MAILER_ADMIN_PASSWORD,
    from: process.env.MAILER_FROM
}

module.exports = {
    mongo,
    google,
    fb,
    nodemailer
}