

async function fetchshows(btnId) {
    var dayshows = "https://api.themoviedb.org/3/trending/tv/day?api_key=1972cf9a9940de5dbf03a85062b98f06";

    var weekshows = "https://api.themoviedb.org/3/trending/tv/week?api_key=1972cf9a9940de5dbf03a85062b98f06";
    // default

    

    

    var shows;
    page = 2;

    if (btnId == "dayshowsbtn") {
        shows = await fetch(dayshows);
        console.log("day");

        type = "day";

    }
    else {
        shows = await fetch(weekshows);
        console.log("week");

        type = "week";

    }

    

    // create functionality for onclick function to show more based on dayshows or weekshows selection.
    // choice of dayshows or weekshows can be stored for onclick paramater use
    // [data-varname]; 


    var showsdata = await shows.json()
    console.log(showsdata);

    

    document.getElementsByClassName("row")[0].innerHTML = "";

    appendshows(showsdata);

    

}
fetchshows(); // run when page loads

//! initial display function !// 

async function appendshows(result) {
    result.results.forEach(shows => {
        var newshows = document.createElement("div");
        newshows.setAttribute("class", "shows col-md-3");

        newshows.setAttribute("id", shows.id);
        newshows.setAttribute("data-synopsis", shows.overview);
        newshows.setAttribute("onclick", "popupdetails(this.getAttribute(`id`))"); // single quotes to signify string not ending at .getAttribute("")


        var newimg = document.createElement("img");
        newimg.setAttribute("class", "showsimage");
        newimg.setAttribute("src", "https://image.tmdb.org/t/p/original" + shows.poster_path);
        newimg.setAttribute("alt", shows.id);
        newshows.appendChild(newimg);

        var title = document.createElement("div");
        title.setAttribute("class", "showsinfo");
        newshows.appendChild(title);

        var heading = document.createElement("h3");
        heading.innerText = shows.original_name;
        title.appendChild(heading);

        var rating = document.createElement("h3");
        rating.setAttribute("class", "rating");

        var ratingcolor;

        if (shows.vote_average > 7.5) {
            ratingcolor = "rgb(0, 206, 0)";
        }
        else if (shows.vote_average > 5.0) {
            ratingcolor = "orange";
        }
        else if (shows.vote_average > 4.0) {
            ratingcolor = "yellow";
        }
        else if (shows.vote_average < 4.0) {
            ratingcolor = "red";
        }
        rating.style.color = ratingcolor;

        rating.innerText = shows.vote_average;
        title.appendChild(rating);




        // document.getElementsByClassName("row")[0].childNodes.forEach(child => {
        //     child.remove();
        // })

        document.getElementsByClassName("row")[0].appendChild(newshows);

    });


}
//! Display Movies/Tv Shows Function !//



//! Pop up details Function !//
// dont run until clicked







async function moreclick() {
    var url;

    if (type == "day") {
        url = "https://api.themoviedb.org/3/trending/tv/day?api_key=1972cf9a9940de5dbf03a85062b98f06&page=" + page;
    }
    else {
        url = "https://api.themoviedb.org/3/trending/tv/week?api_key=1972cf9a9940de5dbf03a85062b98f06&page=" + page;
    }

    page++;

    var data = await fetch(url);
    var dataresults = await data.json();
    console.log(page);


    appendshows(dataresults);



}

//! Displays next set of Movies/Tv Shows Function !//




