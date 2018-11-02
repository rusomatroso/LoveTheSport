var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


var PORT = process.env.PORT || 3000;
var app = express();



app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(logger('dev'));


var exphbs = require("express-handlebars");
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(require('./controllers'));

mongoose.Promise = Promise;

mongoose.connect("mongodb://rusomatroso:zxc123@ds121311.mlab.com:21311/heroku_wfl7rl7d");
var db = mongoose.connection;


db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
db.once("open", function() {
    console.log("connection successful");
    app.listen(PORT, function() {
        console.log("App running on port" + PORT);
    });
});

module.exports = app;
