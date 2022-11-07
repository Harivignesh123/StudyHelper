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
module.exports.remainderPost = async(req, res) => {
    console.log("server side");
    const { email, setdate, title } = req.body;
    //var ismailsend = sendmail(email);
    try {
        var ismailsend = await sendmail(email, title, setdate);
        if (ismailsend == true) {
            console.log("success", ismailsend, " ", setdate);
            res.status(201).json({ msg: `Hello , your remainder sent successfully` });
        } else {
            console.log("Sorry", ismailsend);
            res.status(201).json({ msg: `Hello , your remainder not sent successfully` });
        }


        //res.json({ email });
    } catch (e) {
        var msg = "sorry";
        res.status(400).json({ msg });
    }
}

function sendmail(email, title, date) {
    var result = true;
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
        text: "Hii!, this is to inform you that your Assignment " + title + " have deadline on " + date
    };
    transporter.sendMail(mailoptions, async function(error, info) {
        if (error) {
            console.log("im here" + error);
            result = false;
        } else {
            console.log('Email sent ' + info.response);
            result = true;
        }
    });
    return result;
}
//console.log(sendmail('kiruthick101@outlook.com'));