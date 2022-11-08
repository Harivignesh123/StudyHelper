const nodemailer = require('nodemailer');
const mysql = require('mysql');

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
module.exports.InitializeStreak = async(req, res) => {
    const { createNameInput } = req.body;
    console.log('creating account in mysql for checking streak');
    CreateUser(createNameInput);
}

module.exports.CheckStreak = async(req, res) => {
    const { name } = req.body;
    console.log('Checking  Users streak');
    VerifyAndUpdateStreak(name);
}

module.exports.ReturnStreak = async(req, res) => {
    console.log("=-=-=-Fetching User's streak-=-=-=");
    const { name } = req.body;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iwp"
    });
    con.connect(async function(err) {
        if (err) throw err;
        con.query("SELECT * FROM streak WHERE name = '" + name + "'", function(err, result) {
            if (err) throw err;
            streak = result[0].streak;
            res.json({ streak });
        });
    });
}

//for sending mail

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
            console.log("Sorry , Remainder Not sent some problem!" + error);
            result = false;
        } else {
            console.log('Email sent ' + info.response);
            result = true;
        }
    });
    return result;
}


//for creating account on mysql for users for their 1st login
function CreateUser(name) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iwp"
    });
    var dateToday = new Date();
    con.connect(async function(err) {
        if (err) throw err;
        con.query("INSERT INTO streak VALUES('" + name + "',1,'" + dateToday + "')", async function(err, result) {
            if (err) throw err;
            if (result) {
                console.log("User Created in MySql for Streak");
            }
        });
    });
}



//for verifying and updating streak
function VerifyAndUpdateStreak(name) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iwp"
    });
    var dateToday = new Date();
    //getting old timestamp from database
    con.connect(async function(err) {
        if (err) throw err;
        con.query("SELECT * FROM streak WHERE name = '" + name + "'", async function(err, result) {
            if (err) throw err;
            if (result) {
                updateTimeStamp(name, dateToday);
                var dateprev = new Date(result[0].timestamp);
                var diff_days = await DaysDifferenceCalculation(dateToday, dateprev);
                var flag = CheckIfToday();

                function CheckIfToday() {
                    if ((dateToday.getDate() == dateprev.getDate()) && (dateToday.getMonth() == dateprev.getMonth()) && (dateToday.getFullYear() == dateprev.getFullYear())) {
                        console.log("==== same date only ====");
                        return true;
                    } else {
                        return false;
                    }
                }
                if (Math.floor(diff_days) < 2 && flag == false) {
                    var streak = result[0].streak + 1;
                    updateStreak(streak, name);
                } else if (Math.floor(diff_days) > 1) {
                    updateStreak(1, name);
                } else {
                    console.log('--!nothing updated(last login today only and streak added already)!--');
                }
            }
        });
    });
}
// for updating streak
function updateStreak(streak, name) {
    var con3 = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iwp"
    });
    con3.connect(async function(err) {
        if (err) throw err;
        var sql = "UPDATE streak SET streak = '" + streak + "' WHERE name = '" + name + "'";
        con3.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result.affectedRows + "streak record(s) updated");
        });
    });
}
//difference between days calculation
function DaysDifferenceCalculation(dateToday, dateprev) {
    var diff_time = dateToday.getTime() - dateprev.getTime();
    var diff_days = diff_time / (1000 * 3600 * 24);
    console.log("Diiference: " + diff_days);
    return diff_days;
}

function updateTimeStamp(name, dateToday) {
    var con2 = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iwp"
    });
    con2.connect(async function(err) {
        if (err) throw err;
        var sql = "UPDATE streak SET timestamp = '" + dateToday + "' WHERE name = '" + name + "'";
        con2.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result.affectedRows + "timestamp record(s) updated");
        });
    });
}