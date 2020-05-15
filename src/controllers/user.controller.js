const userController = {};

//extract db
const User = require('../models/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
const randomString = require('randomstring');

userController.renderForm = (req, res) => {
    res.render("user/singup");
}

userController.renderSignin = (req, res) => {
    res.render("user/login");
}

userController.addUser = async(req, res) => {
    let errors = [];
    const { name, email, password, confirm_password, phone } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 4) {
        errors.push({ text: "Passwords must be at least 4 characters." });
    }

    if (errors.length > 0) {
        res.render('user/singup', {
            errors,
            name,
            email,
            password,
            confirm_password,
            phone
        });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash("error_msg", "The Email is already in use.");
            res.redirect('/sign-up');
        } else {
            const code = randomString.generate({
                length: 12,
                charset: 'alphanumeric'
            });
            const newUser = new User({ name, email, password, phone, key: code });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            // async..await is not allowed in global scope, must use a wrapper
            async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'Covid19TrackerGlobal@gmail.com', // generated ethereal user
                        pass: 'lux1996_g' // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"Covid19 Tracker" <Covid19TrackerGlobal@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Covid Tracker Account", // Subject line
                    text: "Hello world?", // plain text body
                    html: `<h2>Hi ${newUser.name},thanks for looged in us aplication</h2>
                        <h3>your code is: ${code}</h3>
                        <h2>Confirm your account:</h2> <a href="localhost:4000/confirm-account">localhost:4000/confirm-account</a>
                    ` // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }

            main().catch(console.error);
            req.flash("success_msg", "Please verify your account, check your email");
            res.redirect('/signin');
        }
    }
};

userController.renderConfirm = async(req, res) => {
    res.render('tracker/confirm');
}

userController.getdata = async(req, res) => {
    const { code } = req.body;
    const codes = await User.findOne({ key: code });
    if (!codes) {
        req.flash("error_msg", "This code is incorrect");
        res.redirect('/confirm-account');
    } else {
        const xs = await User.findByIdAndUpdate(codes._id, { active: true });
        req.flash("success_msg", "Your account has been confirm");
        res.redirect('/signin');
    }

}


userController.enterUser = passport.authenticate("local", {
    successRedirect: "/allTrackes",
    failureRedirect: "/signin",
    failureFlash: true
});


userController.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out now.");
    res.redirect('/signin');
}



module.exports = userController;