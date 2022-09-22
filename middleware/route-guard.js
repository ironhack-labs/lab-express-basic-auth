//middleware/route-guard.js

//checks if the user is logged in when trying to access a specific page


const isLoggedIn = ( request, response, next) => {
    if(!request.session.currentUser){
        return response.redirect('/login');
    }
    next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page

const isLoggedOut =(request, response, next) =>{
    if(request.session.currentUser){
        return response.redirect('/');
    }
    next();
}

module.exports = {
    isLoggedIn,
    isLoggedOut

}