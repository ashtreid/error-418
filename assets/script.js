/** @format */

// var movieSearchForm = document.getElementById("movie-search");
var movieSearchInput = document.getElementById("search");
// var searchResults = document.querySelector(".history");
var searchResults = document.getElementById("search-results");



//is taking the user inputs and sending the value to searchMovies
movieSearchInput.addEventListener("input", function (event) {
  event.preventDefault();
  var userInput = movieSearchInput.value;
  searchMovies(userInput);
});

//fetches poster image source from a 2nd API.
function getPosters(userInput, element) {
  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "276bbea6c0msh1738515d078995ap177c77jsna7bb4760ed85",
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
    },
  };
  fetch(
    "https://movie-database-alternative.p.rapidapi.com/?s=" +
      userInput +
      "&r=json&type=movie",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.Search);
      element.setAttribute("src", data.Search[0].Poster);
    });
}

//fetchs from TMDB's data base using the inputed value by the user.
function searchMovies(userInput) {
  fetch(
    "https://api.themoviedb.org/3/search/movie?api_key=59d03319215e9b420664039f4bb2b1b1&query=" +
      userInput +
      "&include_adult=false"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateSearchResults(data.results);
    });
}

//takes the results from the searchMovies functions and appends them as buttons to an ul.
//added a clearResults function because it was continually adding items and stacking below.
function updateSearchResults(results) {
  clearResults();

  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    // console.log(result);
    var resultItem = document.createElement("button");
    resultItem.textContent = result.title;
    resultItem.setAttribute("href", "#");
    resultItem.addEventListener("click", function (event) {
      event.preventDefault();
      var title = event.target.textContent;
      getMovieData(title);
      clearResults();
    });
    searchResults.appendChild(resultItem);
  }
}


//clears the search results before updating the list with new search results as user types.
function clearResults() {
  searchResults.innerHTML = "";
}

//takes input from search results and pulls the movie name and movie id from it.
//calls getMovieStreamingData with the id pulled.
function getMovieData(input) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=59d03319215e9b420664039f4bb2b1b1&query=${input}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var movieData = {
        movieId: data.results[0].id,
        movieName: data.results[0].title,
      };
      saveMovieData(movieData);

      // console.log(movieData.movieName);
    });
}

//saves movie data to local storage
function saveMovieData(data) {
  var movieData = JSON.parse(localStorage.getItem("movieData")) || [];
  for (let i = 0; i < movieData.length; i++) {
    if (movieData[i].movieName === data.movieName) {
      return;
    }
  }
  movieData.push(data);
  localStorage.setItem("movieData", JSON.stringify(movieData));
  getMovieStreamingData(data);
}

function loadFromLocalStorage() {
  var movieData = JSON.parse(localStorage.getItem("movieData")) || [];
  for (let i = 0; i < movieData.length; i++) {
    getMovieStreamingData(movieData[i]);
  }
}

function clearMovieCards() {
  document.querySelectorAll(".movie-card").innerHTML = "";
}

//need to finish this function to generate a card pulling the data from local storage.
function createMovieCard(movieName, streamingServices) {
  clearMovieCards();
  var movieCard = document.createElement("div");
  var movieInfo = document.createElement("p");
  var moviePoster = document.createElement("img");
  movieCard.classList.add("movie-card");
  if (!streamingServices.length) {
    movieInfo.textContent = `${movieName} is not showing on any streaming platforms at this time`;
  } else {
    movieInfo.textContent = `${movieName} Streaming on ${streamingServices.join(", ")}`;
  }
  movieCard.appendChild(movieInfo);
  movieCard.appendChild(moviePoster);

  getPosters(movieName, moviePoster); //takes 10 seconds

  document.getElementById("movie-history").appendChild(movieCard); // instant
}

// //need to finish this function to generate a card pulling the data from local storage.
// function createMovieCard(movieName, streamingServices) {
//   clearMovieCards();
//   var movieCard = document.createElement("li");
//   movieCard.classList.add("movie-card");
//   if (streamingServices.length === 0) {
//     movieCard.innerHTML = `${movieName} is not showing on any streaming platforms at this time`
//   } else {
//     movieCard.innerHTML = `${movieName} Streaming on ${streamingServices.join(', ')}`;
//   }
//   document.getElementById("movie-history").appendChild(movieCard);
// }

//takes the id and fetches the current streaming services from TMDB's database.
function getMovieStreamingData(movieData) {
  // console.log("movie id:", movieData.movieId);
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      movieData.movieId +
      "/watch/providers?api_key=59d03319215e9b420664039f4bb2b1b1&language=en-US"
  )
    .then(function (response) {
      // console.log("response:", response);
      return response.json();
    })
    .then(function (data) {
      var streamingServices = [];
      var dataResultsUS = data.results.US;
      if (!dataResultsUS) {
      } else if (dataResultsUS && dataResultsUS.flatrate) {
        for (let i = 0; i < dataResultsUS.flatrate.length; i++) {
          streamingServices.push(dataResultsUS.flatrate[i].provider_name);
        }
      }
      createMovieCard(movieData.movieName, streamingServices);
    });
}

loadFromLocalStorage();
