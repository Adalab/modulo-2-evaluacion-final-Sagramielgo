'use strict';

/* DIAGRAMA 
1. Arrancar la página. OK
   1.1 Coger datos del api con un Fetch OK
   1.2 EVENTO: Escuchar botón de búsqueda con el contenido del value.OK
   1.3 PINTAR las series OK

2. FILTRAR: recoger el valor del input y filtrar las series OK
   2.1 PINTAR series OK
   2.2 ESCUCHAR eventos en las series (al clickar en ellas que cambien de color, o algún cambio) OK
 
 3. EVENTO: clicar en una de las series y:OK
   3.1 Marcar o desmarcar dicha serie de una sección de "favoritas" en los datosOK
   3.2 PINTAR de nuevo las seriesOK

   4. Meter en un array las favoritasOK
   4.1 Pintar el array de favoritas en la izq de la pantalla (section, div, aside?)OK
   4.2 Guardar favoritas en localSorage OK
   4.3 add css

   BONUS:
    5. Escuchar botón borrar cada serie de favoritos
    5.1 botón borrar todos los favoritos
*/
const formElement = document.querySelector('.js-form');
const searchBtnElement = document.querySelector('.js-searchButton');
const showsContainerElement = document.querySelector('.js-showsContainer');
const inputElement = document.querySelector('.js-input');
const favoritesBoxElement = document.querySelector('.js-favoritesContainer');
let favorites = [];
/* favorites = favoritesBoxElement.innerHTML; */

// variable de los datos que me devuelve el api
let series = [];

//CREAR función y meter api dentro
function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    //for para saltarnos el 'score' y que data nos devuelva directamente 'show'
    .then((data) => {
      series = [];
      for (let index = 0; index < data.length; index++) {
        const showList = data[index].show;
        series.push(showList);
      }
      paintSeries();
    });
}

// evitar que envíe el input por defecto
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

//filtrar input
function handleFilter() {
  getFromLocalStorage();
  paintFavorites();
  getDataFromApi();
  paintSeries();
}
inputElement.addEventListener('keyup', handleFilter);

//PINTAR busqueda de API en HTML
function paintSeries() {
  //imagen por defecto
  const placeholderImg =
    'https://via.placeholder.com/210x295/464686/ffffff/?text=';

  let codeHTML = '';
  let isFavoriteClass;
  for (let index = 0; index < series.length; index++) {
    const { name, id, image } = series[index];

    if (isFavoriteSerie(series[index])) {
      isFavoriteClass = 'series--favorite';
    } else {
      isFavoriteClass = '';
    }
    codeHTML += `<li class="seriesCard js-seriesCard ${isFavoriteClass}" id="${id}">`;
    codeHTML += `<article class="showCard js-showCard">`;
    codeHTML += `<h3 class="seriesTitle js-seriesTitle">${name}</h3>`;
    codeHTML += `<div class="imgContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}${name}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }
  showsContainerElement.innerHTML = codeHTML;
  listenSerieEvents();
}

//PINTAR array favorites en HTML
function paintFavorites() {
  //imagen por defecto
  const placeholderImg =
    'https://via.placeholder.com/210x295/464686/ffffff/?text=';

  let codeHTML = '';
  for (let index = 0; index < favorites.length; index++) {
    /* const id = series[index].id;
    const name = series[index].name;
    const image = series[index].image; */
    const { name, id, image } = favorites[index];
    codeHTML += `<li class="seriesCard js-seriesCard" id="${id}">`;
    codeHTML += `<article class="showCard js-showCard">`;
    codeHTML += `<h3 class="seriesTitle js-seriesTitle">${name}</h3>`;
    codeHTML += `<div class="imgContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}${name}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }

  favoritesBoxElement.innerHTML = codeHTML;
  listenSerieEvents();
}

//Devuelve serie seleccionada como favorita
function isFavoriteSerie(serie) {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.id === serie.id;
  });

  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}
//guardar en localStorage
function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem('favorites', stringFavorites);
}

//// recuperar data del localSt y si no llamar al api
function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem('favorites');
  if (localStorageFavorites === null) {
    getDataFromApi();
  } else {
    //función para convertir el localStorage en array
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    /*   console.log(palettes); */
  }
}

//LISTEN serie Events
function listenSerieEvents() {
  setInLocalStorage();
  getFromLocalStorage();
  const seriesElements = document.querySelectorAll('.js-seriesCard');
  for (const seriesElement of seriesElements) {
    seriesElement.addEventListener('click', handleSerie);
  }
}

//Función que devuelve el id de la serie clikada
function handleSerie(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id);

  console.log('me han clikado', clickedSerieId);
  const serieFound = series.find(function (serie) {
    return serie.id === clickedSerieId;
  });

  const favoriteFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });

  //para que no la suba por duplicado al array de favorites
  if (favoriteFoundIndex === -1) {
    favorites.push(serieFound);
    //para que la quite si ya está en el array de favorites
  } else {
    favorites.splice(favoriteFoundIndex, 1);
  }
  console.log(favorites);
  paintFavorites();
}

/* setInLocalStorage();
getFromLocalStorage(); */

// EVENTO click al botón de buscar
function handleInputSearch() {
  series = [];
  getFromLocalStorage();
  paintFavorites();
  getDataFromApi();
  paintSeries();
}
searchBtnElement.addEventListener('click', handleInputSearch);
