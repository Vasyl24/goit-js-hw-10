import './css/styles.css';
import { fetchCountries } from '/src/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const countryName = input.value.trim();
  if (countryName) {
    fetchCountries(countryName)
      .then(countries => {
        if (countries.length > 10) {
          countryList.innerHTML = '';
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length > 2 && countries.length <= 10) {
          getCountries(countries);
          countryInfo.innerHTML = '';
        } else {
          countryList.innerHTML = '';
          getCountryInfo(countries);
        }
      })
      .catch(err => {
        Notify.failure('Oops, there is no country with that name');
        return err;
      });
  }
}

function getCountries(countries) {
  const markup = countries
    .map(country => {
      return `<li class='countries-list-js'>
            <div class='country-js'>
            <img src='${country.flags.png}' alt='${country.flags.alt}' width='30'></img>
            <h3>${country.name.common}</h3>
            </div>
          </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function getCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<li class='countries-list-js'>
            <div class='country-js'>
            <img src='${country.flags.png}' alt='${
        country.flags.alt
      }' width='30'></img>
            <h3>${country.name.official}</h3>
            </div>
            <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${Object.values(country.languages)}</p>
          </li>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
