const apiKey = "f6cf4e1fe3dc615ad725ecd19cba4559";
let movieId = null;

// Fetch trending movies and start auto-scroll on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchTrendingMovies();
});


// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}


// Fetch Trending Movies
function fetchTrendingMovies() {
    const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

    fetch(trendingUrl)
        .then(response => response.json())
        .then(data => {
            const trendingContainer = document.getElementById("trendingMovies");

            if (data.results.length === 0) {
                trendingContainer.innerHTML = "<p>No trending movies available.</p>";
                return;
            }

            trendingContainer.innerHTML = data.results
                .slice(0, 10)
                .map(movie => `
                    <div class="trending-item">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <p><strong>${movie.title}</strong></p>
                        <p>⭐ ${movie.vote_average}/10</p>
                    </div>
                `)
                .join("");

            startAutoScroll();
        })
        .catch(error => console.error("Error fetching trending movies:", error));
}

// Auto-scroll settings
const scrollStep = 350; // Scroll step size in pixels
const autoScrollInterval = 4000; // Auto-scroll every 3 seconds
let scrollAmount = 0;

function scrollRight() {
    const container = document.getElementById("trendingMovies");
    container.scrollBy({ left: scrollStep, behavior: 'smooth' });

    if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        scrollAmount = 0;
    } else {
        scrollAmount += scrollStep;
    }
}

// Start auto-scroll
function startAutoScroll() {
    setInterval(scrollRight, autoScrollInterval);
}

// Search for a movie
function searchMovie() {
    const movieName = document.getElementById("searchInput").value.trim();
    if (!movieName) {
        alert("Please enter a movie name!");
        return;
    }

    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                alert("Movie not found!");
                return;
            }

            const movie = data.results[0];
            movieId = movie.id;

            document.getElementById("movieDetails").innerHTML = `
                <h2 class="title">${movie.title}</h2>
                <img class="poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Poster">
                <p class="Release_Date"><strong>Release Date:</strong> ${movie.release_date}</p>
                <p class="Rating"><strong>Rating:</strong> ${movie.vote_average}/10</p>
                <p class="Overview"><strong>Overview:</strong> ${movie.overview}</p>
            `;

            document.getElementById("recommendations").innerHTML = "";
            document.getElementById("recTitle").style.display = "none";

            // Scroll to the movie details section
            scrollToSection('movieDetails');
        })
        .catch(error => console.error("Error fetching movie:", error));
}


// Get recommended movies
function getRecommendations() {
    if (!movieId) {
        alert("Search for a movie first!");
        return;
    }

    const recUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US`;

    fetch(recUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                alert("No recommendations found for this movie.");
                return;
            }

            document.getElementById("recommendations").innerHTML = data.results
                .slice(0, 16) // Show top 6 recommendations
                .map(movie => `
                    <div>
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <p><strong>${movie.title}</strong></p>
                        <p>⭐ ${movie.vote_average}/10</p>
                    </div>
                `)
                .join("");

            document.getElementById("recTitle").style.display = "block";

            // Scroll to the recommendations section
            scrollToSection('recommendations');
        })
        .catch(error => console.error("Error fetching recommendations:", error));
}
