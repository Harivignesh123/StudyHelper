const express = require('express');

const app = express();
const cons = require('consolidate'); //for setting html as default view engine
const Router = require('./node_routes/authroutes');
app.engine('html', cons.swig)
app.set('views', './public/html'); //setting default html files will be located  inside html folder
app.set('view engine', 'html'); //setting default engine as .html

//setting static folder requires for the project i.e style files, scripts , resources like images etc
app.use("/styles", express.static(__dirname + '/public/styles')); //for assigning static folder for styles
app.use("/scripts", express.static(__dirname + "/public/scripts")); //for assigning static folders for script files
app.use("/modules", express.static(__dirname + "/public/modules"));
app.use("/res", express.static(__dirname + "/public/res"));

app.listen(3000); //setting server to listen to the port 3000
console.log("listening");

app.use(Router);