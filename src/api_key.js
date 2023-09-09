import axios from "axios";

async function servicePicture(search,numPage) {
  const API_KEY = '39225038-2ac54e14fe4534aeff5d9228c';
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
  
  return response
}

export { servicePicture };