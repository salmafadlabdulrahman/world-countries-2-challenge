let countriesNum = document.querySelector(".countriesNumber");
let filteredCountriesNum = document.querySelector(".filteredCountriesNum");
let countriesWrapper = document.querySelector(".wrapper");
let search = document.querySelector(".search");
let buttons = document.querySelectorAll("button");
let chart = document.querySelector(".a-tag");
let sortBtn = document.querySelector(".sort-names");
let sortCapital = document.querySelector(".sort-capital");
let sortPop = document.querySelector(".sort-population");
let countriesList = document.createElement("ul");
let chartContainer = document.querySelector(".chart-container");

countriesList.classList.add("countries-list");

//Displaying the number of countries
countriesNum.textContent = `Currently, we have ${countries.length} countries`;

//Rendering the countries
function renderCountries(arr) {
  countriesList.innerHTML = ``;
  for (let i = 0; i < arr.length; i++) {
    let country = document.createElement("div");
    country.classList.add("country");

    country.innerHTML = `
              <img src="${arr[i].flag}" class="flag"></img>
              <p class="country-name">${arr[i].name}</p>
              <div class="info">
              <p class="capital">Capital: ${arr[i].capital}</p>
              <p class="language">Language: ${arr[i].languages}</p>
              <p class="population">Population: ${arr[i].population}</p>
              </div>
              
          `;
    let capital = country.querySelector(".capital");
    if (arr[i].capital === undefined) {
      capital.classList.add("none");
    }

    countriesList.appendChild(country);
  }
  countriesWrapper.appendChild(countriesList);
}



let myChart = null;
function renderGraph(keysArr, valuesArr) {
  if (myChart) {
    myChart.destroy();
  }
  let ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: keysArr,
      datasets: [
        {
          label: "",
          data: valuesArr,
          backgroundColor: "#f2a71b",
          borderWidth: 1,
        },
      ],
    },

    options: {
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              weight: "600",
              size: "15",
            },
          },
        },
        y: {
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            beginAtZero: true,

            font: {
              weight: "400",
              size: "15",
            },
          },
        },
      },
      indexAxis: "y",
    },
  });
}

window.addEventListener("load", function () {
  renderCountries(countries);
  renderGraph(keys, values);
});

//Sorting by the capital
sortCapital.addEventListener("click", function () {
  countries.sort((a, b) =>
    a.capital === undefined
      ? -1
      : a.capital < b.capital
      ? -1
      : a.capital > b.capital
      ? 1
      : 0
  );
  renderCountries(countries);
});


//Sorting the countries by population
sortPop.addEventListener("click", function () {
  countries.sort((a, b) => a.population - b.population);

  renderCountries(countries);
});

//Check which button we're clicking on
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    buttons.forEach((btn) => {
      btn.innerHTML = btn.textContent;
    });
    this.innerHTML = `${this.textContent} <i class="fa-solid fa-arrow-down-long arrow-icon-down">`;
  });
});

//Sorting the countries by name
sortBtn.addEventListener("click", function () {
  if (countries[0].name < countries[countries.length - 1].name) {
    countries.sort((a, b) => b.name.localeCompare(a.name));
    sortBtn.innerHTML = `${sortBtn.textContent} <i class="fa-solid fa-arrow-up-long arrow-up"></i>`;
    renderCountries(countries);
  } else {
    countries.sort((a, b) => a.name.localeCompare(b.name));
    sortBtn.innerHTML = `${sortBtn.textContent} <i class="fa-solid fa-arrow-down-long arrow-icon-down"></i>`;
    renderCountries(countries);
  }
});



//Getting the 10 most populated countries in the world
let worldNum = [];
let population = [];

for (let i = 0; i < countries.length; i++) {
  worldNum.push(countries[i].population);
  population.push({ [countries[i].name]: countries[i].population });
}

let sum = 0;
let worldSum = worldNum.map((country) => (sum += country));

population.unshift({ World: sum });

let theMostPop = population
  .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  .slice(0, 11);

const keys = theMostPop.map((obj) => Object.keys(obj)[0]);
const values = theMostPop.map((obj) => Object.values(obj)[0]);

//Data visualization
function scrollToSection(sectionId) {
  const sectionOffsetTop = chartContainer.offsetTop;
  const scrollPosition = sectionOffsetTop - 50;
  document.documentElement.scrollTop = scrollPosition;
}

//Scroll to the graph at bottom of the page
chart.addEventListener("click", function () {
  scrollToSection(chartContainer);
});


//Detect any changes related to the input field
search.addEventListener("input", function () {
  let value = search.value;
  let filteredCountries = countries.filter(
    (country) =>
      country.name.toUpperCase().includes(value.toUpperCase()) ||
      (country.capital &&
        country.capital.toUpperCase().includes(value.toUpperCase())) ||
      country.languages.some((language) =>
        language.toUpperCase().includes(value.toUpperCase())
      )
  );

  filteredCountriesNum.textContent = `${filteredCountries.length} countries satisfied the search criteria`
  let filterArr = [];
  filteredCountries.map((country) =>
    filterArr.push({ [country.name]: country.population })
  );
  filterArr.unshift({ World: sum });

  const keys2 = filterArr.map((obj) => Object.keys(obj)[0]);
  const values2 = filterArr.map((obj) => Object.values(obj)[0]);

  renderCountries(filteredCountries);

  renderGraph(keys2, values2);

  if (value === "") {
    renderGraph(keys, values);
    filteredCountriesNum.textContent = ``
  }

  sortCapital.addEventListener("click", function () {
    filteredCountries.sort((a, b) =>
      a.capital < b.capital ? -1 : a.capital > b.capital ? 1 : 0
    );
    renderCountries(filteredCountries);
  });

  sortPop.addEventListener("click", function () {
    filteredCountries.sort((a, b) =>
      a.population < b.population ? -1 : a.population > b.population ? 1 : 0
    );
    renderCountries(filteredCountries);
  });
});
