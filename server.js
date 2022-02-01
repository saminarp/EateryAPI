/************************************************************************ *********
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students. *
 * Name: Samina Rahman Purba Student ID: 101855203 Date: 2022/01/19
 * Heroku Link: https://sleepy-anchorage-77769.herokuapp.com
 * ********************************************************************************/

const express = require("express");
const app = express();
const cors = require("cors");
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB(
  "mongodb+srv://samina:butan@cluster0.xc8rw.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
);
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/css", express.static(`${__dirname}/css`));
app.use("/js", express.static(`${__dirname}/js`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/api/restaurants", (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants) => {
      res.status(200).json(restaurants);
      return;
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});
// add restaurant with required data
app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then((data) => {
      res.status(201).json(`Restaurant ${data} added`);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
//ID
// get one restaurant by id
app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      if (restaurant === null) {
        res
          .status(404)
          .json({ message: "Restaurant id has already been deleted" });
        return;
      }
      res.status(200).json(restaurant);
    })
    .catch(() => {
      res.status(404).json({ message: "Restaurant id does not exist" });
      return;
    });
});
//update restaurant by id with required data
app.put("/api/restaurants/:id", (req, res) => {
  db.updateRestaurantById(req.body, req.params.id)
    .then((data) => {
      if (Object.keys(req.body).length === 0) {
        return res.status(500).json({ message: `data : ${data.message}` });
      }
      res.status(201).json(`Restaurant ${req.params.id} got updated`);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});
//delete restraunt by _id
app.delete("/api/restaurants/:id", (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
});
//port
db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`app listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Err occured in DB initialization: ${err}`);
  });
