var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - display the list of campgrounds
router.get("/", function(req,res){
    //get all campgrounds from DB
    Campground.find({}, function(err,allCamps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCamps, currentUser: req.user});
        }
    })
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//CREATE - add new campground to database]
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = {name:name, price:price, image:image, description:desc, author:author};
    //create a new campground and save to DB
    Campground.create(newcampground,function(err,newcampground){
        if(err){
            console.log(err);
        }else{
            console.log(newcampground)
            res.redirect("/campgrounds")
        }
    })
});

//SHOW - shows info about one specific campground
router.get("/:id", function(req,res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //render show template with that campground
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampgound){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //redirect somewhere (Show page)
})


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;