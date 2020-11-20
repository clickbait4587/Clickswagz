
const User = require("../models/user");
const passport = require("passport");
exports.signup = (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        next(err);
        //return next(err);
        res.redirect('/signup')
      }
      //console.log(user);
      passport.authenticate("local")(req, res, function () {
        res.writeHead(302, {
          Location: "/",
        });
        res.end();
      });
    }
  );
  //res.redirect("/");
};
