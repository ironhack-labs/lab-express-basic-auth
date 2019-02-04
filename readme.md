![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Basic Auth


## Introduction

In this exercise, we are going to create a project where we will have all the basic authorization and authentication processes and features that you would in a real application.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_044a7b23c9b4cf082e1c4fadcd12d308.png)


## Requirements

- Fork this repo
- Clone this repo

## Submission

- Upon completion, run the following commands:

  ```
  git add .
  git commit -m "done"
  git push origin master
  ```

- Create Pull Request so your TAs can check up your work.


## Instructions

### Iteration 0 | Initialize the project

After forking and cloning the project, you will have to add a `starter_code/.env` file:

```
PORT=3000
```

And you have to install all the dependencies:


```sh
$ cd starter_code
$ npm install
```

Now you are ready to start 🚀

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

Once the user has logged in, you have to create a session with `express-session` and `connect-mongo`.

Again, we have to check out that the fields are correctly filled before try to authenticate him.

## Iteration 3 - Protected Routes

At this point, we have implemented basic authentication features. Now, we have to create some routes that are protected, meaning that users can't visit these routes unless they're authenticated.

Let's create two different routes protected by authentication:

- `/main` - Add a funny picture of a cat and a link back to the home page
- `/private` - Add your favorite `gif` and an `<h1>` denoting the page as private.

Create the views and add the middleware configuration to avoid accessing these routes without being authenticated.

## Bonus - Frontend validations

Let's add validations to our forms. Remember we have two different forms: sign up and login.

Remember, when a user signs up or logs in, both the username and password fields must be filled in.

Check out the [documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Data_form_validation) at MDN. See if you can find a *constraint* that requires the user to fill a field prior to submission.

## Bonus - Password Strength Measurement

Finally, we will add a jQuery plugin to measure the password strength when we sign up in the application. We recommend you to use the [Strength.js](http://jquerycards.com/forms/inputs/strength-js/) library, but feel free to look for another one.

Once finished, the result should be something like this:

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_b5907d78d23d2a6757a365df56bd34b9.png)

This is a very common and helpful feature for users, as many do not know anything about password strength.


## Extra Resources

- [HTML5 Form Validations](http://www.the-art-of-web.com/html/html5-form-validation/)


Happy coding! :heart:
