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

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = (async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const message = "Invalid ID format";
        return res.status(400).render("error.ejs", { message });
    }
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},})
    .populate("owner");
    if (!listing) {
        req.flash("error","Listing you want is not found!");
        res.redirect("/listing");
    }
    res.render("listings/show", { listing });
});

module.exports.createListing = (async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");    
    res.redirect("/listing");
});

module.exports.renderEditForm = (async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const message = "Invalid ID format";
        return res.status(400).render("error.ejs", { message });
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing you want is not found!");
        res.redirect("/listing");
    }
    res.render("listings/edit", { listing });
});

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const message = "Invalid ID format";
        return res.status(400).render("error.ejs", { message });
    }
    let listing1 = await Listing.findById(id);
    if(!listing1.owner.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to Edit!");
        return res.redirect(`/listing/${id}`);
    }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
});

module.exports.destroyListing = (async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const message = "Invalid ID";
        return res.status(400).render("error.ejs", { message });
    }
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) {
        const message = "Listing not found";
        return res.status(404).render("error.ejs", { message });
    }
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
});