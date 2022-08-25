function guest (req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}

module.exports = guest

// Above function is used to block the user from going to login page even after user is logged in by changing url what this does is it check wether the user is logged in or not if user is logged in then it redirects the user to home page if not than it allows user to go to login page 

// isAuthenticated is a method of passport