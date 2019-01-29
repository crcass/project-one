
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
    var gueryTicketMasterURL = "https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.json?classificationName=" + userInput + "&postalCode=" + location + "&apikey=04jxM0zqluq8H37dKHJOEiYw8CTNalD5";

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


$("#city-btn").on("click", function (event) {
    event.preventDefault();
    ticketMasterData()
    eventBriteData();


});




