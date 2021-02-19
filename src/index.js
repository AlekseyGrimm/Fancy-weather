import { LanguageEN } from "./En";
import { LanguageRU } from "./Ru";
import "./style.css";

const buttonRefresh = document.querySelector("#control_button");
const buttonFarenheit = document.querySelector("#farenheit");
const buttonCelsius = document.querySelector("#celsius");
const inputCity = document.querySelector(".search_input");
const buttonSearch = document.querySelector("#search_button");
const locationCity = document.querySelector("#location_city");
const dateNow = document.querySelector(".date_now");
const timeNow = document.querySelector(".time_now");
const tempretureNow = document.querySelector(".tempreture_now");
const latitude = document.querySelector(".latitude");
const longitude = document.querySelector(".longitude");
const body = document.querySelector("#body");
const overcast = document.querySelector("#overcast");
const feelsLike = document.querySelector("#feelsLike");
const speedWind = document.querySelector("#speedWind");
const humidity = document.querySelector("#humidity");
const iconWeatherNow = document.querySelector(".icon_weatherNow");
const iconOne = document.querySelector(".icon_one");
const iconTwo = document.querySelector(".icon_two");
const iconThree = document.querySelector(".icon_three");
const firstDay = document.querySelector("#firstDay");
const secondDay = document.querySelector("#secondDay");
const thirdDay = document.querySelector("#thirdDay");
const firstTemperature = document.querySelector("#firstTemperature");
const secondTemperature = document.querySelector("#secondTemperature");
const thirdTemperature = document.querySelector("#thirdTemperature");
const buttonRussianLanguage = document.querySelector("#language_ru");
const buttonEnglishlanguage = document.querySelector("#language_en");
const localLang = localStorage.getItem("lang");
const isRu = localLang && localLang === "ru";
let info = isRu ? LanguageRU : LanguageEN;

// button Language RU and EH
function activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage) {
    buttonRussianLanguage.classList.add("active");
    buttonRussianLanguage.classList.remove("not_active");
    buttonEnglishlanguage.classList.remove("active");
    buttonEnglishlanguage.classList.add("not_active");
};

function initializeLangButton() {
    if (isRu) {
        activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage);
    }
};
initializeLangButton();

function changeLocalLang() {
    const lang = localStorage.getItem("lang");
    const city = localStorage.getItem("city");
    showSearchCity(city, lang);
};

function langRu() {
    const lang = 'ru';
    localStorage.setItem("lang", lang);
    info = LanguageRU;
    activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage);
    changeLocalLang(lang);
};

function langEn() {
    const lang = 'en';
    localStorage.setItem("lang", lang);
    info = LanguageEN;
    activeButtonLang(buttonEnglishlanguage, buttonRussianLanguage);
    changeLocalLang(lang);
};

function setFarenheit(isFahrenheit) {
    const buttonCelsius = document.getElementById('celsius');
    const buttonFarenheit = document.getElementById('farenheit');
    localStorage.setItem("isFahrenheit", isFahrenheit);
    const lang = localStorage.getItem("lang");
    const city = localStorage.getItem("city");
    showSearchCity(city, lang);
    if (isFahrenheit) {
        buttonFarenheit.classList.add('active');
        buttonCelsius.classList.remove('active');
    } else {
        buttonFarenheit.classList.remove('active');
        buttonCelsius.classList.add('active');
    }
};

function getAdress(latitudeNow, longitudeNow) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?&q=${latitudeNow}+${longitudeNow}&key=7ec9383669c44f36be73334edd48f8b1`)
        .then((response) => response.json());
};

async function showAdress(latitudeNow, longitudeNow) {
    try {
        const adress = await getAdress(latitudeNow, longitudeNow);
        const locations = adress.results[0].components;
        const city = locations.city;
        const { country } = locations;
        locationCity.textContent = `${city}, ${country}`;
        const lang = localStorage.getItem('lang');
        showSearchCity(city, lang)
    } catch (error) {
        console.log(error);
    }
};

function getAdressByCity(city, lang) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${lang}&key=7ec9383669c44f36be73334edd48f8b1`)
        .then((response) => response.json());
};

async function showSearchCity(city, lang) {
    try {
        if (!city) {
            city = inputCity.value;
        }
        const adress = await getAdressByCity(city, lang);

        if (adress) {

            const result = adress.results[0].components;
            const city = result.city ? result.city : result.town ? result.town : result.village;
            localStorage.setItem('city', city);

            const { country } = result;
            locationCity.textContent = `${city}, ${country}`;

            const geometry = adress.results[0].geometry;
            const LatitudeNow = geometry.lat.toFixed(2); //show lat and lng formats a number using fixed-point notation 
            const LongitudeNow = geometry.lng.toFixed(2);
            const isFahrenheit = localStorage.getItem('isFahrenheit');
            const units = isFahrenheit ? 'imperial' : 'metric';
            console.log(isFahrenheit);

            showCoordinats(LatitudeNow, LongitudeNow);
            showWeatherNow(city, lang, units);
            getMap(LatitudeNow, LongitudeNow);

        }
    } catch (error) {
        console.log(error);
    }
};

const getWeatherNow = async (city, lang, units) =>
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=${units}&appid=c3ee163c21d694ddab64849983b70180`)
        .then((response) => response.json());

async function showWeatherNow(city, lang, units) {

    try {
        console.log('showWeatherNow units', units);
        const weather = await getWeatherNow(city, lang, units);
        const data = weather.list;
        const feelLike = data[0].main.feels_like;
        const temporaryNow = Math.round(data[0].main.temp);
        const firstTemporary = data[8].main.temp;
        const secTemporary = data[16].main.temp;
        const thirdTemporary = data[24].main.temp;
        const timezone = weather.city.timezone;

        tempretureNow.textContent = `${temporaryNow}°`;
        firstTemperature.textContent = `${Math.round(firstTemporary)}°`;
        secondTemperature.textContent =`${Math.round(secTemporary)}°`;
        thirdTemperature.textContent = `${Math.round(thirdTemporary)}°`;

        overcast.textContent = data[0].weather[0].description;

        feelsLike.textContent = `${info.summary.feels} ${`${Math.round(feelLike)}°`}`;
        humidity.textContent = `${info.summary.humidity} ${data[0].main.humidity}%`;
        speedWind.textContent = `${info.summary.wind} ${data[0].wind.speed.toFixed()} ${info.summary.speed}`;

        // img of the current weather
        iconWeatherNow.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png)`;
        iconOne.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[8].weather[0].icon}@2x.png)`;
        iconTwo.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[16].weather[0].icon}@2x.png)`;
        iconThree.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[24].weather[0].icon}@2x.png)`;

        showTime(timezone);
    } catch (error) {
        console.log(error);
    }
};

function showTime(timezone) {
    const now = new Date();
    const currentTimeZoneOffsetInHours = now.getTimezoneOffset() * 60000;
    const localTime = now.getTime() + currentTimeZoneOffsetInHours + timezone * 1000;
    const today = new Date(localTime);
    const hour = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    timeNow.textContent = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
    let dayofWeek = today.getDay();
    const dayNumber = today.getDate();
    const month = today.getMonth();
    dateNow.textContent = `${info.dayOfWeekAbbreviated[dayofWeek]} ${dayNumber} ${info.months[month]}`;
    dayofWeek++;

    if (dayofWeek > 6) {
        dayofWeek = 0;
        firstDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }

    firstDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    dayofWeek++;

    if (dayofWeek > 6) {
        dayofWeek = 0;
        secondDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }

    secondDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    dayofWeek++;

    if (dayofWeek > 6) {
        dayofWeek = 0;
        thirdDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }

    thirdDay.textContent = `${info.dayOfWeek[dayofWeek]}`;

    // setTimeout(showTime, 1000);
};

function addZero(n) {
    return (Number.parseInt(n, 10) < 10 ? "0" : "") + n;
};

function showMap(position) {
    const latitudeNow = position.coords.latitude.toFixed(2);
    const longitudeNow = position.coords.longitude.toFixed(2);
    showCoordinats(latitudeNow, longitudeNow);
    showAdress(latitudeNow, longitudeNow);
    getMap(latitudeNow, longitudeNow);
};

function noPosition() {
    const city = 'Minsk';
    localStorage.setItem("city", city);
    initializeCity();
};

function initMap() {
    navigator.geolocation.getCurrentPosition(showMap, noPosition);
};

// if the city is not found then displays a map with coordinates
function initializeCity() {
    const isFahrenheit = localStorage.getItem('isFahrenheit') || false;
    const units = isFahrenheit ? 'imperial' : 'metric';
    const lang = localStorage.getItem("lang") || 'ru';
    const city = localStorage.getItem('city');
    if (city) {
        showSearchCity(city, lang, units);
    } else {
        initMap();
    }
};

initializeCity();

function showCoordinats(latitudeNow, longitudeNow) { // переименовать show
    const lat = String(latitudeNow).split(".");
    const lon = String(longitudeNow).split(".");
    const latMinutes = lat[0];
    const latSeconds = lat[1];
    const lonMinutes = lon[0];
    const lonSeconds = lon[1];

    latitude.textContent = `${info.positions.latit} ${latMinutes}°  ${latSeconds}'`;
    longitude.textContent = `${info.positions.longit} ${lonMinutes}°  ${lonSeconds}'`;
    buttonSearch.textContent = `${info.search.but}`;
    inputCity.placeholder = `${info.search.input}`;
};

function getMap(latitudeNow, longitudeNow) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhbHBldGMiLCJhIjoiY2trNWFqNmU4MDlhaDJvbGtocjlnN2s1ZiJ9.aDls4v3wiKMmvUBS76whKQ';
    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [longitudeNow, latitudeNow], // starting position [lng, lat]
        zoom: 10 // starting zoom
    });
    const marker = new mapboxgl.Marker()
        .setLngLat([longitudeNow, latitudeNow])
        .addTo(map);
};

async function getLinkToImage() {
    const url = 'https://api.unsplash.com/photos/random?query=morning&client_id=njpPeASTxZr7ZpJtq-JokPEQFvKKFLwCXKqboncAt0Y';
    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular;
};

async function getBackground() {
    try {
        const backgroundLink = await getLinkToImage();
        body.style.backgroundImage = `url(${backgroundLink})`;
        body.style.transition = "1s";
    } catch (error) {
        console.log(error);
    }
};

// add inter
function KeyBoard(e) {
    if (e.which === 13) {
        const city = inputCity.value;
        const lang = localStorage.getItem("lang");
        showSearchCity(city, lang);
        getBackground()
    }
};

buttonSearch.onclick = function (e) { //mouse click
    if (e.which == 1) {
        const city = inputCity.value;
        const lang = localStorage.getItem("lang");
        showSearchCity(city, lang);
        getBackground()
    }
};

window.addEventListener("keypress", KeyBoard);
buttonRefresh.addEventListener("click", getBackground);
buttonEnglishlanguage.addEventListener("click", langEn);
buttonRussianLanguage.addEventListener("click", langRu);
buttonFarenheit.addEventListener("click", () => setFarenheit(true));
buttonCelsius.addEventListener("click", () => setFarenheit(false));