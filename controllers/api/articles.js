'use strict';
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const Article = require('../../models/article');


router.get('/', function (req, res) {
    Article
        .find({})
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(docs);
            }
        });
});


router.get('/saved', function (req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});


router.get('/deleted', function (req, res) {
    Article
        .find({})
        .where('deleted').equals(true)
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});


router.post('/save/:id', function (req, res) {
    Article.findByIdAndUpdate(req.params.id, {
            $set: {saved: true}
        },
        {new: true},
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

router.delete('/:id', function (req, res) {
    Article.findByIdAndUpdate(req.params.id,
        {$set: {deleted: true}},
        {new: true},
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/saved');
            }
        }
    );
});

router.get('/scrape', function (req, res, next) {

    request("https://www.skysports.com/f1/news", function (error, response, html) {
        let $ = cheerio.load(html);
        let single = {};

        $("div.news-list__item").each(function (i, element) {

            let title = $(element).find("a.news-list__headline-link").text();

            let link = $(element).find("a.news-list__headline-link").attr("href");

            let imgLink = $(element).find("img").attr("data-src");

            let intro = $(element).find("p").text();


            if (title !== '' && link !== undefined && link.includes('http') &&  intro !== '' && imgLink !== undefined) {

            single = {
                title: title,
                link: link,
                imageLink: imgLink,
                intro: intro
            };

            let entry = new Article(single);
            entry.save(function (err, doc) {
                if (err) {
                    if (err) {
                        console.log(err);
                    }
                } else {
                    console.log('new article added');
                }
            });
            }
        });
    next();
});
}, function(req, res) {
    res.redirect('/');
});


module.exports = router;
