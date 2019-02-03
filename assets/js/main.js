// variables to keep track of user input
let userName;
let userCity;
let userFoodArray = [];
let userEventArray = [];
let userActivityArray = [];

// variables to store firebase data
let yelpFoodData = {};
let zomatoFoodData = {};
let ticketMasterFireBaseData = {};
let eventBriteFireBaseData = {};
let yelpActivityData = {};

// variables to store google maps coordinates
let EventBriteLocationArray = {
    lat: 0,
    lng: 0
};
let TicketMasterLocationArray = {
    lat: 0,
    lng: 0
};
let zomatoCoords = {
    lat: 0,
    lng: 0
};
let yelpFoodCoords = {
    lat: 0,
    lng: 0
};
let yelpActivityCoords = {
    lat: 0,
    lng: 0
};
let yelpActRandCoords = {
    lat: 0,
    lng: 0
};

var map;
var lat = 32.7767;
var lng = -96.7970;
var markers = [];

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
    $(window).scroll(function() {
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

// randomly changes names of cities, food, events, and activities in the jumbotron
let updateHero = setInterval(nameChange, 1000);

function nameChange() {
    cityNames = ['Dallas', 'Chicago', 'New York', 'Seattle', 'Atlanta', 'Miami', 'Los Angeles', 'Seattle', 'Boston', 'Phoenix', 'Houston', 'Philadelphia'];
    foodNames = ['thai', 'pizza', 'burgers', 'mexican', 'steak', 'bbq', 'french', 'italian', 'vegetarian', 'indian'];
    eventNames = ['live music', 'wine tastings', 'art shows', 'pub crawls', 'sporting events'];
    activityNames = ['running', 'weights', 'swimming', 'biking', 'gyms', 'yoga', 'spin class', 'climbing'];

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

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC3y-iyuZvzjuAwx4_TcTgYp-b7fezkCHM",
    authDomain: "wknder-fad8c.firebaseapp.com",
    databaseURL: "https://wknder-fad8c.firebaseio.com",
    projectId: "wknder-fad8c",
    storageBucket: "wknder-fad8c.appspot.com",
    messagingSenderId: "478987146878"
};
firebase.initializeApp(config);

let database = firebase.database();

// reset function
let reset = (() => {
    userName = '';
    userCity = '';
    userFoodArray = [];
    userEventArray = [];
    userActivityArray = [];
    yelpFoodData = {};
    zomatoFoodData = {};
    ticketMasterFireBaseData = {};
    eventBriteFireBaseData = {};
    yelpActivityData = {};
    EventBriteLocationArray = {
        lat: 0,
        lng: 0
    };
    TicketMasterLocationArray = {
        lat: 0,
        lng: 0
    };
    zomatoCoords = {
        lat: 0,
        lng: 0
    };
    yelpFoodCoords = {
        lat: 0,
        lng: 0
    };
    yelpActivityCoords = {
        lat: 0,
        lng: 0
    };
    yelpActRandCoords = {
        lat: 0,
        lng: 0
    };
    lat = 32.7767;
    lng = -96.7970;
    markers = [];
    $('#z-image').attr('src', '');
    $('#z-restaurant').empty();
    $('#z-address').empty();
    $('#y-image').attr('src', '');
    $('#y-restaurant').empty();
    $('#y-address').empty();
    $('#tm-image').attr('src', '');
    $('#tm-name').empty();
    $('#tm-info').empty();
    $('#eb-image').attr('src', '');
    $('#eb-name').empty();
    $('#eb-info').empty();
    $('#sup-image').attr('src', '');
    $('#sup-business').empty();
    $('#sup-address').empty();
    $('#yelp-image').attr('src', '');
    $('#yelp-business').empty();
    $('#yelp-address').empty();
    $('.card').css('background-color', '#fff');
    $('.under-map').empty();
    $('#phone').empty();
});

// modal event listeners 
$('#startModal').on('shown.bs.modal', () => {
    $('#user-name').trigger('focus');
});

$('#startModal').on('submit', (e) => {
    e.preventDefault();
    $('#name-btn').click();
});

$('#cityModal').on('shown.bs.modal', () => {
    $('#user-city').trigger('focus');
});

$('#cityModal').on('submit', (e) => {
    e.preventDefault();
    $('#city-btn').click();
});

$('#detailsModal').on('shown.bs.modal', () => {
    $('#user-food').trigger('focus');
});

$('#detailsModal').on('submit', (e) => {
    e.preventDefault();
    $('#choices-btn').click();
});

$('#save-trigger').on('click', () => {
    $('#results-fade').css('filter', 'brightness(50%)');
});

$('#saveModal').on('shown.bs.modal', () => {
    $('#phone').trigger('focus');
})

$('#saveModal').on('hide.bs.modal', () => {
    $('#results-fade').css('filter', 'brightness(100%)');
});

// Weather API - Takes in user city and outputs temp
let getCurrentWeather = (event) => {
    let userCity = $("#user-city").val();
    let weatherKey = '75db64d1c63b2811dc0f6b1eaae6a7bd';
    let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userCity + '&APPID=' + weatherKey;
    fetch(weatherUrl)
        .then(response => {
            return response.json();
        })
        .then(function(myJson) {
            // console.log(JSON.stringify(myJson));
            displayInfo(myJson)
            weatherData = myJson;
        })
        .catch(function(err) {
            console.log(err);
        });
}

let displayInfo = (response) => {
    let weatherCityName = response.name;
    let weatherCityTemp = temperatureConversion(response.main.temp);
    let weatherCityWind = response.wind.speed;
    $('#map-temp').text(weatherCityTemp);
}

// converts kelvin to fahrenheit
let temperatureConversion = (num) => {
    var kelvin = num
    var clesius = kelvin - 273;
    var fahrenheit = Math.round(clesius * (9 / 5) + 32);
    return fahrenheit;
}

// Creates User in firebase 
let createUser = () => {
    database.ref(`/user/${userName}`).set({});
}

let displayUserName = (() => {
    userName = titleCase(userName);
    $('#user').text(userName);
})

// function that automatically corrects user name case
let titleCase = ((str) => {
    return str.toLowerCase().split(' ').map((word) => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
});

// food search & parse function - zomato - Chris
let zomatoFood = (() => {
    let zomatoFoodArray = [];

    // Zomato API call to convert user city to Zomato ID
    let userFood = $('#user-food').val().trim().toLowerCase() || 'pizza';
    let zomatoLocation = `https://developers.zomato.com/api/v2.1/locations?query=${userCity}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
    $.ajax(zomatoLocation).done((response) => {
        let cityId = response.location_suggestions[0].city_id;

        // Zomato API call to find restaurants that match user preference
        let zomatoSearch = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${userFood}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
        $.ajax(zomatoSearch).done((response) => {
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
            zomatoCoords.lat = zRestLat;
            zomatoCoords.lng = zRestLong;

            // Zomato API call to find image for restaurant
            let zomatoImageSearch = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${zRestId}&apikey=3b053c756fdbe3bc1e535e2bd3506391`;
            $.ajax(zomatoImageSearch).done((response) => {
                zRestImage = response.thumb.substring(0, response.thumb.indexOf('?'));
                $('#z-image').attr('src', zRestImage);
            })

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

// food search & parse function - yelp - Chris
let yelpFood = (() => {
    let yelpFoodArray = [];

    // Yelp API call to find restaurants that match user preference
    let userFood = $('#user-food').val().trim().toLowerCase() || 'pizza';
    let yelpLocation = {
        url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${userFood}&location=${userCity}`,
        method: 'GET',
        headers: {
            Authorization: 'Bearer rEpGNbuPEtWijrh_hheEA3geN__9AU6-9pAfhz9TeK3kfryuq9M1GJV8C4BzKguvl4GxIEZJ8eh4M-Tg62mYc2ULw93WVcLLNMaK3gT6jN_W_qB2sHRmqM0rdLBMXHYx'
        }
    };
    $.ajax(yelpLocation).done((response) => {
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
        yelpFoodCoords.lat = yRestLat;
        yelpFoodCoords.lng = yRestLong;

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

// function calls the eventBrite API  -Patrick
function eventBriteData() {
    let userInput = $("#user-event").val();
    var startDate = $("#start-date").val() || "02/14/2019";
    var newStartTime = moment(startDate).format("YYYY-MM-DD");

    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?q=" + userInput + "&location.address=" + userCity + "&token=D6XUTCDEZDOKRNBW4HNT";
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        }).then(function(myJson) {
            processData(myJson);
        })
};

// Displaying the EventBrite information -Patrick
function processData(data) {
    let randomEventEB = Math.floor(Math.random() * 10)
    let topEventEB = data.events[randomEventEB];
    let EventDescriptionEB = topEventEB.description.text;
    let eventNameEB = topEventEB.name.text;
    let eventBriteLat = topEventEB.venue_id;
    let eventBriteLink = topEventEB.url;
    var eventLogoEB = topEventEB.logo.original.url;

    $("#eb-image").attr("src", eventLogoEB);
    $("#eb-info").text(EventDescriptionEB);
    $("#eb-name").text(eventNameEB);
    $("#eblink").attr("href", eventBriteLink);
    $("#eblink").text("Buy tickets here");
    $("#eb-link").on("click", function() {
        $("#eblink").attr("href", eventBriteLink);
    })

    eventBriteFireBaseData = {
        name: eventNameEB,
        discription: EventDescriptionEB,
        lat: eventBriteLat,
        link: eventBriteLink
    }
}

// TicketMaster api call - Patrick

function ticketMasterData() {
    var startDate = $("#user-date").val();
    var newStartTime = moment(startDate).format("YYYY-MM-DDTh:mm:ss");
    let endDate = moment(startDate).add(1, "week").format("YYYY-MM-DDTh:mm:ss");
    let userInput = $("#user-event").val();

    let gueryTicketMasterURL = "https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.json?startDateTime=2019-02-04T14:00:00Z&classificationName=" + userInput + "&city=" + userCity + "&endDateTime=2019-02-10T14:00:00Z&apikey=04jxM0zqluq8H37dKHJOEiYw8CTNalD5";

    fetch(gueryTicketMasterURL)
        .then(function(response) {
            return response.json();
        }).then(function(myJsonTM) {
            displayEventData(myJsonTM);
        });
}

// Function to dispalay the Ticketmaster data information -Patrick
function displayEventData(eventData) {
    let randomEventTM = Math.floor(Math.random() * 1)
    let topEventTicketMaster = eventData._embedded.events[randomEventTM];
    let ticketMasterLat = topEventTicketMaster._embedded.venues[0].location.latitude;
    let ticketMasterLon = topEventTicketMaster._embedded.venues[0].location.longitude;
    let ticketMasterPic = topEventTicketMaster.images[0].url;
    let tmLink = topEventTicketMaster.url
    let eventNameTM = topEventTicketMaster.name;
    let EventDescriptionTM = topEventTicketMaster.dates.start.localDate;

    TicketMasterLocationArray.lat = ticketMasterLat;
    TicketMasterLocationArray.lng = ticketMasterLon;

    $("#tm-image").attr("src", ticketMasterPic);
    $("#tm-name").text(eventNameTM);
    $("#tm-info").text(EventDescriptionTM);
    $("#tmlink").attr("href", tmLink);
    $("#tmlink").text("Buy tickets here");

    $("#tm-link").on("click", function() {
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

// Health Activity - Yelp API call - Eli
let displayYelpActivity = (() => {
    let yelpActivityArray = [];

    // Health/Activity API variables 
    let userActivity = $('#user-activity').val().trim().toLowerCase() || 'gym';

    let yelpLocation = {
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=' + userActivity + '&location=' + userCity,
        method: 'GET',
        headers: {
            Authorization: 'Bearer yWaQJHl2o89UuNIHcjYdRgwwJGrCEU3XVL6DQYPbdbPSu261nkOvcpUHI4rxmnWBbBGf4FcvVuUm7EgASDF8g5_vrpqQPGq8imdmjvbKlY_HZSl66YFihuLBjGRMXHYx'
        }
    }

    // Health/Activity Ajax
    $.ajax(yelpLocation).done((response) => {
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
        let yelpBusinessName = response.businesses[activityIndex].name;
        let yelpBusinessAddress = addressArray.join(' ');
        let yelpBusinessImage = response.businesses[activityIndex].image_url;
        yelpActivityCoords.lat = response.businesses[activityIndex].coordinates.latitude;
        yelpActivityCoords.lng = response.businesses[activityIndex].coordinates.longitude;

        $('#yelp-business').text(yelpBusinessName);
        $('#yelp-address').text(yelpBusinessAddress);
        $('#yelp-image').attr('src', yelpBusinessImage);

        //returns a random number
        var searchRandom = Math.floor(Math.random() * 20);
        var resultsRandom = response.businesses[searchRandom];

        $('#sup-business').text(resultsRandom.name);
        $('#sup-address').text(resultsRandom.location.address1);
        $('#sup-image').attr('src', resultsRandom.image_url);
        yelpActRandCoords.lat = resultsRandom.coordinates.latitude;
        yelpActRandCoords.lng = resultsRandom.coordinates.longitude;

        yelpActivityData = {
            name: yelpBusinessName,
            address: yelpBusinessAddress,
        }

        yelpRandomActData = {
            name: resultsRandom.name,
            address: resultsRandom.location.address1
        }
    });
});

//Gooogle Maps API - Daniel
// Mapping Functions Begin here
// changes userCity into geocode and centers map
function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = userCity;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            // console.log(lat);
            // console.log(lng);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

// initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    });
}

// adds markers to map for each type of selection
var newFoodMarker = function(location, name) {
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: location,
        map: map,
        title: name
    });
    markers[0] = marker;
};

var newEventMarker = function(location, name) {
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: location,
        map: map,
        title: name
    });
    markers[1] = marker;
};

var newActivityMarker = function(location, name) {
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: location,
        map: map,
        title: name
    });
    markers[2] = marker;
};

// displays markers on map
var setMapOnAll = function(map) {
    markers.forEach(function(marker) {
        marker.setMap(map);
    });
};

// removes markers from map
var clearMarkers = function() {
    setMapOnAll(null);
};

//Event Listeners
// resets initial state on click
$('#start-button').on('click', (e) => {
    e.preventDefault();
    reset();
    clearMarkers();
});

// stores the user's name for other functions
$('#name-btn').on('click', (e) => {
    e.preventDefault();
    userName = $('#user-name').val().trim();
    if (userName === '') {
        $('#user-name').attr('placeholder', 'Please enter your name');
        $('#user-name').attr('class', 'form-control border border-danger');
        return false;
    } else if (!/[A-Za-z]/g.test(userName) || /\d/.test(userName)) {
        $('#user-name').val('');
        $('#user-name').attr('placeholder', 'Only letters are accepted');
        $('#user-name').attr('class', 'form-control border border-danger');
        return false;
    } else {
        createUser();
        displayUserName();
        $('#user-name').val('');
        $('#user-name').attr('placeholder', '');
        $('#user-name').attr('class', 'form-control');
    }
});

// City is defined for other functions on click, weather updates
$('#city-btn').on('click', (e) => {
    e.preventDefault();
    userCity = $('#user-city').val().trim();
    if (userCity === '') {
        $('#user-city').attr('placeholder', 'Please enter your destination');
        $('#user-city').attr('class', 'form-control border border-danger');
        return false;
    } else if (!/[A-Za-z]/g.test(userCity) || /\d/.test(userCity)) {
        $('#user-city').val('');
        $('#user-city').attr('placeholder', 'Only letters are accepted');
        $('#user-city').attr('class', 'form-control border border-danger');
        return false;
    } else {
        database.ref(`/user/${userName}/city`).set(userCity);
        getCurrentWeather();
        $('#user-event').val('');
        $('#map-name').text(titleCase(userCity));
        $('#user-city').val('');
        $('#user-city').attr('placeholder', '');
        $('#user-city').attr('class', 'form-control');
        codeAddress();
        $('#user-date').val('');
    }
});

// runs functions based on user preferences
$('#choices-btn').on('click', (e) => {
    e.preventDefault();
    if ($('#user-food').val() != '' && !/[A-Za-z]/g.test($('#user-food').val()) || /\d/.test($('#user-food').val())) {
        $('#user-food').val('');
        $('#user-food').attr('placeholder', 'Only letters are accepted');
        $('#user-food').attr('class', 'form-control border border-danger');
        return false;
    } else {
        zomatoFood();
        yelpFood();
        $('#user-food').attr('placeholder', '');
        $('#user-food').attr('class', 'form-control');
    }
    if ($('#user-event').val() != '' && !/[A-Za-z]/g.test($('#user-event').val()) || /\d/.test($('#user-event').val())) {
        $('#user-event').val('');
        $('#user-event').attr('placeholder', 'Only letters are accepted');
        $('#user-event').attr('class', 'form-control border border-danger');
        return false;
    } else {
        ticketMasterData();
        eventBriteData();
        $('#user-event').attr('placeholder', '');
        $('#user-event').attr('class', 'form-control');
    }
    if ($('#user-activity').val() != '' && !/[A-Za-z]/g.test($('#user-activity').val()) || /\d/.test($('#user-activity').val())) {
        $('#user-activity').val('');
        $('#user-activity').attr('placeholder', 'Only letters are accepted');
        $('#user-activity').attr('class', 'form-control border border-danger');
        return false;
    } else {
        displayYelpActivity();
        initMap();
        $('#user-food').val('');
        $('#user-event').val('');
        $('#user-activity').val('');
        $('#user-activity').attr('placeholder', '');
        $('#user-activity').attr('class', 'form-control');
    }
});

// Pushes Zomato food data to firebase and save card
$('#z-food-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/food`).set(zomatoFoodData);
    $(".savedChoice-food").text(zomatoFoodData.name);
    $("#savedChoice-food-address").text(zomatoFoodData.address);
    userFoodArray = [];
    userFoodArray.push(zomatoFoodData);
    $('#z-food-card').css('background-color', '#F5CDA7');
    $('#y-food-card').css('background-color', '#d6d8d9');
    newFoodMarker(zomatoCoords, zomatoFoodData.name);
    setMapOnAll(map);
});

// Pushes Yelp food data to firebase and save card
$('#y-food-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/food`).set(yelpFoodData)
    $(".savedChoice-food").text(yelpFoodData.name);
    $("#savedChoice-food-address").text(yelpFoodData.address);
    userFoodArray = [];
    userFoodArray.push(yelpFoodData);
    $('#y-food-card').css('background-color', '#F5CDA7');
    $('#z-food-card').css('background-color', '#d6d8d9');
    newFoodMarker(yelpFoodCoords, yelpFoodData.name);
    setMapOnAll(map);
});

// Pushes ticketmaster event data to firebase and save card
$('#tm-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/event`).set(ticketMasterFireBaseData);
    $(".savedChoice-event").text(ticketMasterFireBaseData.name);
    $("#savedChoice-event-buy").attr('href', ticketMasterFireBaseData.link);
    userEventArray = [];
    userEventArray.push(ticketMasterFireBaseData);
    $('#tm-card').css('background-color', '#F5CDA7');
    $('#eb-card').css('background-color', '#d6d8d9');
    newEventMarker(TicketMasterLocationArray, ticketMasterFireBaseData.name);
    setMapOnAll(map);
});

// Pushes EventBrite event data to firebase and save card
$('#eb-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/event`).set(eventBriteFireBaseData);
    $(".savedChoice-event").text(eventBriteFireBaseData.name);
    $("#savedChoice-event-buy").attr('href', eventBriteFireBaseData.link);
    userEventArray = [];
    userEventArray.push(eventBriteFireBaseData);
    $('#eb-card').css('background-color', '#F5CDA7');
    $('#tm-card').css('background-color', '#d6d8d9');
    newEventMarker(EventBriteLocationArray, eventBriteFireBaseData.name);
    setMapOnAll(map);
});

// Pushes Yelp activity data to firebase and save card
$('#sup-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/activity`).set(yelpRandomActData);
    $('.user-exercise').text(yelpRandomActData.name);
    $('#user-exercise-address').text(yelpRandomActData.address);
    userActivityArray = [];
    userActivityArray.push(yelpRandomActData);
    $('#sup-card').css('background-color', '#F5CDA7');
    $('#yelp-card').css('background-color', '#d6d8d9');
    newActivityMarker(yelpActRandCoords, yelpRandomActData.name);
    setMapOnAll(map);
});

// Pushes Yelp activity  data to firebase and save card
$('#yelp-card').on('click', function(e) {
    e.preventDefault();
    clearMarkers();
    database.ref(`/user/${userName}/activity`).set(yelpActivityData);
    $('.user-exercise').text(yelpActivityData.name);
    $('#user-exercise-address').text(yelpActivityData.address);
    userActivityArray = [];
    userActivityArray.push(yelpActivityData);
    $('#yelp-card').css('background-color', '#F5CDA7');
    $('#sup-card').css('background-color', '#d6d8d9');
    newActivityMarker(yelpActivityCoords, yelpActivityData.name);
    setMapOnAll(map);
});

// saves user data
$('#save-user-btn').on('click', (e) => {
    e.preventDefault();
    savedUserChoices();
    $('#saveModal').modal('hide');
});

// pushes user saved choices to firesbase and SMS
$("#save-choices-btn").on("click", function() {
    var phoneNumber = $('#phone').val() || '+17024285828';
    database.ref(`/user/${userName}/saved`).set(userEventArray.concat(userFoodArray).concat(userActivityArray));

    fetch("https://node-practice-k1csb8vhu.now.sh/api/sms", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
           phone: phoneNumber,
           food: userFoodArray,
           event: userEventArray,
           activity: userActivityArray
        })
    })
    .then(function (){
        console.log("Hey");
    })
    .catch( err =>{
        console.error(err)
    })

})

//function pushes the save card data to firebase unde the user's name
function savedUserChoices() {
    $("#saved-food").text(userFoodArray[0].name);
    $("#saved-food-address").text(userFoodArray[0].address);
    $("#saved-event").text(userEventArray[0].name);
    $("#saved-event-buy").text(userEventArray[0].link);
    $("#user-exercise").text(userActivityArray[0].name);
    $("#user-exercise-address").text(userActivityArray[0].address);
}


