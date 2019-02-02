// randomly changes names of cities, food, events, and activities in the jumbotron
let updateHero = setInterval(nameChange, 1000);

function nameChange() {
    cityNames = ['Dallas', 'Chicago', 'New York', 'Seattle', 'Atlanta', 'Miami', 'Los Angeles', 'Seattle'];
    foodNames = ['thai', 'pizza', 'burgers', 'mexican', 'steak', 'bbq', 'french', 'italian', 'vegetarian', 'indian'];
    eventNames = ['live music', 'wine tastings', 'art shows', 'pub crawls', 'sporting events'];
    activityNames = ['running', 'weights', 'swimming', 'biking', 'gyms', 'yoga', 'spin class'];

    function randomNumber(num) {
        return Math.floor(Math.random() * Math.floor(num));
    }

    randCity = randomNumber(cityNames.length);
    $('#city-name').text(cityNames[randCity]);
    randFood = randomNumber(foodNames.length);
    $('#food-name').text(foodNames[randFood]);
    randEvent = randomNumber(eventNames.length);
    $('#event-name').text(eventNames[randEvent]);
    randActivity = randomNumber(activityNames.length);
    $('#activity-name').text(activityNames[randActivity]);
};

// jumbotron slideshow
$(document).ready(() => {
    $('.carousel').slick({
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        draggable: false,
        pauseOnFocus: false,
        pauseOnHover: false
    });

    // auto-hides nav bar
    let lastScrollTop = 0;
    $(window).scroll(function () {
        let scrollTop = $(this).scrollTop();
        if (scrollTop - lastScrollTop > 50) {
            let navHeight = $('.navbar').css('height');
            $('.navbar').animate({
                top: '-' + navHeight
            }, 150);
            lastScrollTop = scrollTop;
        } else if (lastScrollTop - scrollTop > 50) {
            $('.navbar').animate({
                top: '0px'
            }, 150);
            lastScrollTop = scrollTop;
        }
    });
});

// Initialize Firebase
//var config = {
    apiKey: "AIzaSyC3y-iyuZvzjuAwx4_TcTgYp-b7fezkCHM",
    authDomain: "wknder-fad8c.firebaseapp.com",
    databaseURL: "https://wknder-fad8c.firebaseio.com",
    projectId: "wknder-fad8c",
    storageBucket: "wknder-fad8c.appspot.com",
    messagingSenderId: "478987146878"
};
//firebase.initializeApp(config);

// global variables
let database = firebase.database();
let EventBriteLocationArray = [];
let TicketMasterLocationArray = [];
let zomatoCoords = [];
let yelpFoodCoords = [];
let yelpActiviyCoords = [];
let userCity;

let ylpActivityData = {};
let yelpFoodData = {};
let zomatoFoodData = {};
let ticketMasterFireBaseData = {};
let eventBriteFireBaseData = {};

// function that automatically corrects user name case
let titleCase = ((str) => {
    return str.toLowerCase().split(' ').map((word) => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
});

// food search & parse function - zomato
let zomatoFood = (() => {
    let zomatoFoodArray = [];

    // Zomato API call to convert user city to Zomato ID
    // let userCity = $('#user-city').val();
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
            let zRestLat = Number(response.restaurants[foodIndex].restaurant.location.latitude);
            let zRestLong = Number(response.restaurants[foodIndex].restaurant.location.longitude);
            zomatoCoords.push(zRestLat);
            zomatoCoords.push(zRestLong);
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

            zomatoFoodData = {
                name: zRestName,
                address: zRestAddress,
                latitude: zRestLat,
                longitude: zRestLong
            }
        })
    })
});

// food search & parse function - yelp
let yelpFood = (() => {
    let yelpFoodArray = [];

    // Yelp API call to find restaurants that match user preference
    // let userCity = $('#user-city').val();
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
        let yRestLat = response.businesses[foodIndex].coordinates.latitude;
        let yRestLong = response.businesses[foodIndex].coordinates.longitude;
        yelpFoodCoords.push(yRestLat);
        yelpFoodCoords.push(yRestLong);
        // console.log(yelpFoodCoords);
        console.log(`Yelp's best ${userFood} in ${userCity}: ${yRestName}, ${yRestAddress}`);
        $('#y-restaurant').text(yRestName);
        $('#y-address').text(yRestAddress);
        $('#y-image').attr('src', yRestImage);

        yelpFoodData = {
            name: yRestName,
            address: yRestAddress,
            latitude: yRestLat,
            longitude: yRestLong
        }
    })
});

//function calls the eventBrite API 
function eventBriteData() {

    var startDate = $("#start-date").val() || "02/14/2019";
    var newStartTime = moment(startDate).format("YYYY-MM-DD");
    var proposedStartDate = newStartTime + "T14:00:00Z";
    endDate = moment(newStartTime).add(3, 'days');
    console.log(proposedStartDate);
    console.log(endDate);

    let userInput = $("#user-event").val();
    // let locationEvent = $("#user-city").val();

    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + userInput + "&location.address=" + userCity + "&token=D6XUTCDEZDOKRNBW4HNT";

    //https: //www.eventbriteapi.com//v3/events/search/?q=" + userInput + "&location.address=" + location + "start_date.range_start=" + newDateTime + "&token=D6XUTCDEZDOKRNBW4HNT
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        }).then(function (myJson) {
            processData(myJson);
        })
};

// Displaying the EventBrite information 
function processData(data) {
    let randomEventEB = Math.floor(Math.random() * 10)
    let topEventEB = data.events[randomEventEB];
    console.log(topEventEB)

    let EventDescriptionEB = topEventEB.description.text;
    let eventNameEB = topEventEB.name.text;
    let eventBriteLat = topEventEB.venue_id;
    let eventBriteLink = topEventEB.url;
    EventBriteLocationArray.push(eventBriteLat);

    var eventLogoEB = topEventEB.logo.original.url;

    $("#eb-image").attr("src", eventLogoEB);
    $("#eb-info").text(EventDescriptionEB);
    $("#eb-name").text(eventNameEB);
    $("#eblink").attr("href", eventBriteLink);
    $("#eblink").text("Buy tickets here");
    console.log(EventDescriptionEB);

    $("#eb-link").on("click", function () {
        $("#eblink").attr("href", eventBriteLink);
    })

    eventBriteFireBaseData = {
        name: eventNameEB,
        discription: EventDescriptionEB,
        lat: eventBriteLat,
        link: eventBriteLink
    }
}











// ticketMaster api call
function ticketMasterData() {
    // Need to figure out how to call the dates within the API.
    // var startDate = $("#user-date").val();
    // var d = new Date();
    // var n = d.toISOString();
    // console.log(n);
    // var newStartTime = moment(startDate).format("YYYY-MM-DD");
    // var proposedStartDate = startDate.toISOString();
    // endDate = moment(newStartTime).add(3, 'days');
    // console.log(proposedStartDate);
    // console.log(endDate);

    let userInput = $("#user-event").val();
    // let locationEvent = $("#user-city").val();
    console.log(userInput);
    console.log(userCity);

    let gueryTicketMasterURL = "https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.json?classificationName=" + userInput + "&city=" + userCity + "&apikey=04jxM0zqluq8H37dKHJOEiYw8CTNalD5";

    fetch(gueryTicketMasterURL)
        .then(function (response) {
            // console.log(response);
            return response.json();
        }).then(function (myJsonTM) {
            //console.log(myJsonTM);
            displayEventData(myJsonTM);
        });
}

// Function to dispalay the Ticketmaster data information 
function displayEventData(eventData) {
    let randomEventTM = Math.floor(Math.random() * 1)
    let topEventTicketMaster = eventData._embedded.events[randomEventTM];
    let ticketMasterLat = topEventTicketMaster._embedded.venues[0].location.latitude;
    let ticketMasterLon = topEventTicketMaster._embedded.venues[0].location.longitude;
    let ticketMasterPic = topEventTicketMaster.images[0].url;
    TicketMasterLocationArray.push(ticketMasterLat, ticketMasterLon);

    console.log(eventData);
    console.log(topEventTicketMaster)


    let tmLink = topEventTicketMaster.url
    let eventNameTM = topEventTicketMaster.name;
    let EventDescriptionTM = topEventTicketMaster.dates.start.localDate;

    $("#tm-image").attr("src", ticketMasterPic);
    $("#tm-name").text(eventNameTM);
    $("#tm-info").text(EventDescriptionTM);
    $("#tmlink").attr("href", tmLink);
    $("#tmlink").text("Buy tickets here");

    $("#tm-link").on("click", function () {
        $("#tmlink").attr("href", tmLink);

    })

    ticketMasterFireBaseData = {
        name: eventNameTM,
        discription: EventDescriptionTM,
        lat: ticketMasterLat,
        lon: ticketMasterLon,
        link: tmLink
    }
}



//Start of Health Activity not incomplete
       
        
       let displayYelpActivity = (() => {
        let yelpActivityArray = [];


    // Health/Activity  API call 

    let userCity = $('#user-city').val();
    let userActivity = $('#user-activity').val();

    let yelpLocation = {
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=' + userActivity + '&location=' + userCity,
        method: 'GET',
        headers: {
           Authorization: 'Bearer yWaQJHl2o89UuNIHcjYdRgwwJGrCEU3XVL6DQYPbdbPSu261nkOvcpUHI4rxmnWBbBGf4FcvVuUm7EgASDF8g5_vrpqQPGq8imdmjvbKlY_HZSl66YFihuLBjGRMXHYx'  
        }
    }

        //Health/Activity Ajax

        $.ajax(yelpLocation).done((response) => {
            console.log(response);
            console.log(response.businesses[0].location);
           response.businesses.forEach((element) => {
             yelpActivityArray.push(element.review_count);
           })
           let highestRating = 0;
           for (var i = 0; i < yelpActivityArray.length; i++) {
             if (yelpActivityArray[i] > highestRating) {
               highestRating = yelpActivityArray[i];
             }
       
           }

        // Health/Activity to display 
           let activityIndex = yelpActivityArray.indexOf(highestRating);
           let addressArray = [];
           for (var i = 0; i < response.businesses[activityIndex].location.display_address.length; i++) {
             addressArray.push(response.businesses[activityIndex].location.display_address[i]);
           }
       // Health/Activity Coordspush pending 

     let yelpBusinessName = response.businesses[activityIndex].name;
    let yelpBusinessAddress = addressArray.join(' ');
    let yelpBusinessImage = response.businesses[activityIndex].image_url;
    //yelpActivityCoords.push(response.businesses[activityIndex].coordinates.latitude);
    //yelpActivityCoords.push(response.businesses[activityIndex].coordinates.longitude);
    
    // console.log(yelpActivityCoords);

     //console.log(`Yelp's best ${userActivity} in ${userCity}: ${yelpBusinessName}, ${yelpBusinessAddress}`);
     $('#yelp-business').text(yelpBusinessName);
     $('#yelp-address').text(yelpBusinessAddress);
     $('#yelp-image').attr('src', yelpBusinessImage);
});


           });


//End of Health Activity  











// Weather api

let getCurrentWeather = (event) => {
    let userCity = $("#user-city").val();
    let weatherKey = '75db64d1c63b2811dc0f6b1eaae6a7bd';
    let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userCity + '&APPID=' + weatherKey;
    fetch(weatherUrl)
        .then(response => {
            return response.json();
        })
        .then(function (myJson) {
            console.log(JSON.stringify(myJson));
            displayInfo(myJson)
            weatherData = myJson;
        })

        .catch(function (err) {
            // console.log()
        });
}

let displayInfo = (response) => {

    let weatherCityName = response.name;
    let weatherCityTemp = temperatureConversion(response.main.temp);
    let weatherCityWind = response.wind.speed;

    $('#map-temp').text(`${weatherCityTemp}°`);

    // let newRow = $("<tr>").append(
    //     $("<td>").text('Location: ' + weatherCityName + "  |  "),
    //     $("<td>").text('Current Temperature: ' + weatherCityTemp + "  |  "),
    //     $("<td>").text('Wind Speed: ' + weatherCityWind + "mph")
    // )
    // $("#weather-display").append(newRow);
}

let temperatureConversion = (num) => {
    var kelvin = num
    var clesius = kelvin - 273;
    var fahrenheit = Math.round(clesius * (9 / 5) + 32);
    return fahrenheit;
}














let userName;

let createUser = () => {
    database.ref(`/user/${userName}`).set({});
}

let displayUserName = (() => {
    userName = titleCase(userName);
    $('#user').text(userName);
})

// all functions trigger when button is clicked
$('#city-btn').on('click', (e) => {
    e.preventDefault();
    userCity = $('#user-city').val();
    database.ref(`/user/${userName}/city`).set(userCity);
    // ticketMasterData();
    //ticketMasterData();
    // eventBriteData();
    getCurrentWeather();
    $('#user-event').val('');
    $('#map-name').text(titleCase(userCity));
    $('#user-city').val('');
});

$('#choices-btn').on('click', (e) => {
    e.preventDefault();
    zomatoFood();
    yelpFood();
    displayYelpActivity();
    ticketMasterData();
    eventBriteData();
    $('#user-food').val('');
    $('#user-event').val('');
    $('#user-activity').val('');
})


let userFoodArray = [];
let userEventArray = [];

$('#z-food-card').on('click', function (e) {
    e.preventDefault();
    database.ref(`/user/${userName}/food`).set(zomatoFoodData);
    $("#savedChoice-food").text(zomatoFoodData.name);
    $("#savedChoice-food-address").text(zomatoFoodData.address);
    userFoodArray = [];
    userFoodArray.push(zomatoFoodData)
    console.log(userFoodArray);

});

$('#y-food-card').on('click', function (e) {
    e.preventDefault();
    database.ref(`/user/${userName}/food`).set(yelpFoodData)
    $("#avedChoice-food").text(yelpFoodData.name);
    $("#savedChoice-food-address").text(yelpFoodData.address);
    console.log(yelpFoodData.name);
    userFoodArray = [];
    userFoodArray.push(yelpFoodData)
    console.log(userFoodArray);
});

$('#tm-card').on('click', function (e) {
    e.preventDefault();
    database.ref(`/user/${userName}/event`).set(ticketMasterFireBaseData);
    $("#savedChoice-event").text(ticketMasterFireBaseData.name);
    $("#savedChoice-event-buy").text(ticketMasterFireBaseData.link);


    console.log(ticketMasterFireBaseData.name);
    userEventArray = [];
    userEventArray.push(ticketMasterFireBaseData)
    console.log(userEventArray);

})

$('#eb-card').on('click', function (e) {
    e.preventDefault();
    database.ref(`/user/${userName}/event`).set(eventBriteFireBaseData);
    $("#savedChoice-event").text(eventBriteFireBaseData.name);
    $("#savedChoice-event-buy").text(eventBriteFireBaseData.link);

    console.log(eventBriteFireBaseData.name);
    userEventArray = [];
    userEventArray.push(eventBriteFireBaseData)
    console.log(userEventArray);

})

$('#name-btn').on('click', (e) => {
    e.preventDefault();
    userName = $('#user-name').val();
    createUser();
    displayUserName();
    $('#user-name').val('');
});


$('#save-user-btn').on('click', (e) => {
    e.preventDefault();
    savedUserChoices();
});

function savedUserChoices() {
    $("#saved-food").text(userFoodArray[0].name);
    $("#saved-food-address").text(userFoodArray[0].address);
    $("#saved-event").text(userEventArray[0].name);
    $("#saved-event-buy").text(userEventArray[0].link);
 
}


$("#save-choices-btn").on("click", function () {
    database.ref(`/user/${userName}/saved`).set(userSavedPrefArray);
    userSavedPrefArray =  foodName.userFoodArray[0].name;
    userSavedPrefArray.foodAddress = userFoodArray[1];
    

})


let userSavedPrefArray = {
    foodName: '',
    foodAddress: '',
    eventName: '',
    eventLink: ''
}

//      Mapping Functions Begin here
//geocodes address

var geocodeLat = 0;
var geocodeLong = 0;

function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("user-city").value;
    console.log($('#user-city').val());
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            geocodeLat = results[0].geometry.location.lat();
            geocodeLong = results[0].geometry.location.lng();
            console.log(geocodeLat);
            console.log(geocodeLong);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

function initMap() {
    //need to add geocoder function to push values from function above to map

    var options = {
        zoom: 8,
        center: {
            lat: 32.7767,
            lng: -96.7970
        }
    }
    console.log(geocodeLat);
    console.log(geocodeLong);

    // New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    // Listen for click on map (to test add marker function)
    google.maps.event.addListener(map, 'click', function (event) {
        // Add marker
        addMarker({
            coords: event.latLng
        });
    });

    // Array of markers
    var markers = [{
        coords: {
            lat: 32.7767,
            lng: -96.7970
        },
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'

        content: '<h1>Dallas, Tx</h1>'
    }, {
        coords: {
            lat: 32.7473,
            lng: -96.8304
        },
        content: '<h1>Bishop Arts</h1>'
    }, {
        coords: {
            lat: 32.7469,
            lng: -96.700
        }

    }];

    // Loop through markers
    for (var i = 0; i < markers.length; i++) {
        // Add marker
        addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            //icon:props.iconImage
        });

        // Check for customicon
        if (props.iconImage) {
            // Set icon image
            marker.setIcon(props.iconImage);
        }

        // Check content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    }
}
