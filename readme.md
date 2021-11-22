# Nada+



<img src="C:\Users\Ricardo Franco\Downloads\nada+picture.jpg"  />



## Description

This is a website of an existing company of natural soup. Here you can find 100% natural products that you can trust. In the website the users can have access to all the details of the products.  Can also, add new product suggestions, edit and delete them.  



## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **homepage** - As a user I want to be able to access the homepage and view a collection of products, log in, sign up and know more about us

- **sign up** - As a user I want to sign up on the web page so that I can add favorite soaps to my list, suggest new products and review them

- **login** - As a user I want to be able to log in on the web page so that I can get back to my account

- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account

- **favorite list** - As a user I want to see the list of my favorites and edit and delete them

- **edit user** - As a user I want to be able to edit my profile

  



<br>



## Server Routes (Back-end):



| **Method** | **Route**                    | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                          | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      | `/login`                     | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                     | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                    | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                    | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                    |
| `GET`      | `/private/edit-profile`      | Private route. Renders `edit-profile` form view.             |                                                          |
| `PUT`      | `/private/edit-profile`      | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, [firstName], [lastName], [imageUrl] } |
| `GET`      | `/private/favorites`         | Private route. Render the `favorites` view.                  |                                                          |
| `DELETE`   | `/private/favorites/:soapId` | Private route. Deletes the existing favorite from the current user. |                                                          |
| `GET`      | `/soaps`                     | Renders `soaps-list` view.                                   |                                                          |
| `GET`      | `/soaps/details/:id`         | Renders `soaps-details` view for the particular soap.        |                                                          |
|            |                              |                                                              |                                                          |





## Models



User model

```javascript
{
  username: String,
  email: String,
  password: String,
  favorites: [FavoriteId]
}

```



Soap model

```javascript
{
  name: String,
  description: String,
  durability: String,
  weight: Number,
  price: Number
}

```



## Backlog

https://miro.com/app/board/o9J_liYQqSQ=/



## Links



### Git

 Repository - https://github.com/PauloFerreira753/Nada.git



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

### Contributors
Paulo Ferreira - [`<PauloFerreira753>`](https://github.com/person1-username) - [`<linkedin-profile-link>`](https://www.linkedin.com/in/person1-username)

Ricardo Franco - [`<RicardoAFranco>`](https://github.com/person2-username) - [`<linkedin-profile-link>`](https://www.linkedin.com/in/person2-username)
