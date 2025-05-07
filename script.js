let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const suggestions = document.getElementById('country-suggestions');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}


let countryList = [];

function loadCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            countryList = data.map(c => c.name.common).sort();
        })
        .catch(error => console.error('Error loading countries:', error));
}

function setupCountryAutocomplete() {
    const input = document.getElementById('country');
    const suggestions = document.getElementById('country-suggestions');

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        suggestions.innerHTML = '';
        if (!query) {
            suggestions.style.display = 'none';
            return;
        }

        const matches = countryList.filter(c => c.toLowerCase().includes(query)).slice(0, 5); // top 5 matches

        if (matches.length === 0) {
            suggestions.style.display = 'none';
            return;
        }

        matches.forEach(country => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'list-group-item list-group-item-action';
            item.textContent = country;
            item.addEventListener('click', () => {
                input.value = country;
                suggestions.style.display = 'none';
                getCountryCode(country); // trigger code fetch after selection
            });
            suggestions.appendChild(item);
        });

        suggestions.style.display = 'block';
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!suggestions.contains(e.target) && e.target !== input) {
            suggestions.style.display = 'none';
        }
    });
}


function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;

            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes[0]; // just use first suffix for simplicity

            const countryCodeSelect = document.getElementById('countryCode');
            const options = Array.from(countryCodeSelect.options);

            const matchedOption = options.find(opt => opt.value === countryCode);
            if (matchedOption) {
                matchedOption.selected = true;
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const inputs = Array.from(form.querySelectorAll("input, select, textarea"));
    const modalBody = document.querySelector(".modal-body");

    // Show instruction popup (create it dynamically)
    const instructionPopup = document.createElement("div");
    instructionPopup.style.position = "fixed";
    instructionPopup.style.top = "50%";
    instructionPopup.style.left = "50%";
    instructionPopup.style.transform = "translate(-50%, -50%)";
    instructionPopup.style.backgroundColor = "#fff";
    instructionPopup.style.border = "1px solid #ccc";
    instructionPopup.style.padding = "20px";
    instructionPopup.style.zIndex = "1051";
    instructionPopup.style.display = "none";
    instructionPopup.innerHTML = `
        <h5>Instrukcja nawigacji:</h5>
        <ul>
            <li><strong>Enter</strong> — wyślij formularz</li>
            <li><strong>ALT + ?</strong> — pokaż instrukcję nawigacji</li>
            <li><strong>← / →</strong> — przejdź do poprzedniego/następnego pola</li>
            <li><strong>↑ / ↓</strong> — wybierz kolejną opcję (w polach typu radio)</li>
            <li><strong>ALT + R</strong> — zresetuj formularz</li>
        </ul>
        <button id="close-instruction" class="btn btn-secondary mt-2">Zamknij</button>
    `;
    document.body.appendChild(instructionPopup);

    document.getElementById("close-instruction").addEventListener("click", () => {
        instructionPopup.style.display = "none";
    });

    document.addEventListener("keydown", (e) => {
        const active = document.activeElement;
        const currentIndex = inputs.indexOf(active);

        switch (e.key) {
            case "Enter":
                if (active.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    form.requestSubmit();
                }
                break;

            case "?":
                if (e.altKey) {
                    e.preventDefault();
                    instructionPopup.style.display = "block";
                }
                break;

            case "ArrowRight":
            case "ArrowLeft": {
                e.preventDefault();
                let newIndex = 0;
                if (currentIndex >= 0) {
                    newIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
                }
                if (newIndex < 0) newIndex = inputs.length - 1;
                if (newIndex >= inputs.length) newIndex = 0;
                inputs[newIndex].focus();
                break;
            }

            case "r":
            case "R":
                if (e.altKey) {
                    e.preventDefault();
                    form.reset();
                }
                break;

            case "ArrowUp":
            case "ArrowDown":
                // Default behavior for radios is correct
                break;
        }
    });
});




window.addEventListener('DOMContentLoaded', () => {
	loadCountries();
    setupCountryAutocomplete();

    getCountryByIP();
});


(() => {
    document.addEventListener('click', handleClick);
})()
