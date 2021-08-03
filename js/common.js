function agecalc(calender) {

    var year = calender.substring(0, 4); // 2010     6/15/2010
    var month = calender.substring(5, 7); // 6
    var day = calender.substring(8, 10); // 15

    var cyear = new Date().getFullYear(); // 2021    7/5/2021
    var cday = new Date().getDate(); // 5
    var cmonth = new Date().getMonth() + 1; // returns 0 - 11 instead of 1 - 12     // 7

    // current age based on difference of years
    // subtract 1 to year if birth month passes current month                                   15 oct 2010, 5 jul 2021 10 years  
    // if birth month is same as current month then determine what day to make subtraction      15 jul 2010, 5 jul 2021  10 years
    var nyear = 0;
    var nmonth = 0;
    // bday = 6/15/2010    cday = 7/7/2021
    //if(cyear > year){ // 2021 > 2010
    nyear = cyear - year; // 11 
    if (cmonth < month) { // 7 < 10 // bday has not occured 
        nyear = nyear - 1; // 10
        nmonth = (12 - month) + cmonth; // (12 - 10 = 2) + 7 = 9
        if (cday < day) { // 7 < 15
            nmonth = nmonth - 1;
        }
    }
    else if (cmonth == month) { // 6 == 6
        if (cday < day) { // 7 < 15   // bday has not occured
            nyear = nyear - 1;
        }
        nmonth = 0;
    }
    else if (cmonth > month) { // 6/15/2010  7/7/2021 // bday has occured
        nmonth = cmonth - month; // nmonth = 7 - 6/ 1
        if (cday < day) { // 7 < 15
            nmonth = nmonth - 1;
        }
    }

    var age = {
        "years": nyear,
        "months": nmonth
    }
    return age;
}

async function popupdetails(showid) { // child scope can use parent variables, parent cannot use child variables

    $('#personmodal').modal('hide');

    console.log("popupdetails");

    var showtvdetails = "https://api.themoviedb.org/3/tv/" + showid + "?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US" // string

    var results = await fetch(showtvdetails); // calling url/ string

    var details = await results.json(); // stored to json()
    console.log(details);

    var showcast = "https://api.themoviedb.org/3/tv/" + showid + "/credits?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US"

    var showcastresults = await fetch(showcast);

    var castdetails = await showcastresults.json();
    console.log(castdetails);

    document.getElementsByClassName("cast-container")[0].innerHTML = "";

    castdetails.cast.forEach(element => {
        var castmembers = document.createElement("div");
        castmembers.setAttribute("class", "cast-image-container");
        castmembers.setAttribute("id", element.id);
        castmembers.setAttribute("onclick", "personclick(this.id)");

        var castimage = document.createElement("div");
        castimage.setAttribute("class", "cast-image");
        var casturl;
        if (element.profile_path) {

            casturl = `https://image.tmdb.org/t/p/original${element.profile_path}`;
        }
        else {
            casturl = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
        }
        castimage.style.backgroundImage = `url(${casturl})`; // ${instead of plus}
        // the syntax to assign background image is: url("https//:linktoimage")
        castmembers.appendChild(castimage);

        var newdiv = document.createElement("div");
        castmembers.appendChild(newdiv);

        var membername = document.createElement("p");
        membername.setAttribute("class", "actor-name");
        membername.innerText = element.name;
        newdiv.appendChild(membername);


        document.getElementsByClassName("cast-container")[0].appendChild(castmembers);
    })


    document.getElementById("popuprating").innerText = details.vote_average;
    document.getElementById("popupraters").innerText = details.vote_count;
    document.getElementById("popuptitle").innerText = details.original_name;
    document.getElementById("popupimage").setAttribute("src", "https://image.tmdb.org/t/p/original" + details.poster_path);

    var duration;
    details.number_of_seasons == 1 ? duration = " season" : duration = " seasons"; // ternary operator, shortened if else
    // does number of seasons = 1?       if yes        :        if no
    document.getElementById("popupruntime").innerText = details.number_of_seasons + duration;



    document.getElementsByClassName("modal-body")[0].innerText = details.overview;
    
    $('#staticBackdrop').modal('show') // show created modal




    //             <!-- Button trigger modal -->
    // <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    //   Launch static backdrop modal
    // </button>
    // var myModal = document.getElementById("staticBackdrop");
    // myModal.show();




}

async function searchparams() {
    query = document.getElementById("searchbar").value;
    document.getElementById("pageheading").innerText = `Search Results for ${query}`;
    document.getElementById("buttongroup").style.display = "none";  // backgroundColor, camelCase, no dash in Javascript.

    console.log(query);
    pagenumber = 1;
    document.getElementById("showmorebtn").setAttribute("onclick", "nextpage(query, pagenumber)");

    document.getElementsByClassName("row")[0].innerHTML = "";

    nextpage(query, pagenumber);

}

//! Function for search and change of Movies/Tv Shows display !//

async function nextpage(query, i) {
    //console.log(a);
    console.log(query);
    console.log(i);



    var searchparameters = await fetch("https://api.themoviedb.org/3/search/multi?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US&query=" + query + "&page=" + i + "&include_adult=false");
    var searchresult = await searchparameters.json();


    Array.from(searchresult.results).forEach(element => {
        var display = document.createElement("div");
        display.setAttribute("class", "col-md-3");


        var image = document.createElement("img");
        image.setAttribute("class", "showsimage");
        if (element["media_type"] == "person") {
            if (!element["profile_path"]) {
                image.setAttribute("src", "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg");
            }
            else {
                image.setAttribute("src", "https://image.tmdb.org/t/p/original" + element["profile_path"]);
            }
        }

        if (element["media_type"] == "tv" || element["media_type"] == "movie") {
            if (!element["poster_path"]) {
                image.setAttribute("src", "https://rukminim1.flixcart.com/image/416/416/jm0wscw0/art-craft-kit/g/h/f/director-s-film-movie-clapper-chalkboard-professional-vintage-original-imaf9yqgukfhmger.jpeg?q=70");
            }
            else {
                image.setAttribute("src", "https://image.tmdb.org/t/p/original" + element["poster_path"]);
            }
        }
        display.appendChild(image);

        var title = document.createElement("div");
        title.setAttribute("class", "showsinfo");
        display.appendChild(title);

        var heading = document.createElement("h3");
        if (element["media_type"] == "person") {
            heading.innerText = element["name"];
            display.setAttribute("id", element.id);
            display.setAttribute("onclick", "personclick(this.getAttribute(`id`))");
            // create seperate modal if original template modal does not apply to person information

        }
        else if (element["media_type"] == "tv") {
            heading.innerText = element["original_name"]; // tv, movies use element["original_title"]
            display.setAttribute("id", element.id);
            display.setAttribute("data-synopsis", element.overview);
            display.setAttribute("onclick", "popupdetails(this.getAttribute(`id`))");


        }
        else if (element["media_type"] == "movie") {
            heading.innerText = element["original_title"];
            display.setAttribute("id", element.id);
            display.setAttribute("onclick", "movieparamsclick(this.getAttribute(`id`))");
        }
        title.appendChild(heading);

        if (element["media_type"] == "tv" || element["media_type"] == "movie") {
            var rating = document.createElement("h3");
            rating.setAttribute("class", "rating");
            rating.innerText = element["vote_average"];
            title.appendChild(rating);
        }

        document.getElementsByClassName("row")[0].appendChild(display);

    })
    pagenumber++;
}

//! Displays Movies/Tv shows with searchbar Function !//

async function movieparamsclick(movieid) {

    $('#personmodal').modal('hide');

    var movies = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US");
    var movieresults = await movies.json();
    console.log(movieresults);

    document.getElementById("popuprating").innerText = movieresults.vote_average;
    document.getElementById("popupraters").innerText = movieresults.vote_count;
    document.getElementById("popuptitle").innerText = movieresults.original_title;
    document.getElementById("popupimage").setAttribute("src", "https://image.tmdb.org/t/p/original" + movieresults.poster_path);
    document.getElementById("popupruntime").innerText = movieresults.runtime + " minutes";

    document.getElementsByClassName("modal-body")[0].innerText = movieresults.overview;

    var castmembers = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/credits?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US");
    var castresults = await castmembers.json();
    console.log(castresults);

    document.getElementsByClassName("cast-container")[0].innerHTML = "";

    castresults.cast.forEach(element => {
        var castmembers = document.createElement("div");
        castmembers.setAttribute("class", "cast-image-container");
        castmembers.setAttribute("id", element.id);
        castmembers.setAttribute("onclick", "personclick(this.id)");

        var castimage = document.createElement("div");
        castimage.setAttribute("class", "cast-image");
        var casturl;
        if (element.profile_path) {

            casturl = `https://image.tmdb.org/t/p/original${element.profile_path}`;
        }
        else {
            casturl = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
        }
        castimage.style.backgroundImage = `url(${casturl})`; // ${instead of plus}
        castmembers.appendChild(castimage);

        var newdiv = document.createElement("div");
        castmembers.appendChild(newdiv);

        var membername = document.createElement("p");
        membername.setAttribute("class", "actor-name");
        membername.innerText = element.name;
        newdiv.appendChild(membername);


        document.getElementsByClassName("cast-container")[0].appendChild(castmembers);
    })

    $('#staticBackdrop').modal('show');

}

//! pass movie details for popup !//

async function personclick(personid) {

    $('#staticBackdrop').modal('hide');


    console.log("personclick");
    var person = await fetch("https://api.themoviedb.org/3/person/" + personid + "?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US");
    var personresult = await person.json();
    var credits = await fetch("https://api.themoviedb.org/3/person/"+personid+"/combined_credits?api_key=1972cf9a9940de5dbf03a85062b98f06&language=en-US");
    var creditresults = await credits.json();

    document.getElementById("actorname").innerText = personresult.name;

    if(personresult.profile_path){
        document.getElementById("popupimage2").setAttribute("src", "https://image.tmdb.org/t/p/original"+personresult.profile_path);
    }
    else{
        document.getElementById("popupimage2").setAttribute("src", "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg");
    }

    var age = agecalc(personresult.birthday);
    console.log(age);

    document.getElementById("age").innerText = age.years; 
    document.getElementById("bio").innerText = personresult.biography;

    document.getElementById("actor-container").innerHTML = "";
    
    Array.from(creditresults.cast).forEach(element =>{
        var infobox = document.createElement("div");
        infobox.setAttribute("class", "cast-image-container "); // box
        infobox.setAttribute("id", element.id);
        if(element.media_type == "movie"){
            infobox.setAttribute("onclick", "movieparamsclick(this.id)"); // only id uses this., others this.getAttribute("type");
        }
        else if(element.media_type == "tv"){
            infobox.setAttribute("onclick", "popupdetails(this.id)");
        }

        var movieimage = document.createElement("div"); // inner box
        movieimage.setAttribute("class", "cast-image");
        
        if(element.poster_path){
            movieimage.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${element.poster_path}")`;
        }
        else{
            movieimage.style.backgroundImage = `url("https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg")`;
        }

        infobox.appendChild(movieimage);

        var infodetails = document.createElement("div"); // description box
        infobox.appendChild(infodetails);

        var movrating = document.createElement("p");
        movrating.innerText = "Rated: "+element.vote_average;
        infodetails.appendChild(movrating);

        var charname = document.createElement("p");
        charname.setAttribute("class", "actor-name");
        charname.innerText = element.character;
        infodetails.appendChild(charname);

        document.getElementById("actor-container").appendChild(infobox);
    })




    $('#personmodal').modal('show');
}