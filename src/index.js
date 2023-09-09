import { servicePicture } from "./api_key";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let search;
let numPage = 1;
let reLoad = true;


const elements = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
  lightbox: new SimpleLightbox('.gallery a')
}



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
servicePicture(search)
 .then(resp => {
   if (resp.data.total === 0) {
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
     const totalHits = resp.data.totalHits;
      const totalPage = totalHits / 40;
      if (numPage > totalPage) {
        elements.btnLoad.style.display = 'none'
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
 createMarkup(resp.data)
                
 }
 })
.catch(error => {
 console.log(error)
 Notiflix.Notify.warning('Oops! Something went wrong! Try reloading the page!')
 })
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



