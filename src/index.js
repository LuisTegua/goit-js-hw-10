import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const search = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const txt = (e) => {
  countriesList.innerHTML = "";
  countryInfo.innerHTML = "";
  let country = e.target.value.trim();
  if (country != "") {
    fetchCountries(country)
      .then((countries) => {
        console.log(countries.length, countries);
        if (countries.length == 1) CountryInfo(countries[0]);
        else if (countries.length <= 10) CountriesList(countries);
        else Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      })
      .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
  }
}

function CountriesList(countries) {
  let list = "";
  countries.forEach(country =>
    list += `<li class="countries__item">
              <img class="countries__img" src="${country.flags.svg}">
              <p class="countries__txt">${country.name.official}</p>
            </li>`
  );
  countriesList.innerHTML = list;
}

function CountryInfo(country) {
  countryInfo.innerHTML = `<div class="countries__item">
                            <img class="country__img" src="${country.flags.svg}">
                            <p class="country__name">${country.name.official}</p>
                          </div>
                           <ul class="list">
                            <li><p><b>Capital: </b>${country.capital}</p></li>
                            <li><p><b>Population: </b>${country.population}</p></li>
                            <li><p><b>Languajes: </b>${Object.values(country.languages)}</p></li>
                          </ul>`;
}

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

search.addEventListener('input', debounce(txt, DEBOUNCE_DELAY));

