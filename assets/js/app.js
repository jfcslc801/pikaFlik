// Initialize Firebase
var config = {
  apiKey: "AIzaSyDeGkmM8yLp1mGe3Dh7sTVTxZA6XVj3srU",
  authDomain: "pikaflik-9cfdc.firebaseapp.com",
  databaseURL: "https://pikaflik-9cfdc.firebaseio.com",
  projectId: "pikaflik-9cfdc",
  storageBucket: "",
  messagingSenderId: "25073261476"
};

firebase.initializeApp(config);

// Created a variable to reference to the firebase 
var db = firebase.database();

// Variables with user authentication
const auth = firebase.auth();
auth.onAuthStateChanged(firebaseUser => { });
var logOut = document.getElementById("btnLogOut");

// hiding and unhiding the results page on the group-page.html
var winResults = document.getElementById("winResults");


// **************************** API CALL STUFF ************************************
// Variables
var year = 2012
var genre = 12;
var movieName;
var imdbId;
var titles = [];
var posters = [];
var pages = [];
var calls = 0;
var selected = [];
var genre, year1, year2;
// Object for storing movie selections
var movieChoices = {
genre: null,
year1: null,
year2: null
}


$("#groupSubmit").on("click", function () {




// Setting Genre
switch ($("#genre").val()) {
case "Action":
  genre = 28;
  break;
case "Comedy":
  genre = 35;
  break;
case "Documentary":
  genre = 99;
  break;
case "Drama":
  genre = 18;
  break;
case "Horror":
  genre = 27;
  break;
}

// Setting years based off of selection
switch ($("#year").val()) {
case "Silent 1890-1929":
  year1 = 1890;
  year2 = 1929;
  break;
case "Classic 1930-1969":
  year1 = 1930;
  year2 = 1969;
  break;
case "Modern 1970-1999":
  year1 = 1970;
  year2 = 1999;
  break;
case "Contemporary 2000-Now":
  year1 = 2000;
  year2 = 2018;
  break;
}

movieChoices.genre = genre;
movieChoices.year1 = year1;
movieChoices.year2 = year2;

db.ref("Group1/movieInfo").set(movieChoices)


$.ajax({
  url: "https://api.themoviedb.org/3/discover/movie?api_key=55fdfce207e38e045803eb5855ec3bca&language=en-US&sort_by=vote_count.asc&include_adult=false&include_video=true&page=1&primary_release_date.gte=" + year1 + "&primary_release_date.lte=" + year2 + "&with_genres=" + genre,
  method: "GET"
}).then(function (response) {
console.log(response);
  var pageNums = [];
  for (var i = 1; i < 8; i++) {
      pageNums.push(Math.floor(Math.random() * (response.total_pages - 1)))
  }
  db.ref("Group1/pages").set(pageNums)
});
})


// Listener
db.ref("Group1/pages").on("child_added", function (snapshot) {
var numref = JSON.parse(JSON.stringify(snapshot.val()))
pages.push(numref)
console.log(pages);
});



// Clears database when called, so as to reset the game and choices submitted

$("#resetSubmit").on("click", function(){

// var selectedChoices = db.ref("Group1/selected").val();
// selectedChoices.val().removeValue();
// db.ref("Group1/movieInfo").set();
// year1;
// year2;
// genre;
// selected = [];


// testing purposes
winner();

winResults.classList.remove("hide");

})



// Deciding winner on the votes chosen.
var movieVotes = [];
var voteCount = [];
var winner;
var posterPath, movieTitle;


db.ref("Group1/selected").on("child_added", function (snapshot) {
snapshot.forEach(function (snapshot) {
  var votes = JSON.parse(JSON.stringify(snapshot.val()));
  movieVotes.push(votes);
  console.log('done')
})
});

setTimeout(function(){

var current = "";
var num = 0;
for (var i = 0; i < movieVotes.length; i++) {
  current = movieVotes[i];
  for (var j = 0; j < movieVotes.length; j++) {
      if (movieVotes[j] === current) {
          num++;
      }
  }
  for (var k = 0; j < movieVotes.length; k++) {
      if (movieVotes[k] === current) {
          movieVotes.splice(i, 1);
      }
  }
  voteCount[current] = num;
  num = 0;
}
var votesSorted = Object.keys(voteCount).sort(function (a, b) {
  return voteCount[a] - voteCount[b]
});
winner = votesSorted[votesSorted.length-1]
// alert(winner)


$.ajax({
url: "https://api.themoviedb.org/3/search/movie?api_key=55fdfce207e38e045803eb5855ec3bca&query=" + winner + "&page=1&include_adult=true",
method: "GET"
}).then(function (response) {



posterPath = response.results[0].poster_path;
movieTitle = response.results[0].title;
console.log('winner' + posterPath, movieTitle);


var poster = $("<img>");
poster.attr("src", "https://image.tmdb.org/t/p/original/" + posterPath);
$("#topMoviePoster").append(poster);
$("#pickHeader").text(movieTitle)
winResults.classList.remove("hide");

var info = $("<p>");
info.html("<b>Overview:</b> " + response.results[0].overview)
$("#topMovieInfo").append(info);

var release = $("<p>");
release.html("<b>Release Date:</b> " + response.results[0].release_date)
$("#topMovieInfo").append(release);


// release_date


// title
// poster_path

// https://image.tmdb.org/t/p/original/
});

}, 1500) 







function winner() {

// var current = "";
// var num = 0;
// for (var i = 0; i < movieVotes.length; i++) {
//     current = movieVotes[i];
//     for (var j = 0; j < movieVotes.length; j++) {
//         if (movieVotes[j] === current) {
//             num++;
//         }
//     }
//     for (var k = 0; j < movieVotes.length; k++) {
//         if (movieVotes[k] === current) {
//             movieVotes.splice(i, 1);
//         }
//     }
//     voteCount[current] = num;
//     num = 0;
// }
// var votesSorted = Object.keys(voteCount).sort(function (a, b) {
//     return voteCount[a] - voteCount[b]
// });
// winner = votesSorted[votesSorted.length-1]
// // alert(winner)


// $.ajax({
//   url: "https://api.themoviedb.org/3/search/movie?api_key=55fdfce207e38e045803eb5855ec3bca&query=" + winner + "&page=1&include_adult=true",
//   method: "GET"
// }).then(function (response) {

// console.log('winner' + response.results[0].poster_path);

// // title
// // poster_path

// // https://image.tmdb.org/t/p/original/
// });
}


// // Another Ajax call to get title and poster for the final presentation

// https://api.themoviedb.org/3/search/movie?api_key=55fdfce207e38e045803eb5855ec3bca&query=Finders%20Keepers%3A%20The%20Root%20of%20All%20Evil&page=1&include_adult=true











// **************************** END API CALL STUFF ************************************






// **************************** USER AUTHENTICATION ********************************


// Get Elements
var txtEmail;
var txtPassword;



// Add login event
$("#btnLogin").on("click", function () {
// Get email and pass
txtEmail = $("#txtEmail").val();
txtPassword = $("#txtPassword").val();
// Sign in 
const promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword);
promise.catch(e => console.log(e.message));
})

// Add Sign up event
$("#btnSignUp").on("click", function () {
// Get email and pass
txtEmail = $("#txtEmail").val().trim();
txtPassword = $("#txtPassword").val().trim();
// Sign up 
const promise = auth.createUserWithEmailAndPassword(txtEmail, txtPassword);
promise.catch(e => console.log(e.message));
})



// Add Sign out event
$("#btnLogOut").on("click", function () {
// Sign out 
firebase.auth().signOut();
console.log("test");
});


// Add a reatime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
if (firebaseUser) {
console.log(firebaseUser)
console.log(firebaseUser.email)
console.log(firebaseUser.Kb.I)
logOut.classList.remove("hide");
$("#userName").text("Hi " + firebaseUser.email + "!");
} else {
console.log('not logged in');
logOut.classList.add("hide");
$("#userName").html("<a href='index.html'>Hi! Click to Log In</a>");
}
});


// **************************** END USER AUTHENTICATION ********************************