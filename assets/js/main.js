// global variables
let zomatoCoords = [];
let yelpFoodCoords = [];

// food search & parse function - zomato
let zomatoFood = (() => {
  let zomatoFoodArray = [];
  
  // Zomato API call to convert user city to Zomato ID
  let userCity = $('#user-city').val();
  let userFood = $('#user-food').val();
  let zomatoLocation = `https://developers.zomato.com/api/v2.1/locations?query=${userCity}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
  $.ajax(zomatoLocation).done((response) => {
    // console.log(response);
    console.log(`${userCity}'s Zomato ID is: ${response.location_suggestions[0].city_id}`);
    let cityId = response.location_suggestions[0].city_id;

    // Zomato API call to find restaurants that match user preference
    let zomatoSearch = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${userFood}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
    $.ajax(zomatoSearch).done((response) => {
      // console.log(response);
      response.restaurants.forEach((element) => {
        zomatoFoodArray.push(element.restaurant.user_rating.aggregate_rating);
      })
      let highestRating = 0;
      for (var i = 0; i < zomatoFoodArray.length; i++) {
        if (zomatoFoodArray[i] > highestRating) {
          highestRating = zomatoFoodArray[i]
        }
      }
      let foodIndex = zomatoFoodArray.indexOf(highestRating);
      let zRestName = response.restaurants[foodIndex].restaurant.name;
      let zRestAddress = response.restaurants[foodIndex].restaurant.location.address;
      let zRestId = response.restaurants[foodIndex].restaurant.R.res_id;
      zomatoCoords.push(Number(response.restaurants[foodIndex].restaurant.location.latitude));
      zomatoCoords.push(Number(response.restaurants[foodIndex].restaurant.location.longitude));
      // console.log(zomatoCoords);

      // Zomato API call to find image for restaurant
      let zomatoImageSearch = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${zRestId}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
      $.ajax(zomatoImageSearch).done((response) => {
        // console.log(response);
        // console.log(response.thumb.indexOf('?'));
        // console.log(response.thumb.substring(0, response.thumb.indexOf('?')));
        zRestImage = response.thumb.substring(0, response.thumb.indexOf('?'));
        $('#z-image').attr('src', zRestImage);
      })
      console.log(`Zomato's best ${userFood} in ${userCity}: ${zRestName}, ${zRestAddress}`);
      $('#z-restaurant').text(zRestName);
      $('#z-address').text(zRestAddress);
    })
  })
});

// food search & parse function - yelp
let yelpFood = (() => {
  let yelpFoodArray = [];
  
  // Yelp API call to find restaurants that match user preference
  let userCity = $('#user-city').val();
  let userFood = $('#user-food').val();
  let yelpLocation = {
    url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${userFood}&location=${userCity}`,
    method: 'GET',
    headers: {
      Authorization: 'Bearer rEpGNbuPEtWijrh_hheEA3geN__9AU6-9pAfhz9TeK3kfryuq9M1GJV8C4BzKguvl4GxIEZJ8eh4M-Tg62mYc2ULw93WVcLLNMaK3gT6jN_W_qB2sHRmqM0rdLBMXHYx'
    }
  };
  $.ajax(yelpLocation).done((response) => {
    console.log(response);
    response.businesses.forEach((element) => {
      yelpFoodArray.push(element.review_count);
    })
    let highestRating = 0;
    for (var i = 0; i < yelpFoodArray.length; i++) {
      if (yelpFoodArray[i] > highestRating) {
        highestRating = yelpFoodArray[i];
      }
    }
    let foodIndex = yelpFoodArray.indexOf(highestRating);
    let addressArray = [];
    for (var i = 0; i < response.businesses[foodIndex].location.display_address.length; i++) {
      addressArray.push(response.businesses[foodIndex].location.display_address[i]);
    }
    let yRestName = response.businesses[foodIndex].name;
    let yRestAddress = addressArray.join(' ');
    let yRestImage = response.businesses[foodIndex].image_url;
    yelpFoodCoords.push(response.businesses[foodIndex].coordinates.latitude);
    yelpFoodCoords.push(response.businesses[foodIndex].coordinates.longitude);
    // console.log(yelpFoodCoords);
    console.log(`Yelp's best ${userFood} in ${userCity}: ${yRestName}, ${yRestAddress}`);
    $('#y-restaurant').text(yRestName);
    $('#y-address').text(yRestAddress);
    $('#y-image').attr('src', yRestImage);
  })
});

//function calls the eventBrite API 
function eventBriteData() {

    var userInput = $("#user-event").val() || "music";
    var location = $("#user-city").val() || "75206";
    console.log(userInput);

    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + userInput + "&location.address=" + location + "&token=D6XUTCDEZDOKRNBW4HNT";
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        }).then(function (myJson) {
            processData(myJson);
        })
};

//Displaying the EventBrite information 
function processData(data) {
    var randomEventEB = Math.floor(Math.random() * 10)
    console.log(randomEventEB);
    var topEventEB = data.events[randomEventEB];
    console.log(topEventEB)

    var EventDescriptionEB = topEventEB.description.text;
    var eventNameEB = topEventEB.name.text;
    //var eventLogoEB =  topEventEB.logo.original.url;

    // $("#eb-image").attr("src", eventLogoEB);
   
    $("#eb-link").text(EventDescriptionEB);
    $("#eb-name").text(eventNameEB);
    console.log(EventDescriptionEB);


    // $("#eb-name").text(eventBriteData);
    // var newEventEB = $("<div>");
    // var eventNameEB = $("<p>").text(topEventEB.name.text);
    // var eventLocalEB = $("<p>").text(topEventEB.end.local);

    // newEventEB.append(eventNameEB);
    // newEventEB.append(eventLocalEB);
    // newEventEB.append(EventDescriptionEB);
    // newEventEB.append(eventLogoEB);
    // $("#events").append(newEventEB);

}

//ticketMaster api call
function ticketMasterData() {
    //Need to figure out how to call the dates within the API.
    // var startDate = $("#start-date").val() || "2019-01-29";
    // var endDate = $("#end-date").val() || "2019-01-31";
    
    var userInput = $("#user-event").val() || "music";
    var location = $("#user-city").val() || "75206";
    var gueryTicketMasterURL = "https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.json?classificationName=" + userInput + "&city=" + location + "&apikey=04jxM0zqluq8H37dKHJOEiYw8CTNalD5";

    fetch(gueryTicketMasterURL)
        .then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (myJsonTM) {
            console.log(myJsonTM);
            displayEventData(myJsonTM);

        });
}

// Function to dispalay the Ticketmaster data information 
function displayEventData(eventData) {
    console.log(eventData);
    var randomEventTM = Math.floor(Math.random() * 10)
    console.log(randomEventTM);
    var topEventTicketMaster = eventData._embedded.events[randomEventTM];
    console.log(topEventTicketMaster)

    var newEventTM = $("<div>");
    var eventNameTM = topEventTicketMaster.name;
    console.log(topEventTicketMaster.name);
    var EventDescriptionTM = topEventTicketMaster.dates.start.localDate;
    // var eventLocalTM = $("<p>").text(topEventTicketMaster.dates.start.localTime);
    // var eventLogoTM = $("<img>").attr('src', topEventTicketMaster.images[0].url);
    var TMLink = topEventTicketMaster.url;
    // var eventLinkTMDiv = $("<a>").attr("href", TMLink).text("Link")
    console.log(TMLink);


    $("#tm-name").text(eventNameTM);
    $("#tm-info").text(EventDescriptionTM);
    // $("#tm-address").attr("href", TMLink).text("Link")

//    newEventTM.append(eventNameTM );
//     newEventTM.append(eventLocalTM);
//     newEventTM.append(EventDescriptionTM);
//     newEventTM.append(eventLogoTM);
//     newEventTM.append(eventLinkTMDiv);
//     $("#events").append(newEventTM);
}

// all functions trigger when button is clicked
$('#city-btn').on('click', (e) => {
  e.preventDefault();
  zomatoFood();
  yelpFood();
  ticketMasterData();
  eventBriteData();
  $('#user-city').val('');
  $('#user-food').val('');
  $('#user-event').val('');
});
