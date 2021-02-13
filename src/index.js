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
const localTemp = localStorage.getItem("isFarengeit")
let info = isRu ? LanguageRU : LanguageEN;
let weather;
let latitudeNow;
let longitudeNow;
let isFarengeit = localTemp === "true";

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

function activeButtonTemp(buttonFarenheit, buttonCelsius) {
    buttonFarenheit.classList.remove("active");
    buttonCelsius.classList.add("active");
    localStorage.setItem("isFarengeit", isFarengeit);
    const city = localStorage.getItem("city");
    const lang = localStorage.getItem("lang");
    showSearchCity(city, lang);
};

function TempButton() {
    if (isFarengeit) {
        buttonFarenheit.classList.add("active");
        buttonCelsius.classList.remove("active");
    }
};
TempButton();

// button click C of F
function Celsius() {
    isFarengeit = false;
    activeButtonTemp(buttonCelsius, buttonFarenheit);
};

function Farenheit() {
    isFarengeit = true;
    activeButtonTemp(buttonFarenheit, buttonCelsius);
};


function getAdress(latitudeNow, longitudeNow) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?&q=${latitudeNow}+${longitudeNow}&key=7ec9383669c44f36be73334edd48f8b1`)
        .then((response) => response.json());
};

async function showAdress(latitudeNow, longitudeNow) {
    try {
        adress = await getAdress(latitudeNow, longitudeNow);
        const locations = adress.results[0].components;
        const city = locations.city;
        const { country } = locations;
        locationCity.textContent = `${city}, ${country}`;
        showWeatherNow(city);
    } catch (error) {
        console.log(error);
    }
};

function searchCity(city, lang) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${lang}&key=7ec9383669c44f36be73334edd48f8b1`)
        .then((response) => response.json());
};
// &id=${id}
async function showSearchCity(city, lang) {
    try {
        if (!city) {
            city = inputCity.value;
        }
        const adress = await searchCity(city, lang);

        if (adress) {

            const result = adress.results[0].components;
            const city = result.city ? result.city : result.town ? result.town : result.village;

            const { country } = result;
            locationCity.textContent = `${city}, ${country}`;

            const zyk = adress.results[0].geometry;
            const LatitudeNow = zyk.lat.toFixed(2); //show lat and lng formats a number using fixed-point notation 
            const LongitudeNow = zyk.lng.toFixed(2);

            getCoordinats(LatitudeNow, LongitudeNow);
            showWeatherNow(city, lang);
            getMap(LatitudeNow, LongitudeNow);

        }
    } catch (error) {
        console.log(error);
    }
};

const getWeatherLatLong = async (latitudeNow, longitudeNow) =>
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeNow}&lon=${longitudeNow}&units=metric&appid=c3ee163c21d694ddab64849983b70180`)
        .then((response) => response.json());

async function showWeatherLatLong(LatitudeNow, LongitudeNow) {
    try {
        weather = await getWeatherLatLong(LatitudeNow, LongitudeNow);
        const city = `${weather.city.name}`;
        showSearchCity(city);
    } catch (error) {
        console.log(error);
    }
};

const getWeatherNow = async (city, lang) =>
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=metric&appid=c3ee163c21d694ddab64849983b70180`)
        .then((response) => response.json());

async function showWeatherNow(city, lang) {

    try {
        weather = await getWeatherNow(city, lang);
        const data = weather.list;
        const feelLike = data[0].main.feels_like;
        const temporaryNow = Math.round(data[0].main.temp);
        const firstTemporary = data[8].main.temp;
        const secTemporary = data[16].main.temp;
        const thirdTemporary = data[24].main.temp;

        // value Farengeit or celsius
        tempretureNow.textContent = isFarengeit ? `${Math.round(temporaryNow * (9 / 5) + 32)}°` : `${temporaryNow}°`;
        firstTemperature.textContent = isFarengeit ? `${Math.round(firstTemporary * (9 / 5) + 32)}°` : `${Math.round(firstTemporary)}°`;
        secondTemperature.textContent = isFarengeit ? `${Math.round(secTemporary * (9 / 5) + 32)}°` : `${Math.round(secTemporary)}°`;
        thirdTemperature.textContent = isFarengeit ? `${Math.round(thirdTemporary * (9 / 5) + 32)}°` : `${Math.round(thirdTemporary)}°`;

        overcast.textContent = data[0].weather[0].description;

        feelsLike.textContent = isFarengeit ? `${info.summary.feels} ${`${Math.round(feelLike * (9 / 5) + 32)}°`}` : `${info.summary.feels} ${`${Math.round(feelLike)}°`}`;
        humidity.textContent = `${info.summary.humidity} ${data[0].main.humidity}%`;
        speedWind.textContent = `${info.summary.wind} ${data[0].wind.speed.toFixed()} ${info.summary.speed}`;

        // img of the current weather
        iconWeatherNow.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png)`;
        iconOne.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[8].weather[0].icon}@2x.png)`;
        iconTwo.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[16].weather[0].icon}@2x.png)`;
        iconThree.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[24].weather[0].icon}@2x.png)`;

        showTime();
    } catch (error) {
        console.log(error);
    }
};

function showTime() {
    const now = new Date();
    const currentTimeZoneOffsetInHours = now.getTimezoneOffset() * 60000;
    const localTime = now.getTime() + currentTimeZoneOffsetInHours + weather.city.timezone * 1000;
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

    setTimeout(showTime, 1000);
};

function addZero(n) {
    return (Number.parseInt(n, 10) < 10 ? "0" : "") + n;
};

function showMap(position) {
    latitudeNow = position.coords.latitude.toFixed(2);
    longitudeNow = position.coords.longitude.toFixed(2);
    getCoordinats(latitudeNow, longitudeNow);
    showAdress(latitudeNow, longitudeNow);
    showWeatherLatLong(latitudeNow, longitudeNow);
    getMap(latitudeNow, longitudeNow);
};

function noPosition() {
    const input = document.querySelector(".search_input");
    input.style.borderWidth = "3px";
    input.style.borderColor = "red";
    input.style.animation = "blink1 1s linear infinite";
};

function initMap() {
    navigator.geolocation.getCurrentPosition(showMap, noPosition);
};

// if the city is not found then displays a map with coordinates
function initializeCity() {
    const lang = isRu ? "ru" : "en";
    const city = localStorage.getItem('city');
    if (city) {
        showSearchCity(city, lang);
    } else {
        initMap();
    }
};

initializeCity();

function getCoordinats(latitudeNow, longitudeNow) {
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
        localStorage.setItem('city', city);
        const lang = localStorage.getItem("lang");
        showSearchCity(city, lang);
        getBackground()
    }
};

buttonSearch.onclick = function (e) {
    if (e.which == 1) {
        const city = inputCity.value;
        localStorage.setItem('city', city);
        const lang = localStorage.getItem("lang");
        showSearchCity(city, lang);
        getBackground()
    }
};

window.addEventListener("keypress", KeyBoard);
buttonRefresh.addEventListener("click", getBackground);
buttonEnglishlanguage.addEventListener("click", langEn);
buttonRussianLanguage.addEventListener("click", langRu);
buttonCelsius.addEventListener("click", Celsius);
buttonFarenheit.addEventListener("click", Farenheit);