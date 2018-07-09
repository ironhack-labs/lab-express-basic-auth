![](https://i.imgur.com/1QgrNNw.png)

# PP | Basic Auth

## Learning Goals

After this learning unit, you will be able to:

- Implement basic authorization, using Express, BCrypt, Mongo, and Mongoose.
- Implement basic authentication, using Express, BCrypt, Mongo, and Mongoose.
- Handle server-side errors.
- Validate fields on the client side.
- Create a *protected* route.

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

Please, push every file needed to make your app properly to Github before creating the pull request.

## Introduction

In this Pair Programming exercise, we are going to create a project where we will have all the basic authorization and authentication processes and features that you would in a real application.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_044a7b23c9b4cf082e1c4fadcd12d308.png)

Go ahead and generate a new project using Ironhack Generator.

## Iteration 1 - Sign Up

We have to create the signup of the application, that allow our users to register. The users have to provide the following information:

- **Username**: Must be unique in our application, and will identify each user.
- **Password**: Must be encrypted, using `bcrypt`.

To complete this first iteration, you have to create the database model with mongoose, the routes, and the views.

Remember that you have to handle validation errors when a user signs up:

- The fields can't be empty.
- The username can't be repeated.

## Iteration 2 - Login

Once the user has signed up, he has to be able to log in the application. You have to create the view and add the correct functionality in the controller to let them log in the application.

Once the user has logged in, you have to create a session with `express-session` and `mongo-connect`.

Again, we have to check out that the fields are correctly filled before try to authenticate him.

## Iteration 3 - Protected Routes

At this point, we have implemented basic authentication features. Now, we have to create some routes that are protected, meaning that users can't visit these routes unless they're authenticated.

Let's create two different routes protected by authentication:

- `/main` - Add a funny picture of a cat and a link back to the home page
- `/private` - Add your favorite `gif` and an `<h1>` denoting the page as private.

Create the views and add the middleware configuration to avoid accessing these routes without being authenticated.

## Bonus - Front-End validations

Let's add validations to our forms. Remember we have two different forms: sign up and login.

Remember, when a user signs up or logs in, both the username and password fields must be filled in.

Check out the [documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Data_form_validation) at MDN. See if you can find a *constraint* that requires the user to fill a field prior to submission.

## Bonus - Password Strength Measurement

Finally, we will add a jQuery plugin to measure the password strength when we sign up in the application. We recommend you to use the [Strength.js](http://jquerycards.com/forms/inputs/strength-js/) library, but feel free to look for another one.

Once finished, the result should be something like this:

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_b5907d78d23d2a6757a365df56bd34b9.png)

This is a very common and helpful feature for users, as many do not know anything about password strength.

## Summary

Once you are done with this exercise, you will have an excellent [boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code) that will include the basics of authorization and authentication.

## Extra Resources

- [Boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code)
- [HTML5 Form Validations](http://www.the-art-of-web.com/html/html5-form-validation/)
