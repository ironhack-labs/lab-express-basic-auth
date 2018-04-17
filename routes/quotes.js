'use strict';

const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');

// ---------- Index ---------- //
router.get('/', (req, res, next) => {
  if (req.query.bootcamp || req.query.month || req.query.year || req.query.city) {
    // const bootcamp = req.query.bootcamp !== 'bootcamp' ? req.query.bootcamp + ' ' : '';
    // const month = req.query.month !== 'month' ? req.query.month + ' ' : '';
    // const year = req.query.year !== 'year' ? req.query.year + ' ' : '';
    // const city = req.query.city !== 'city' ? req.query.city : '';
    // const filterString = bootcamp + month + year + city;
    // console.log(filterString);
  } else {
    Quote.find({})
      .then((result) => {
        const data = { quotes: result };
        res.render('pages/quotes/index', data);
      })
      .catch(next);
  };
});

// ---------- Random ---------- //
router.get('/random', (req, res, next) => {
  Quote.find({})
    .then((result) => {
      const rand = result[Math.floor(Math.random() * result.length)];
      const data = { quote: rand };
      res.render('pages/quotes/show', data);
    })
    .catch(next);
});

// ---------- New ---------- //
router.get('/new', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('auth/login');
  };
  res.render('pages/quotes/new');
});

// ---------- Show ---------- //
router.get('/:id', (req, res, next) => {
  Quote.findOne({_id: req.params.id})
    .then((result) => {
      if (!result) {
        next();
        return;
      }
      const data = { quote: result };
      res.render('pages/quotes/show', data);
    })
    .catch(next);
});

// ---------- Create ---------- //
router.post('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('auth/login');
  };

  const quote = new Quote(req.body);
  quote.user = req.session.user;
  quote.save()
    .then(() => {
      res.redirect(`/quotes/${quote._id}`);
    })
    .catch(next);
});

// ---------- Edit ---------- //
router.get('/:id/edit', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  };
  Quote.findOne({ _id: req.params.id })
    .then((result) => {
      if (!result) {
        next();
        return;
      }
      const data = { quote: result };
      res.render('pages/quotes/edit', data);
    })
    .catch(next);
});

// ---------- Update --------- //
router.post('/:id', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  };
  const data = {
    name: req.body.name,
    photo: req.body.photo,
    quote: req.body.quote,
    user: req.body.user
  };
  Quote.update({ _id: req.params.id }, data)
    .then(() => {
      res.redirect(`/quotes/${req.params.id}`);
    })
    .catch(next);
});

// ---------- Delete ---------- //
router.post('/:id/delete', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  };
  Quote.remove({ _id: req.params.id })
    .then(() => {
      res.redirect(`/quotes`);
    })
    .catch(next);
});

module.exports = router;
