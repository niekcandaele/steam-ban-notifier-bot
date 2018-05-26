// policies/isLoggedIn.js
module.exports = async function (req, res, proceed) {

    if (req.session.userId) {
      return proceed();
    }
  
    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.redirect('/login');
  
  };