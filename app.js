document.addEventListener("DOMContentLoaded", () => {
    const theaterSelect = document.getElementById("theater-select");
    const searchButton = document.getElementById("search-button");
    const movieSearch = document.getElementById("movie-search");
    const moviesSection = document.getElementById("movies-section");

    // teatterien lista Finnkino API:sta
    fetchTheaters();

    // tapahtumaohjain "Hae elokuvia" -painikkeelle
    searchButton.addEventListener("click", () => {
        const selectedTheaterId = theaterSelect.value;
        const searchString = movieSearch.value.trim();
        
        if (selectedTheaterId) {
            fetchMovies(selectedTheaterId, searchString);
        } else {
            alert("Valitse teatteri ensin!");
        }
    });

    // teatterit Finnkino API:sta
    function fetchTheaters() {
        fetch("https://www.finnkino.fi/xml/TheatreAreas/")
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, "application/xml");
                const theaters = xml.getElementsByTagName("TheatreArea");

                for (let theater of theaters) {
                    const id = theater.querySelector("ID").textContent;
                    const name = theater.querySelector("Name").textContent;
                    const option = document.createElement("option");
                    option.value = id;
                    option.textContent = name;
                    theaterSelect.appendChild(option);
                }
            })
            .catch(error => console.error("Virhe teattereiden haussa:", error));
    }

    // hakee elokuvat valitusta teatterista + suodattaa hakukentän perusteella
    function fetchMovies(theaterId, searchString) {
        fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, "application/xml");
                const shows = xml.getElementsByTagName("Show");

                // tyhjentää aiemmat elokuvatulokset
                moviesSection.innerHTML = "";

                for (let show of shows) {
                    const title = show.querySelector("Title").textContent;
                    const imageUrl = show.querySelector("EventMediumImagePortrait").textContent;
                    const showTime = show.querySelector("dttmShowStart").textContent;

                    if (!searchString || title.toLowerCase().includes(searchString.toLowerCase())) {
                        const article = document.createElement("article");
                        article.innerHTML = `
                            <h3>${title}</h3>
                            <img src="${imageUrl}" alt="${title}" />
                            <p>Näytöksen aika: ${new Date(showTime).toLocaleString()}</p>
                        `;
                        moviesSection.appendChild(article);
                    }
                }
            })
            .catch(error => console.error("Virhe elokuvien haussa:", error));
    }
});
