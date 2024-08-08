const express = require("express");
const router = express.Router({mergeParams : true});
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");
const listings = require("../routes/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateReview, isReviewAuthor} = require("../middleware.js");

module.exports.createReview = (async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created!");
    res.redirect(`/listing/${listing._id}`);
    
});

module.exports.destroyReview = (async(req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
});