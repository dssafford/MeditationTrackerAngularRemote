var express = require('express');
//var passport = require('passport');
var Account = require('../schemas/account');
var entrySchema = require('../schemas/entry');
var logUserSchema = require("../schemas/logUser");

var router = express.Router();


var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect the user to the login page
    res.redirect('/');
}

function logUser (username,  type) {
    var record = new logUserSchema();

     record.timestamp = Date.now();
     record.user = username;
     record.type = type;

     record.save(function(err) {
         if (err) {
             console.log(err);
             res.status(500).json({status: 'failure'});
         } 
     });
}



module.exports = function(passport) {




    // /* GET login page. */
    // router.get('/', function(req, res) {
    //     // Display the Login page with any flash message, if any
    //     res.render('index', { message: req.flash('message') });
    // });

    // /* Handle Login POST */
    // router.post('/login', passport.authenticate('login', {
    //     successRedirect: '/entrylist',
    //     failureRedirect: '/',
    //     failureFlash : true  
    // }));

    // /* GET Registration Page */
    // router.get('/register', function(req, res){
    //     res.render('register',{message: req.flash('message')});
    // });

    // /* Handle Registration POST */
    // router.post('/register', passport.authenticate('register', {
    //     successRedirect: '/home',
    //     failureRedirect: '/register',
    //     failureFlash : true  
    // }));

    // /* GET Home Page */
    // router.get('/home', isAuthenticated, function(req, res){
    //     res.render('home', { user: req.user });
    // });

    // /* GET Home Page */
    // router.get('/homeold', isAuthenticated, function(req, res){
    //     res.render('homeold', { user: req.user });
    // });

    // /* Handle Logout */
    // router.get('/logout', isAuthenticated, function(req, res) {
    //     console.log("in logout, user=" + req.user.username);
        
    //     // log the logout
    //     logUser(req.user.username, "out")
    //     req.logout();



    //     res.redirect('home');
    // });

    /* GET Entry List Page */
    router.get('/entrylist', isAuthenticated, function(req, res){
        console.log("in entry list doug");

      entrySchema.find()
     .setOptions({sort: 'timestamp'})
     .exec(function(err, entrys) {
         if (err) {
             res.status(500).json({status: 'failure'});
         } else {
             res.render('entrys', {
                 title: 'entrys',
                 entrys: entrys,
                 user: req.user
             });
         }
     });
 });

  // Go to entry input form
     router.get('/entryinput', isAuthenticated, function(req, res) {
        console.log("in entry input doug");
         res.render('entryinput', {
             title: 'All Doug entrys',
            user: req.user
        });
 });

 // Go to entry edit form
     router.get('/entryedit/:id', isAuthenticated, function(req, res) {   
     console.log("in function entry edit");
     entrySchema.find({ _id: req.params.id})
     .exec(function(err, entrys) {
         if (err) {
             res.status(500).json({status: 'failure'});
         } else {
             console.log("not failure getting entry edit");
             res.render('entryedit', {
                 title: 'Edit entry',
                 entrys: entrys,
                 user: req.user
             });
         }
     });     
 });  

     // Update edited entry
    router.post('/entryedit/:id', isAuthenticated, function(req, res) {   
     //console.log("In updateentry");
     entrySchema.findOneAndUpdate({_id: req.params.id} , {timestamp: req.body.timestamp, user: req.body.user, minutes: req.body.minutes,  comments: req.body.comments}, function(err, record) {
         if (err) throw err;

         console.log("id:" + req.params.id);

         res.redirect("/entrylist");
     });
 });


         // Add the record data to database, from POST on form submit
            router.post('/entryinput', isAuthenticated, function(req, res) {   
             // below outputs full response to browser in json format
             //res.json(req.body);
             var record = new entrySchema();

             record.timestamp = req.body.timestamp;
             record.user = req.body.user;
             record.minutes = req.body.minutes;
             record.comments = req.body.comments;

             record.save(function(err) {
                 if (err) {
                     console.log(err);
                     res.status(500).json({status: 'failure'});
                 } else {
                     //res.json({status: 'success'});
                     res.redirect('/entrylist');
                 }
             });
         });

         router.get('/entrydelete/:id', isAuthenticated, function(req, res) {   
     
             console.log("In entry Delete");
              entrySchema.find( {_id: req.params.id}, function(err,docs){
               if (err) return console.log(err);
               if (!docs || !Array.isArray(docs) || docs.length === 0) 
                     return console.log('no docs found');
                    
                 docs.forEach( function (doc) {
                         doc.remove();
                         res.redirect("/entrylist");
                 });

           });
     });

    return router;

}