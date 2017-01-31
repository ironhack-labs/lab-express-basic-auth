![](https://i.imgur.com/1QgrNNw.png)

# PP | Basic Auth

## Learning Goals

After this learning unit, you will be able to:

- Create a basic authorization, using Express, BCrypt, Mongo, and Mongoose.
- Create a basic authentication, using Express, BCrypt, Mongo, and Mongoose.
- Control the error in the server-side.
- Validate the fields in the client-side.
- Create a route protected with username and password.

## Requirements

- [Fork this repo](https://guides.github.com/activities/forking/)
- Clone this repo into your `~/code/labs/` folder

## Submission

Upon completion, run the following commands:

```bash
$ git add .
$ git commit -m "done"
$ git push origin master
```

Navigate to your repo and create a Pull Request -from your master branch to the original repository master branch.

In the Pull Request name, add your Campus city, your name, and your last name separated by a dash.

## Deliverables

Please, push every file needed to make your app properly on Github before creating the pull request.

## Introduction

In this Pair Programming exercise, we are going to create a project where we will have all the basic authorization and authentication process that we could have in a website.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_dc768775637b02ee201ec3412eaf7bee.png)

We provide you an starter code that includes some of the packages you will need to complete the exercise. This packages are `ejs`, `mongodb`, and `mongoose`, and we have generated them with the express generator.

## Iteration 1 - Sign Up

First of all, we have to create the signup of the application, that allow our users to register in the application. The users have to indicate the following information:

- Username. It has to be unique in the database, and it will identify each user.
- Password. It has to be encrypted, using `bcrypt`.

To accomplish this first iteration, you have to create the database model with mongoose, the route, the controller, and the view.

Remember that you have to control the errors when the user is signing up:

- The fields can't be empty.
- The username can't be repeated.

## Iteration 2 - Login

Once the user has signed up, he has to be able to log in the application. You have to create the view and add the correct functionality in the controller to let them log in the application.

Once the user has logged in, you have to create a session with `express-session` and `mongo-connect`.

Again, we have to check out that the fields are correctly filled before try to authenticate him.

## Iteration 3 - Protected routes

At this point, we have done all the authentication process. Now, we have to create some routes that are protected so the users can't visit them without being authenticated.

Let's create two different routes protected by authentication: main page and private page. You have to create the views and add the middleware configuration to avoid accessing them without being authenticated.

## Iteration 4 - Front-End validations

Now, we are going to add some validations in our forms. Remember we have two different forms: sign up and login.

Remember that the different inputs we have can't be empty to save/login the user. Check out the [documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Data_form_validation) and try to find how we can ensure that the fields are not empty in the front-end.

## Iteration 5 - Password Strength Measurement

To finish up with the exercise, we will add a jQuery plugin to measure the password strength when we sign up in the application. We recommend you to apply the [Strength.js](http://jquerycards.com/forms/inputs/strength-js/) you can find in jQuery Cards, but feel free to look for another one.

Once it's applied, the result should be something like this:

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_59bb37a85da33b090817fcb181dc7a33.png)

This will be very helpful to our users, to let them know how sure is the password they are going to use to log in our application.

## Summary

Once you are done with this exercise, you will have an excellent [boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code) that will include the basics of authorization and authentication.

## Extra Resources

- [Boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code)
- [HTML5 Form Validations](http://www.the-art-of-web.com/html/html5-form-validation/)
