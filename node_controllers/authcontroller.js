const nodemailer = require('nodemailer');
const mysql = require('mysql');
const initialStreak=1;

let con=null;
function InitializeDatabaseConnection(){
    con= mysql.createConnection({
        host: "b4bskferou4xvjc2kbiv-mysql.services.clever-cloud.com",
        user: "uqn7o0kzuzjvdzff",
        password: "ATSZ6BwDDDGDjT9WJmhs",
        database: "b4bskferou4xvjc2kbiv"
    });
}

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
let newStreak;
module.exports.InitializeStreak = async(req, res) => {
    const { mailID } = req.body;
    console.log('creating account in mysql for checking streak');
    CreateUser(mailID,res);

}

module.exports.CheckStreak = async(req, res) => {
    const { mailID } = req.body;
    console.log('Checking  Users streak');
    VerifyAndUpdateStreak(mailID,res);
    
    

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
function CreateUser(mailID,res) {

    InitializeDatabaseConnection();
    con.connect(function(err) {
        if (err) throw err;
        con.query("INSERT INTO streak VALUES('" + mailID + "',"+initialStreak+"," + "CURRENT_TIMESTAMP" + ")",function(err, result) {
            if (err) throw err;
            if (result) {
                console.log("User Created in MySql for Streak");
            }
            const newStreak=initialStreak;
            res.json({newStreak});
            con.end();
        });
    });
}



//for verifying and updating streak
function VerifyAndUpdateStreak(mailID,res) {
    

    InitializeDatabaseConnection();
    con.connect(function(err) {
        if (err){
            throw err;
        }
        console.log("Database connection successful");
        con.query("SELECT * FROM streak WHERE mailID = '" + mailID + "'",function(err, result) {
            if (err) throw err;
            if (result) {

            
                let oldDate=null;
                let currentDate=new Date();
                let nextDate=new Date();

            
                if(result[0].timestamp!=null){
                    oldDate = new Date(result[0].timestamp);
                    currentDate=new Date();
                    nextDate=new Date();
                    nextDate.setDate(oldDate.getDate()+1);   
                }
                
            
                currentStreak=result[0].streak;
  
                
                // console.log("Old date: "+oldDate);
                // console.log("Current date: "+currentDate);
                // console.log("Next date: "+nextDate);

                con.end();
                let newStreak;
                if(oldDate==null||CheckIfNextDay(currentDate,nextDate)){
                    if(oldDate==null){
                        console.log("First day");
                    }
                    else{
                        console.log("Consecutive day");
                    } 
                    updateStreak(currentStreak+1,mailID);
                    newStreak=currentStreak+1;
                   

                }
                else if(CheckIfToday(oldDate,currentDate)){
                    console.log("Same Day");
                    updateStreak(currentStreak,mailID);  
                    newStreak=currentStreak;  
                
                }
                else{
                    console.log("Not consecutive day");
                    updateStreak(initialStreak,mailID);
                    newStreak=currentStreak+1;
                
                }
                
                res.json({newStreak});
                

            }
        });
       
    });
    
}
// for updating streak
function updateStreak(streak,mailID) {
    InitializeDatabaseConnection();
    con.connect(function(err) {
        if (err) throw err;
        var sql = "UPDATE streak SET streak ="+streak+",timestamp="+"CURRENT_TIMESTAMP"+" WHERE mailID = '" + mailID + "';";
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result.affectedRows + "streak record(s) updated");
            con.end();
            
        });
        
    });
  
}


function CheckIfNextDay(currentDate,nextDate) {
    if(currentDate.getDate()==nextDate.getDate()&&currentDate.getMonth()==nextDate.getMonth()&&currentDate.getFullYear()==nextDate.getFullYear()){
        return true;
    }
    else{
        return false;
    }

    
}
function CheckIfToday(oldDate,currentDate){
    if(currentDate.getDate()==oldDate.getDate()&&currentDate.getMonth()==oldDate.getMonth()&&currentDate.getFullYear()==oldDate.getFullYear()){
        return true;
    }
    else{
        return false;
    }

}


