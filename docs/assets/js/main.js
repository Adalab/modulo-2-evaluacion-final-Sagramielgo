"use strict";const formElement=document.querySelector(".js-form"),searchBtnElement=document.querySelector(".js-searchButton"),showsContainerElement=document.querySelector(".js-showsContainer"),inputElement=document.querySelector(".js-input");let series=[];function getDataFromApi(){const e=inputElement.value;fetch("http://api.tvmaze.com/search/shows?q="+e).then(e=>e.json()).then(e=>{for(let s=0;s<e.length;s++){const t=e[s].show;series.push(t)}paintSeries()})}function handleForm(e){e.preventDefault()}function paintSeries(){let e="";for(const s of series)isValidSerie(s)&&(e+='<li class="seriesCard">');for(let s=0;s<series.length;s++){const{name:t,id:n,image:i}=series[s];e+='<li class="seriesCard js-seriesCard">',e+=`<article id="${n}">`,e+=`<h3 class="seriesTitle js-seriesTitle">${t}</h3>`,e+='<div class="imgContainer">',e+=i?`<img src="${i.medium}" class="seriesImage js-seriesImage" alt="${t}" /></a></div>`:`<img src="https://via.placeholder.com/210x295/add8e6/000ff0/?text=${t}" class="seriesImage js-seriesImage" alt="${t}" /></a></div>`,e+="</article>",e+="</li>"}showsContainerElement.innerHTML=e,listenSerieEvents()}function isValidSerie(e){return e.name.includes(inputElement.value)}function listenSerieEvents(){const e=document.querySelectorAll(".js-seriesCard");for(const s of e)s.addEventListener("click",handleSerie)}function handleSerie(e){console.log("me han clikado",e.currentTarge)}function handleInputSearch(){series=[],getDataFromApi(),paintSeries()}formElement.addEventListener("submit",handleForm),searchBtnElement.addEventListener("click",handleInputSearch);