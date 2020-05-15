const indexController = {};


//require models
const Public = require('../models/Public');
const User = require('../models/Public');
indexController.indexpage = (req, res) => {
    res.render("index");
}

indexController.allTrackesRender = async(req, res) => {
    const publics = await Public.find().lean();
    res.render("tracker/all-tracke", { publics });
}

indexController.addTracker = (req, res) => {
    res.render("tracker/add-tracke");
}

indexController.addnew = async(req, res) => {
    const { country, infect, recover, death, rest, user } = req.body;


    const newpublic = new Public({ country, infect, recover, death, rest, user });
    await newpublic.save();
    res.redirect('/allTrackes');
}
module.exports = indexController;