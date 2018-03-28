var map;
var service;
var index = 0;
var posArray = [];

$(document).ready(function(){
    navigator.geolocation.getCurrentPosition(init);

});

function init(location) {
    enable();
    googleMap();

    var currentLocation = {lat: location.coords.latitude, lng: location.coords.longitude};

    var mapOptions = {
        center: currentLocation,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.READMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    service = new google.maps.places.PlacesService(map);

    google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);


}

function enable() {
    $("#dislikeBtn").on("click", function () {
        index--;
        if ( index < 0){
            index = posArray.length - 1;
        }
        handleSearchResults();
    });
    $("#likeBtn").on("click", function () {
        index++;
        if (index > posArray.length - 1){
            index = 0;
        }
        // handleSearchResults();
    });
    // updateText();
}


function googleMap() {

    $.ajax({
        type: "GET",
        url: "/googleMaps",
    success: function(response){
            performSearch(response.data);
            // handleSearchResults();
        }
    });

}

function performSearch() {

    $("#searchbtn").on('click', function (e) {
        e.preventDefault();

    var search = $("#search").val();

    if ($("#AmFood").on("click", function (e) {
            e.preventDefault();
        })){
        search = "american food";
        console.log("clicked")
        console.log(search)
    }
    else if ($("#MxFood").on("click", function (e) {
            e.preventDefault();
        })){
        search = "mexican food";
        console.log(search)

    }
    else if ($("#CHFood").on("click", function (e) {
            e.preventDefault();
        })){
        search = "chinese food";
    }
    else if ($("#ITFood").on("click", function (e) {
            e.preventDefault();
        })){
        search = "italian food";
    }
    else if ($("#search").val()){
        search = $("#search").val();
    }

    var request = {
        bounds: map.getBounds(),
        name: search
    };

    service.nearbySearch(request, handleSearchResults);
    $("#search").val("")
    });
}

function handleSearchResults(results, status) {
    $("#container").empty();

    for (var i = 0; i < results.length; i++){
        var marker = new google.maps.Marker({
            position: results[i].geometry.location,
            map: map,
            name: results[i].name,
            address: results[i].vicinity
        });

        posArray.push(results[i]);
        console.log(results[i].name);

        // $("#container").append("<div align='center'></div>");
        // var el = $("#container").children().last();
        // el.append(
        //     "<p>" + posArray[i].name + "</p>"
        // );


        $("#textName").text(posArray[index].name);
        $("#textAddress").text(posArray[index].vicinity);
        // console.log(posArray[index].name);
        // console.log(posArray[index].vicinity);
        // el.append(
        //     "<span>" + restaurant + "</span>")
    }

}


// function updateText() {
//
//     $("#textName").text(posArray[index].name);
//     $("#textAddress").text(posArray[index].vicinity);
// }




    // event.preventDefault();

    // var dropdown = document.getElementsByClassName("dropdown-btn");
    // var i;
    // for (i = 0; i < dropdown.length; i++){
    //     dropdown[i].addEventListener("click", function () {
    //         this.classList.toggle("active");
    //         var dropdownContent = this.nextElementSibling;
    //         if (dropdownContent.style.display === "block"){
    //             dropdownContent.style.display = "none"
    //         } else {
    //             dropdownContent.style.display = "block";
    //         }
    //
    //     });
    // }

//     $("#container").empty();
//
//     restaurant = posArray[randomSpeech(min, max)];
//     // $("#randomSpeech").text("Restaurant: " + restaurant);
//     $("#container").append("<div></div>");
//     var el = $("#container").children().last();
//     el.append('<img src="https://maps.google.com/maps/contrib' + results[i].photos + '"/>');
//     el.append(
//         "<span>" + restaurant + "</span>" + " : "
//         // "<span>" + results[i].vicinity + "</span>"
//
//     // "<span>" + results[i].photos + "</span>"
//
//     )
// }

// function randomSpeech(min, max) {
//     return Math.floor(Math.random()*(1 + max - min) + min);
// }