require('dotenv').config();
const app = require('./server');
const colors = require('colors');
require('./database');




app.listen(app.get('port'), () => {
    console.log("Listening on port: ", app.get('port'));
});