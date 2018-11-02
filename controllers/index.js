'use strict';
const express = require('express');
const router = express.Router();
const Article = require('../models/article');


router.get('/', function(req, res) {
    Article
        .find({})
        .where('saved', 'deleted').equals(false)
        .sort('-date')
        .limit(10)
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
            } else {
                let hbsObj = {
                    welcomeMsg: 'Here is the list of scraped articles:',
                    articles: articles
                };
                res.render('index', hbsObj);
            }
        });
});

router.get('/saved', function(req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .sort('-date')
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
            } else {
                console.log(articles);
                let hbsObj = {
                    welcomeMsg: 'Here is the list of your saved articles',
                    articles: articles
                };
                res.render('saved', hbsObj);
            }
        });
});

router.use('/api', require('./api'));

module.exports = router;
