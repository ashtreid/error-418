/** @format */

var movieSearchForm = document.getElementById("movie-search");
var movieSearchInput = document.getElementById("movie-input");
var searchResults = document.getElementById("search-results");

//is taking the user inputs and sending the value to searchMovies
movieSearchInput.addEventListener("input", function (event) {
  event.preventDefault();
  var userInput = movieSearchInput.value;
  searchMovies(userInput);
});

//fetchs from TMDB's data base using the inputed value by the user.
function searchMovies(userInput) {
  fetch(
    "https://api.themoviedb.org/3/search/movie?api_key=59d03319215e9b420664039f4bb2b1b1&query=" +
      userInput
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
    var resultItem = document.createElement("button");
    resultItem.textContent = result.title;
    resultItem.addEventListener("click", function (event) {
      event.preventDefault();
      var title = event.target.textContent;
      getMovieData(title);
      loadFromLocalStorage();
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
    "https://api.themoviedb.org/3/search/movie?api_key=59d03319215e9b420664039f4bb2b1b1&query=" +
      input
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
      getMovieStreamingData(movieData.movieId);
      console.log(movieData.movieName);
    });
}

//saves movie data to local storage
function saveMovieData(data) {
  var movieData = JSON.parse(localStorage.getItem("movieData")) || [];
  movieData.push(data);
  localStorage.setItem("movieData", JSON.stringify(movieData));
}

function loadFromLocalStorage() {
  var movieData = JSON.parse(localStorage.getItem("movieData")) || [];
  for (let i = 0; i < movieData.length; i++) {}
  console.log(movieData);
}

//need to finish this function to generate a card pulling the data from local storage.
function createMovieCard() {
  var movieCard = document.createElement("li");
  movieCard.textContent = movieData.movieName;
  document.getElementById("movie-history").appendChild(movieCard);
}

//takes the id and fetches the current streaming services from TMDB's database.
function getMovieStreamingData(movieId) {
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      movieId +
      "/watch/providers?api_key=59d03319215e9b420664039f4bb2b1b1&language=en-US"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var dataResults = data.results;
      if (!dataResults.US) {
        console.log("no service to stream");
      } else if (dataResults.US) {
        for (let i = 0; i < data.results.US.flatrate.length; i++) {
          var streamingService = data.results.US.flatrate[i].provider_name;
          console.log("Streaming service: " + streamingService);
          return streamingService;
        }
      }
    });
}
