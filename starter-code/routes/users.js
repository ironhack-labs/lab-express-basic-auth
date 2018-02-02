const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("/", {
    username: "Create a username",
    password: "Create a password"
  });
});

router.post("/", (req, res, next) => {
  const productInfo = {
    name: req.body.name,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  };

  const newProduct = new Product(productInfo);

  newProduct.save(err => {
    if (newProduct.errors) {
      return res.render("products/new", {
        title: "Create a product",
        errors: newProduct.errors,
        product: newProduct
      });
    }
    if (err) {
      return next(err);
    }
    // redirect to the list of products if it saves
    return res.redirect("/products");
  });
});
