const mongoose = require('mongoose');
const colors = require('colors');

const mongo_uri = process.env.MONGODB_URI;
mongoose.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log("DB is connected to:"))
    .catch(err => console.log(err));