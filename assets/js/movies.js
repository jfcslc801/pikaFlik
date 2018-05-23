window.onload = function () {
    //variable
    var year = 2012
    var genre = 12;
    var movieName;
    var imdbId;
    var titles = [];
    var posters = [];
    var config = {
        apiKey: "AIzaSyDeGkmM8yLp1mGe3Dh7sTVTxZA6XVj3srU",
        authDomain: "pikaflik-9cfdc.firebaseapp.com",
        databaseURL: "https://pikaflik-9cfdc.firebaseio.com",
        projectId: "pikaflik-9cfdc",
        storageBucket: "",
        messagingSenderId: "25073261476"
      
      };
    // firebase.initializeApp(config);
    var database = firebase.database();
    var pages = [];
    var calls = 0;
    var selected = [];
    var genre, year1, year2;




    database.ref("/Group1").on("value", function(snapshot) {
        var snap = snapshot.val()
        // If Firebase has a highPrice and highBidder stored (first case)
        if (snapshot.child("movieInfo").exists()) {
            console.log(snap.movieInfo.genre)
            console.log('omg');

            genre = snap.movieInfo.genre;
            year1 = snap.movieInfo.year1;
            year2 = snap.movieInfo.year2;

        }
      
        // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
        else {
      
            console.log('nope');
        }
      
        // If any errors are experienced, log them to console.
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });













    //api
    $("#submit").on("click", function () {
        event.preventDefault();
        console.log(genre, year1, year2);
        $.ajax({
            url: "https://api.themoviedb.org/3/discover/movie?api_key=55fdfce207e38e045803eb5855ec3bca&language=en-US&sort_by=vote_count.asc&include_adult=false&include_video=true&page=1&primary_release_date.gte=" + year1 + "&primary_release_date.lte=" + year2 + "&with_genres=" + genre,
            method: "GET"
        }).then(function (response) {
            var pageNums = [];
            for (var i = 1; i < 8; i++) {
                pageNums.push(Math.floor(Math.random() * (response.total_pages - 1)))
            }
            database.ref("Group1/pages").set(pageNums)
        });
    });

    database.ref("Group1/pages").on("child_added", function (snapshot) {
        var numref = JSON.parse(JSON.stringify(snapshot.val()))
        pages.push(numref)
    });
    $("#start").on("click", function () {
        for (let i = 0; i < pages.length; i++) {
            $.ajax({
                url: "https://api.themoviedb.org/3/discover/movie?api_key=55fdfce207e38e045803eb5855ec3bca&language=en-US&sort_by=vote_count.asc&include_adult=false&include_video=true&page=" + pages[i] + "&primary_release_date.gte=" + year1 + "&primary_release_date.lte=" + year2 + "&with_genres=" + genre,
                method: "GET"
            }).then(function (response) {
                calls++
                var src = response.results;
                for (let j = 0; j < src.length; j++) {
                    titles.push(src[j].title);
                    posters.push(src[j].poster_path)
                }
                if (calls === pages.length) {
                    setTimeout(post, 3000)
                }
            });
        }
    });

    function post() {
        for (let k = 0; k < 100; k++) {
            if (posters[k] !== null) {
                var div = $("<div>");
                var poster = $("<img>");

                // var modal = $("<div class='container1'>")
                // var button = $("<button type='button' class='btn btn-info btn-md' data-toggle='modal' data-target='#myModal'>Movie Info...</button>")

                // // var modal1 = $("<div class='modal fade' id='myModal' role='dialog'")
                // modal.append(button);
               
                 
                    // <!-- Modal -->
                    // <div class="modal fade" id="myModal" role="dialog">
                    //     <div class="modal-dialog">
                    //         <!-- Modal content-->
                    //         <div class="modal-content">
                    //             <div class="modal-header">
                    //                 <button type="button" class="close" data-dismiss="modal">&times;</button>
                    //                 <h4 class="modal-title">"title":</h4>
                    //             </div>
                    //             <div class="modal-body">
                    //                 <p>
                    //                     <ul>
                    //                        <li>"vote_average":</li>
                    //                        <li>"original_language":</li> 
                    //                        <li>"adult":</li> 
                    //                        <li>"overview":</li>
                    //                     </ul>
                    //                 </p>
                    //             </div>
                    //             <div class="modal-footer">
                    //                 <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>





                poster.attr("src", "https://image.tmdb.org/t/p/original/" + posters[k]);
                poster.css("height", "250px")
                div.append(poster);
                div.addClass("mPoster")
                div.attr("data-selected", false)
                div.attr("data-title", titles[k]);
                div.css("position", "relative")
                div.css("z-index", "0")
                // div.append(modal);
                $("#display-movies-here").append(div);
            }
        }
    }

    //create the poster buttons
    $(document).on("click", ".mPoster", function () {
        if ($(this).attr("data-selected") === "false") {
            $(this).attr("data-selected", true);
            $(this).append("<img src='assets/images/cm.png' id='check' style='height: 90px; z-index: 2; position: absolute; left: 40px; top: 75px;'>")
            selected.push($(this).attr("data-title"))
            console.log(selected)
        } else {
            $(this).attr("data-selected", false);
            $(this).find('#check').remove();
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] === $(this).attr("data-title")) {
                    selected.splice(i, 1);
                }
            }
        }
    });

    // Line for hiding submitted section on movie list
    var submitted = document.getElementById("submitted");


    $("#done").on("click", function () {
        database.ref("Group1/selected").push(selected);
        submitted.classList.remove("hide");
    })
    //create the more info buttons underneath

    //bring up the pop up with the trailer showing and the synopsis underneath

}