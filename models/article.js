'use strict';
const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false
    }]
});



const Article = mongoose.model("Article", ArticlesSchema);

module.exports = Article;
