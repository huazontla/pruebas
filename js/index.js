// EstA es una manera de que una funcion se ejecute sola
(function(){

var API_WEATHERTIME = "http://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WEATHERTIME_KEY + "&q=";
var API_WEATHERTIME_KEY = "ad4c5f8a265d380d8a41f301f905d";
  var API_WEATHER_KEY ="c39a7fe0bfa49aa6bd15a940dbc96f0c";
  var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
  var IMG_WEATHER = "http://openweathermap.org/img/w/";
  var tiempo = new Date();
  var actual = tiempo.toLocaleTimeString();

  var $body = $("body");
  var $loader = $(".loader");
  var nombreNuevaCiudad = $("[data-input='cityAdd']");
  var buttonAdd = $("[data-button='add']");
  var buttonLoader = $("[data-saved-cities]");

  var cities = [];
  var cityWeather = {};
  cityWeather.zone;
  cityWeather.icon;
  cityWeather.temp;
  cityWeather.temp_max;
  cityWeather.temp_min;
  cityWeather.main;

// con on() le decimos a jquery que evento va a escuchar, addNewCity es una funcion de callBack (asi le pusimos de nombre)
  $(buttonAdd).on("click", addNewCity);

  $(nombreNuevaCiudad).on("keypress", function(event) {
    if(event.which == 13){
      addNewCity(event);
    }
  });

  $(buttonLoader).on("click", loadSavedCities);

if(navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(getCoords, errorFound);

} else {
  alert("Por favor actualiza tu navegador");
}

  function errorFound(error) {
    alert("Un error ocurrio: " + error.code);
    // 0: el error es desconocido
    // 1: permiso denegado
    // 2: posicion no esta disponible
    // 3: time out
  }

  function getCoords(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Tu posicion es: " + lat + "," + lon);
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);


  }

  function getCurrentWeather(data) {
  cityWeather.zone = data.name;
  cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
  cityWeather.temp = data.main.temp - 273,15; //para que sea en centigrados
  cityWeather.temp_max = data.main.temp_max - 273,15;
  cityWeather.temp_min = data.main.temp_min - 273,15;
  cityWeather.main = data.weather[0].main;

  renderTemplate(cityWeather);
}
  // LLamar render
    function activateTemplate(id)
    {
      var t = document.querySelector(id);
      return document.importNode(t.content, true);

    

  }

  function renderTemplate(cityWeather) {


    var clone = activateTemplate("#template--city");
    var timeToShow;

    // if(localtime){
    //   timeToShow = localtime.split(" ")[1];
    // } else {
    //   timeToShow = actual;

    // }



    //clone.querySelector("[data-time]").innerHTML = ;
    clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
    // querySelector sirve para seleccionar elemento de la pplantilla virtual almacenada en clone
    clone.querySelector("[data-icon]").src = cityWeather.icon;
    clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
    clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
    clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
    //clone.querySelector("[data-time]").innerHTML = timeToShow;


    $( $loader ).hide();
// append es una funcion de Jquery
    $( $body ).append(clone);
  }

  function addNewCity(event) {
   // .preventDefault() le quita la funcion al boton submit 
   event.preventDefault();
   $.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity);

  }

  function getWeatherNewCity(data) {

    $(nombreNuevaCiudad).val("");

    // $.getJSON(API_WEATHERTIME + nombreNuevaCiudad.val(), function(respuesta) {
      cityWeather = {};
    cityWeather.zone = data.name;
    cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
    cityWeather.temp = data.main.temp - 273.15;
    cityWeather.temp_max = data.main.temp_max - 273.15;
    cityWeather.temp_min = data.main.temp_min - 273.15;


    renderTemplate(cityWeather);


    cities.push(cityWeather);

    localStorage.setItem("cities", JSON.stringify(cities));

    // , respuesta.data.time_zone[0].localtime
    //});
    
  // var naco = "esto jala bien";
  //  localStorage.setItem("pendejo", naco);
  // // localStorage["pend"]

  // console.log(localStorage.getItem("pendejo"));


  }

function loadSavedCities(event)
{
  event.preventDefault();

  function rederCities(cities) {
    cities.forEach(function(city){
      renderTemplate(city);
    })
  }

  var cities = JSON.parse(localStorage.getItem("cities"));
  rederCities(cities);

}  
  
  



})();