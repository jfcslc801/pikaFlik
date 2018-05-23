$('#submit').on('click', function(){

    function search (){
        // clear results
        $("#results").html('');
        $("#buttons").html('');
    
        // get form input
        q = $('#query').val();
    
        $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet, id',
                q: q,
                type: 'video',
                key: 'AIzaSyBOWK2hk4EyjeJkJMgaxd-YP2sWLMvAhi8'},
                function(data){
                    var nextPageToken = data.nextPageToken;
                    var prevPageToken = data.prevPageToken;
    
                    console.log(data);
                }
        );
    }
})
search ();