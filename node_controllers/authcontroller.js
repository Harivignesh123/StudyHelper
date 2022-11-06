const nodemailer = require('nodemailer');
module.exports.SubjectPage = (req, res) => {
    res.render('SubjectPage');
}

module.exports.login = (req, res) => {
    res.render('login');
}
module.exports.chapterpage = (req, res) => {
    res.render('ChapterPage');
}
module.exports.notespage = (req, res) => {
    res.render('NotesPage');
}
module.exports.aboutpage = (req, res) => {
    res.render('AboutPage');
}
module.exports.resetpass = (req, res) => {
    res.render('ResetPasswordPage');
}
module.exports.remainderGet = (req, res) => {
    res.render('SetRemainder');
}
module.exports.remainderPost = (req, res) => {
    const { setdate, email } = req.body;
    var transporter = nodemailer.createTransport({
        service: 'hotmail',

        auth: {
            user: 'studyhelperiwp@outlook.com',
            pass: 'vitvellore#tn23'
        }
    });
    var mailoptions = {
        from: 'studyhelperiwp@outlook.com',
        to: email,
        subject: 'Remainder on Your academic deadline',
        text: "You have a due on" + setdate
    };
    try {

    } catch (e) {
        res.status(400).json({ e });
    }
}

function sendmail() {
    transporter.sendMail(mailoptions, function(error, info) {
        if (error) {
            console.log("im here" + error);
            return false;
        } else {
            console.log('Email sent ' + info.response);
            true;
        }
    });
}