const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");
const listings = require("../routes/listing.js")
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const path = require('path');
const multer = require("multer");
const {storage} = require(path.resolve(__dirname, '../cloudConfig.js'));
const upload = multer({storage});


const listingController = require("../controllers/listing.js");
const { index } = require("../controllers/listing.js");
const { renderNewForm } = require("../controllers/listing.js");
const { showListing } = require("../controllers/listing.js");
const { createListing } = require("../controllers/listing.js");
const { renderEditForm } = require("../controllers/listing.js");
const { updateListing } = require("../controllers/listing.js");
const { destroyListing } = require("../controllers/listing.js");



//Index route
router.get("/", wrapAsync(index));

//New route
router.get("/new",isLoggedIn, renderNewForm);

//Create Route
router.post("/", isLoggedIn,upload.single("listing[image]"),validateListing
 ,wrapAsync(createListing));




//update Route
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(updateListing));

//Show Route
router.get("/:id", wrapAsync(showListing));


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(renderEditForm));


//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(destroyListing));

module.exports = router;