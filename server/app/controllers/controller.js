module.exports = {
  loginForm: function(req, res) {
    res.render('login');
  },

  signupForm: function(req, res) {
    res.render('signup');
  },

  renderIndex: function(req, res) {
    res.render('index');
  }
};
