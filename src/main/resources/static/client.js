window.addEventListener('load', onWndLoad, false);

var map;
var service;
var index = 0;
var posArray = [];
var request;
var finalJoke = 0;
var jokeArray = [];
var min = 0;
var max = 32;
var BoundArgs;

$(document).ready(function(){
    navigator.geolocation.getCurrentPosition(init1);

});

function onWndLoad() {

    var slider = document.querySelector('.slider');
    var sliders = slider.children;

    var initX = null;
    var transX = 0;
    var rotZ = 0;
    var transY = 0;

    var curSlide = null;

    var Z_DIS = 50;
    var Y_DIS = 10;
    var TRANS_DUR = 0.4;

    var images=document.querySelectorAll('img');
    for(var i=0;i<images.length;i++)
    {
        images[i].onmousemove=function(e){
            e.preventDefault()

        };
        images[i].ondragstart=function(e){
            return false;

        }
    }

    function init() {

        var z = 0, y = 0;

        for (var i = sliders.length-1; i >=0; i--) {
            sliders[i].style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';

            z -= Z_DIS;
            y += Y_DIS;
        }

        attachEvents(sliders[sliders.length - 1]);

    }
    function attachEvents(elem) {
        curSlide = elem;

        curSlide.addEventListener('mousedown', slideMouseDown, false);
        curSlide.addEventListener('touchstart', slideMouseDown, false);
    }
    init();
    function slideMouseDown(e) {

        if (e.touches) {
            initX = e.touches[0].clientX;
        }
        else {
            initX = e.pageX;
        }

        document.addEventListener('mousemove', slideMouseMove, false);
        document.addEventListener('touchmove', slideMouseMove, false);

        document.addEventListener('mouseup', slideMouseUp, false);
        document.addEventListener('touchend', slideMouseUp, false);
    }
    var prevSlide = null;

    function slideMouseMove(e) {
        var mouseX;

        if (e.touches) {
            mouseX = e.touches[0].clientX;
        }
        else {
            mouseX = e.pageX;
        }

        transX += mouseX - initX;
        rotZ = transX / 20;

        transY = -Math.abs(transX / 15);

        curSlide.style.transition = 'none';
        curSlide.style.webkitTransform = 'translateX(' + transX + 'px)' + ' rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        curSlide.style.transform = 'translateX(' + transX + 'px)' + ' rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        var j = 1;
        //remains elements
        for (var i = sliders.length -2; i >= 0; i--) {

            sliders[i].style.webkitTransform = 'translateX(' + transX/(2*j) + 'px)' + ' rotateZ(' + rotZ/(2*j) + 'deg)' + ' translateY(' + (Y_DIS*j) + 'px)'+ ' translateZ(' + (-Z_DIS*j) + 'px)';
            sliders[i].style.transform = 'translateX(' + transX/(2*j) + 'px)' + ' rotateZ(' + rotZ/(2*j) + 'deg)' + ' translateY(' + (Y_DIS*j) + 'px)'+ ' translateZ(' + (-Z_DIS*j) + 'px)';
            sliders[i].style.transition = 'none';
            j++;
        }
        initX =mouseX;
        e.preventDefault();
        if (Math.abs(transX) >= curSlide.offsetWidth-30) {
            likedPage();
            submitJoke();
            document.removeEventListener('mousemove', slideMouseMove, false);
            document.removeEventListener('touchmove', slideMouseMove, false);
            curSlide.style.transition = 'ease 0.2s';
            curSlide.style.opacity = 0;
            prevSlide = curSlide;
            attachEvents(sliders[sliders.length - 2]);
            slideMouseUp();
            setTimeout(function () {

                slider.insertBefore(prevSlide, slider.firstChild);

                prevSlide.style.transition = 'none';
                prevSlide.style.opacity = '1';
                slideMouseUp();

            },201);

            return;
        }
    }
    function slideMouseUp() {
        transX = 0;
        rotZ = 0;
        transY = 0;

        curSlide.style.transition = 'cubic-bezier(0,1.95,.49,.73) '+TRANS_DUR+'s';

        curSlide.style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        curSlide.style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        //remains elements
        var j = 1;
        for (var i = sliders.length -  2; i >= 0; i--) {
            sliders[i].style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR / (j + 0.9) + 's';
            sliders[i].style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS*j) + 'px)' + ' translateZ(' + (-Z_DIS*j) + 'px)';
            sliders[i].style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS*j) + 'px)' + ' translateZ(' + (-Z_DIS*j) + 'px)';

            j++;
        }

        document.removeEventListener('mousemove', slideMouseMove, false);
        document.removeEventListener('touchmove', slideMouseMove, false);

    }
}

function init1(location) {
    enable();

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
        dislikedPage();
        submitJoke();
    });

    $("#likeBtn").on("click", function () {
        likedPage();
        submitJoke();
        myFunction();
    });

}

function likedPage() {
    index++;
    if (index > posArray.length - 1){
        index = 0;
    }
    console.log("LIKED");
    updateText();
}
function dislikedPage() {
    index++;
    if ( index > posArray.length - 1){
        index = 0;
    }
    console.log("DISLIKED");
    updateText();
}

function performSearch() {

    if ($("#searchbtn").on('click', function (e) {
        e.preventDefault();

        var search = $("#search").val();

        request = {
        bounds: map.getBounds(),
        name: search
    };
    service.nearbySearch(request, handleSearchResults);
    $("#search").val("");

    }));

    if ($("#AmFood").on("click", function (e) {
        e.preventDefault();

        request = {
            bounds: map.getBounds(),
            name: "American Food"
        };
        service.nearbySearch(request, handleSearchResults);

        }));
    if ($("#MxFood").on("click", function (e) {
            e.preventDefault();

            request = {
                bounds: map.getBounds(),
                name: "Mexican Food"
            };
            service.nearbySearch(request, handleSearchResults);
        }));
    if ($("#CHFood").on("click", function (e) {
            e.preventDefault();

            request = {
                bounds: map.getBounds(),
                name: "Chinese Food"
            };
            service.nearbySearch(request, handleSearchResults);
        }));
    if ($("#ITFood").on("click", function (e) {
            e.preventDefault();

            request = {
                bounds: map.getBounds(),
                name: "Italian Food"
            };
            service.nearbySearch(request, handleSearchResults);
        }));

}

function handleSearchResults(results, status) {

    for (var i = 0; i < results.length; i++){
        var marker = new google.maps.Marker({
            position: results[i].geometry.location,
            map: map,
            name: results[i].name,
            address: results[i].vicinity,
            rating: results[i].rating
            // photos: results[i].photos

        });
        posArray.push(results[i]);
        console.log(posArray[i].photos[0].getUrl[[BoundArgs][0]]);
        updateText();
    }
}

function updateText() {
    for (var i = 0; i < posArray.length; i++) {
        $("#textName").text(posArray[index].name);
        $("#textAddress").text("Address : " + posArray[index].vicinity);
        $("#textRating").text("Rating: " + posArray[index].rating);
        // $("#photos").append("<img src='" + posArray[index].photos[0].getUrl(BoundArgs)[0] +"'/>");

    }
}

function myFunction() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}


// function googleMap() {
//
//     $.ajax({
//         type: "GET",
//         url: "/googleMaps",
//     success: function(response){
//             performSearch(response.data);
//             // handleSearchResults();
//         }
//     });
// }

function randomJokes(min, max) {
    return Math.floor(Math.random()*(1 + max - min) + min);
}

    jokeArray.push("Q: What do you call cheese that isn’t yours?\n" +
        "A: Nacho cheese!");
    jokeArray.push("Q: What did the baby corn say to its mom?\n" +
        "A: Where’s my pop corn?");
    jokeArray.push("Q: Why couldn’t the sesame seed leave the gambling casino?\n" +
        "A: Because he was on a roll.");
    jokeArray.push("Mushroom walks in a bar, bartender says “Hey you can’t drink here.”\n" +
        "Mushroom says “Why not, I’m a Fun-gi!”");
    jokeArray.push("Q: What do you call a fake noodle? \n" +
        "A: An Impasta.");
    jokeArray.push("Q: Why did the tomato blush? \n" +
        "A: Because it saw the salad dressing!");
    jokeArray.push("Q: Why don’t eggs tell jokes?\n" +
        "A: They’d crack each other up!");
    jokeArray.push("Q. I tried to get into my house the other day, but I couldn’t. Wanna know why? \n" +
        "A. Because I had gnocchi!");
    jokeArray.push("Q: What does a nosey pepper do? \n" +
        "A: Gets jalapeno business! ");
    jokeArray.push("Q: Where did the onion go to have a few drinks? \n" +
        "A: The Salad Bar! ");
    jokeArray.push("Q: What did Bacon say to Tomato? \n" +
        "A: Lettuce get together! ");
    jokeArray.push("Q: What did the apple say to the orange? \n" +
        "A: Nothing stupid... apples don't talk! ");
    jokeArray.push("Q: Why did the Orange go out with a Prune? \n" +
        "A: Because he couldn't find a Date! ");
    jokeArray.push("Q: What does a nosey pepper do? \n" +
        "A: Gets jalapeno business! ");
    jokeArray.push("Q: Why did the students eat their homework? \n" +
        "A: Because the teacher said that it was a piece of cake. ");
    jokeArray.push("Q: Why do watermelons have fancy weddings? \n" +
        "A: Because they cantaloupe. ");
    jokeArray.push("Q: What's a vegetable's favourite casino game? \n" +
        "A: Baccarrot! ");
    jokeArray.push("Q: What do you call an epileptic in a vegetable garden \n" +
        "A: Seizure salad ");
    jokeArray.push("Q: Why did the can crusher quit his job? \n" +
        "A: Because it was soda pressing. ");
    jokeArray.push("Q: Did you see the movie about the hot dog? \n" +
        "A: It was an Oscar Wiener.");
    jokeArray.push("Q: Why did the cabbage win the race? \n" +
        "A: Because it was ahead! ");
    jokeArray.push("Q: Why was the cucumber mad? \n" +
        "A: Because it was in a pickle! ");
    jokeArray.push("Q: What did the burger name her daughter? \n" +
        "A: Patty! ");
    jokeArray.push("Q: How do you fix a broken tomato? \n" +
        "A: With tomato paste! ");
    jokeArray.push("Q: What's orange and sounds like a parrot? \n" +
        "A: A carrot! ");
    jokeArray.push("Q: What do you get if you divide the circumference of a jack-o-lantern by its diameter? \n" +
        "A: Pumpkin pi ");
    jokeArray.push("Q: Why couldn't the sesame seed leave the casino? \n" +
        "A: Because he was on a roll ");
    jokeArray.push("Q: Why don't oranges do well in school? \n" +
        "A: Only orange juice can concentrate. ");
    jokeArray.push("Q: Why do potatoes make good detectives? \n" +
        "A: Because they keep their eyes peeled. ");
    jokeArray.push("Q: What do you give to a sick lemon? \n" +
        "A: Lemon aid! ");
    jokeArray.push("Q: What do you do if life gives you melons? \n" +
        "A: See a doctor, because you're dyslexic");
    jokeArray.push("Q: What do you get if you cross an apple with a shellfish? \n" +
        "A: A crab apple ");
    jokeArray.push("Q: How do you make an apple turnover? \n" +
        "A: Push it down hill. ");


function submitJoke() {
    finalJoke = jokeArray[randomJokes(min, max)];
    $("#textJoke").text("Joke: " + finalJoke);
}