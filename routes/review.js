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
const { createReview, destroyReview } = require("../controllers/reviews.js");




router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview))


router.post("/",isLoggedIn ,validateReview, wrapAsync(createReview));

module.exports = router;