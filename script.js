// suoritetaan kus sivu on ladattu kokonaan
document.addEventListener("DOMContentLoaded", () => {
    const theaterSelect = document.getElementById("theaterSelect"); // teatterivalikko
    const searchButton = document.getElementById("searchButton"); // hakupainike

    loadTheaters();

    searchButton.addEventListener("click", () => {
        const selectedTheater = theaterSelect.value; // haetaan valittu teatteri
        if (selectedTheater) {
            loadMovies(selectedTheater); // haetaan elokuvat valitusta teatterista
        }
    });

    // funktio teatteritietojen lataamiseen
    async function loadTheaters() {
        try {
            // tehdään pyyntö Finnkino API:in teatterialueiden tiedoista
            const response = await fetch("http://www.finnkino.fi/xml/TheatreAreas/");
            const data = await response.text(); // haetaan vastaus tekstimuodossa
            const parser = new DOMParser(); // luodaan uusi DOMParser XML-datan jäsentämiseen
            const xmlDoc = parser.parseFromString(data, "text/xml"); // muutetaan teksti XML-muotoon

            // etsitään kaikki TheatreArea-elementit XML-dokumentista
            const theaters = xmlDoc.getElementsByTagName("TheatreArea");
            for (const theater of theaters) {
                const id = theater.getElementsByTagName("ID")[0].textContent; // haetaan teatterin ID
                const name = theater.getElementsByTagName("Name")[0].textContent; // haetaan teatterin nimi

                const option = document.createElement("option");
                option.value = id; // asetetaan teatterin ID vaihtoehdon arvoksi
                option.textContent = name;
                theaterSelect.appendChild(option); // lisätään vaihtoehto valikkokenttään
            }
        } catch (error) {
            console.error("Virhe teattereiden lataamisessa:", error); // virheilmoitus
        }
    }

    // funktio elokuvatietojen lataamiseen valitusta teatterista
    async function loadMovies(theaterId) {
        try {
            const response = await fetch(`http://www.finnkino.fi/xml/Schedule/?area=${theaterId}`);
            const data = await response.text(); 
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml"); 

            const shows = xmlDoc.getElementsByTagName("Show");
            const movieInfoContainer = document.getElementById("movieInfoContainer"); // valitaan mihin elokuvatiedot näytetään
            movieInfoContainer.innerHTML = "";

            for (const show of shows) {
                const title = show.getElementsByTagName("Title")[0].textContent; // haetaan elokuvan otsikko
                const img = show.getElementsByTagName("EventMediumImagePortrait")[0].textContent; // haetaan elokuvan kuva
                const showtime = show.getElementsByTagName("dttmShowStart")[0].textContent; // haetaan esitysaika

                // luodaan uusi div-elementti yksittäiselle elokuvalle
                const movieDiv = document.createElement("div");
                movieDiv.className = "movie"; // Asetetaan luokka elokuvan diville

                // lisätään elokuvan tiedot HTML-koodina
                movieDiv.innerHTML = `
                <h3>${title}</h3>
                <img src="${largeImage}" alt="${title}" class="large-image">
                <img src="${mediumImage}" alt="${title}" class="medium-image">
                <p>${description}</p>
                <p><strong>Esitysaika:</strong> ${new Date(showtime).toLocaleString()}</p>
            `;
            movieInfoContainer.appendChild(movieDiv);
            }
        } catch (error) {
            console.error("Virhe elokuvien lataamisessa:", error); // virheilmoitus, jos pyyntö epäonnistuu
        }
    }
});
