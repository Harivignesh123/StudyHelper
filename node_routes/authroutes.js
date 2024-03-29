//this page gets the url and sends the req to the authcontroller.js for further actions

const cons = require('consolidate');
const express = require('express');

const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());


const AuthController = require('../node_controllers/authcontroller');
//for redirect to the login page , if no url given
router.get('/', (req, res) => {
    res.redirect('/login');
});

//routes for other urls
router.get('/login', AuthController.login);

router.get('/SubjectPage', AuthController.SubjectPage);

router.get('/ChapterPage', AuthController.chapterpage);

router.get('/NotesPage', AuthController.notespage);

router.get('/about', AuthController.aboutpage);

router.get('/resetpassword', AuthController.resetpass);

router.get('/SetRemainder', AuthController.remainderGet);

router.post('/SetRemainder', AuthController.remainderPost);

router.post('/InitializeStreak', AuthController.InitializeStreak);

router.post('/CheckStreak', AuthController.CheckStreak);


module.exports = router;