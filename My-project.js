let CurrentStack = [];

const HomeButton = document.querySelector("#home-button");
const FavouriteButton = document.querySelector("#favorities-button");
const SearchBar = document.querySelector("#search-bar");
const CardContainer = document.querySelector("#card-container");

// simple function to show an alert when we need
function showAlert(message) {
  alert(message);
}

// create move cards using elements of CurrentStack array
function renderList(actionForButton) {
  CardContainer.innerHTML = "";

  for (let i = 0; i < CurrentStack.length; i++) {
    // creating div element for movie card and setting class and id to it
    let MoviesCard = document.createElement("div");
    MoviesCard.classList.add("Movies-Card");

    // templet for interHtml of movie card which sets image, title and rating of particular movie
    MoviesCard.innerHTML = `
		<img src="${
      "https://image.tmdb.org/t/p/w500" + CurrentStack[i].poster_path
    }" alt="${CurrentStack[i].title}" class="MoviePoster">
		<div class="Title-Container">
			<span>${CurrentStack[i].title}</span>
			<div class="Movie-Rating-Container">
				<img src="Favourite Icon.png" alt="">
				<span>${CurrentStack[i].vote_average}</span>
			</div>
		</div>

		<button id="${
      CurrentStack[i].id
    }" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>

		<button onclick="${actionForButton}(this)" class="Adding-To-Favourite icon-button" data-id="${
      CurrentStack[i].id
    }" >
			<img src="Favourite Icon.png">
			<span>${actionForButton}</span>
		</button>
		`;
    CardContainer.append(MoviesCard); //appending card to the movie container view
  }
}

// if any thing wrong by using this function we print message to the main screen
function printError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.innerHTML = message;
  errorDiv.style.height = "100%";
  errorDiv.style.fontSize = "5rem";
  errorDiv.style.margin = "auto";
  CardContainer.innerHTML = "";
  CardContainer.append(errorDiv);
}

// gets latest movies from the server and renders as movie cards
function GetLatestMovies() {
  const tmdb = fetch(
    "https://api.themoviedb.org/3/trending/movie/day?api_key=cb213741fa9662c69add38c5a59c0110"
  )
    .then((response) => response.json())
    .then((data) => {
      CurrentStack = data.results;
      renderList("favourite");
    })
    .catch((err) => printError(err));
}
GetLatestMovies();

// when we clicked on home button this fetches trending movies and renders on web-page
HomeButton.addEventListener("click", GetLatestMovies);

// search box event listner check for any key press and search the movie according and show on web-page
SearchBar.addEventListener("keyup", () => {
  let searchString = SearchBar.value;

  if (searchString.length > 0) {
    let searchStringURI = encodeURI(searchString);
    const searchResult = fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`
    )
      .then((response) => response.json())
      .then((data) => {
        CurrentStack = data.results;
        renderList("favourite");
      })
      .catch((err) => printError(err));
  }
});

// function to add movie into favourite section
function favourite(element) {
  let id = element.dataset.id;
  for (let i = 0; i < CurrentStack.length; i++) {
    if (CurrentStack[i].id == id) {
      let favouriteMoviesAyush = JSON.parse(
        localStorage.getItem("favouriteMoviesAyush")
      );

      if (favouriteMoviesAyush == null) {
        favouriteMoviesAyush = [];
      }

      favouriteMoviesAyush.unshift(CurrentStack[i]);
      localStorage.setItem(
        "favouriteMoviesAyush",
        JSON.stringify(favouriteMoviesAyush)
      );

      showAlert(CurrentStack[i].title + " added to favourite");
      return;
    }
  }
}

// when Favourites movie button click it shows the favourite moves
FavouriteButton.addEventListener("click", () => {
  let favouriteMoviesAyush = JSON.parse(
    localStorage.getItem("favouriteMoviesAyush")
  );
  if (favouriteMoviesAyush == null || favouriteMoviesAyush.length < 1) {
    showAlert("you have not added any movie to favourite");
    return;
  }

  CurrentStack = favouriteMoviesAyush;
  renderList("remove");
});

// remove movies from favourite section
function remove(element) {
  let id = element.dataset.id;
  let favouriteMoviesAyush = JSON.parse(
    localStorage.getItem("favouriteMoviesAyush")
  );
  let newFavouriteMovies = [];
  for (let i = 0; i < favouriteMoviesAyush.length; i++) {
    if (favouriteMoviesAyush[i].id == id) {
      continue;
    }
    newFavouriteMovies.push(favouriteMoviesAyush[i]);
  }

  localStorage.setItem(
    "favouriteMoviesAyush",
    JSON.stringify(newFavouriteMovies)
  );
  CurrentStack = newFavouriteMovies;
  renderList("remove");
}

// renders movie details on web-page
function renderMovieInDetail(movie) {
  console.log(movie);
  CardContainer.innerHTML = "";

  let MovieDetail = document.createElement("div");
  MovieDetail.classList.add("Movie-Detail-Card");

  MovieDetail.innerHTML = `
		<img src="${
      "https://image.tmdb.org/t/p/w500" + movie.backdrop_path
    }" class="Movie-Detail-Background">
		<img src="${
      "https://image.tmdb.org/t/p/w500" + movie.poster_path
    }" class="Movie-Poster-Detail">
		<div class="Movie-Title-Detail">
			<span>${movie.title}</span>
			<div class="Movie-Rating-Detail">
				<img src="Favourite Icon.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="Movie-Plot-Detail">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

  CardContainer.append(MovieDetail);
}

// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element) {
  fetch(
    `https://api.themoviedb.org/3/movie/${element.getAttribute(
      "id"
    )}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => renderMovieInDetail(data))
    .catch((err) => printError(err));
}
