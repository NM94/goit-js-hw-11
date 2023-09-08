import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const elements = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
  lightbox: new SimpleLightbox('.gallery a')
}
let search;
let numPage = 1;
let reLoad = true;


elements.form.addEventListener('submit', handlerForm)

function handlerForm(evt) {
  evt.preventDefault()
  if (search === elements.input.value) {
    numPage += 1
    reLoad = false;
  } else {
    elements.gallery.innerHTML = '';
    search = elements.input.value;
    numPage = 1
    reLoad = true;
  }
  searchCard()
}


function searchCard() {
servicePicture()
 .then(resp => {
 if(resp.data.total === 0) {
Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
 } else {
if(reLoad) {
 Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`)
 }
if(resp.data.hits.length < 40) {
 console.log(resp.data.hits.length)
 elements.btnLoad.style.display = 'none'
 } else {
 elements.btnLoad.style.display = 'inline'
 }
 createMarkup(resp.data)
                
 }
 })
.catch(error => {
 console.log(error)
 Notiflix.Notify.warning('Oops! Something went wrong! Try reloading the page!')
 })
}


async function servicePicture(){
const API_KEY = '39225038-2ac54e14fe4534aeff5d9228c'
  const BASE_URL = 'https://pixabay.com/api/';
  
  const params = new URLSearchParams({
    key: API_KEY,
    q: search,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: numPage,
    per_page: 40
  })
  
    const response = await axios.get(`${BASE_URL}?${params}`);
  console.log(response)
  return response
}




const defaults = {
image: 'https://static.thenounproject.com/png/2616533-200.png'
}
function createMarkup(arr) {
  console.log(arr)
  const markup = arr.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<a class="gallery__link" href="${largeImageURL}" data-alt="${tags}">
    <div class="photo-card">
  <img class="gallery__image" src="${webformatURL || defaults.image}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`})
    .join("");
  elements.gallery.insertAdjacentHTML('beforeend', markup);
   elements.lightbox.refresh()
}

elements.btnLoad.addEventListener('click', function() {
    numPage += 1
    reLoad = false
    searchCard()
})