var nodemailer = require('nodemailer');
var keys = require('./keys/keys');

var transporter = nodemailer.createTransport({
    service: keys.nodemailer.service,
    auth: {
        user: keys.nodemailer.adminEmailId,
        pass: keys.nodemailer.adminEmailPassword
    }
});




var send = function (email, link, callback) {
    const mailOptions = {
        from: keys.nodemailer.from,
        to: email,
        subject: 'verification',
        html: `<p>Click this link to verify <a href="${link}">${link}</p>`
    };
    transporter.sendMail(mailOptions, function (err) {
        if (err)
            return callback(err);
        return callback(null, true);
    });
};

module.exports.send = send;