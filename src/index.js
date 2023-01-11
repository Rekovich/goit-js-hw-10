import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix, { Notify } from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
searchBox.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const countryName = e.target.value.trim();

  if (countryName === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countryName => {
      if (countryName.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (countryName.length <= 10 && countryName.length >= 2) {
        countryName.map(country =>
          countryList.insertAdjacentHTML(
            'beforeend',
            `<li class="country-list__item">
            <img
              class="country-list__flag"
              src="${country.flags.svg}"
              alt="${country.name.official}"
            />
            <p2 class="country-list__name">${country.name.official}</p2>
          </li>`
          )
        );
        countryInfo.innerHTML = '';
      } else if (countryName.length === 1) {
        countryName.map(
          country =>
            (countryInfo.innerHTML = `<li class="country-list__item">
                    <img
                      class="country-list__flag"
                      src="${country.flags.svg}"
                      alt="${country.name.official}"
                    />
                    <p2 class="country-list__name"><b>Country:</b> ${
                      country.name.official
                    }</p2>
                    <p2 class="country-list__capital"><b>Capital:</b> ${
                      country.capital
                    }</p2>
                    <p2 class="country-list__population"><b>Population:</b> ${
                      country.population
                    }</p2>
                    <p2 class="country-list__languages"><b>Languages:</b> ${Object.values(
                      country.languages
                    )}</p2>
                  </li>`)
        );
        countryList.innerHTML = '';
      } 
    //   console.log(countryName);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}
