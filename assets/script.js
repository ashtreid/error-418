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
//Fix 1: List feels too long. And doesn't get shorter as you type names.
// - Limit database maybe? or could limit the returned results.
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
      getMovieStreamingData(movieData.movieId);
      console.log(movieData.movieName);
    });
}

//takes the id and fetches the current streaming services from TMDB's database.
//Fix 1: need an if/else that displays something else if it's not streaming anywhere. Currently throwing an error in console if it's not.
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
      var dataResults = data.results
      if (!dataResults.US) {
        console.log("no service to stream")
      } else if (dataResults.US) {
        for (let i = 0; i < data.results.US.flatrate.length; i++) {
          var streamingService = data.results.US.flatrate[i].provider_name;
          console.log("Streaming service: " + streamingService);
        };
      };
    });
};
