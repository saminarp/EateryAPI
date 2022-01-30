/************************************************************************ *********
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students. *
 * Name: Samina Rahman Purba Student ID: 101855203 Date: 2022/01/19
 * Heroku Link: https://sleepy-anchorage-77769.herokuapp.com
 * ********************************************************************************/

let restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;
// grades of restaurants
avg = (grades) => {
  let sum = 0;
  for (let i = 0; i < grades.length; i++) {
    sum = sum + grades[i].score;
  }
  let finalGrade = sum / grades.length;
  return finalGrade.toFixed(2);
};
//table template
const tableRows = _.template(
  `<% _.forEach(restaurantData, function(restaurant){ %>
     <tr data-id=<%- restaurant._id %>> 
     <td><%- restaurant.name %></td>
     <td><%- restaurant.cuisine %></td>
     <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
     <td><%- avg(restaurant.grades) %></td>
     </tr><% }); %>`
);
//fetch data
const loadRestaurantData = async () => {
  const data = await fetch(
    `https://sleepy-anchorage-77769.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  );
  const restaurants = await data.json();
  restaurantData = restaurants;
  const templateRestaurants = tableRows({ restaurants: restaurants });
  $("tbody").empty().append(templateRestaurants);
  $("#current-page").text(page);
};
//
$("#restaurant-table").on("click", "tr", function () {
  currentRestaurant = _.filter(restaurantData, {
    _id: $(this).attr("data-id"), //restaurantData array whose "_id" property matches the "data-id"
  });
  $(".modal-title").html(currentRestaurant[0].name);
  $("#restaurant-address").html(
    currentRestaurant[0].address.building +
      " / " +
      currentRestaurant[0].address.street
  );
  $("#restaurant-modal").modal();
});

$("#previous-page").on("click", function () {
  if (page > 1) {
    page--;
    loadRestaurantData();
  }
});

$("#next-page").on("click", function () {
  page++;
  loadRestaurantData();
});

function showMap() {
  const { coord } = currentRestaurant[0].address;
  map = new L.Map("leaflet", {
    center: [coord[1], coord[0]],
    zoom: 18,
    layers: [
      new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    ],
  });
  L.marker([coord[1], coord[0]]).addTo(map);
}

$("#restaurant-modal").on("hidden.bs.modal", function () {
  map.remove();
});

$(document).ready(function () {
  //data
  loadRestaurantData();
  //display map
  $("#restaurant-modal").on("shown.bs.modal", showMap);
});
