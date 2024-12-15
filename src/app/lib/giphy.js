const API_KEY = 'gGVnZ0iRcanJZdXIMJPw5961wMnCZzYO';
const BASE_URL = 'https://api.giphy.com/v1/gifs/search';

export const searchGifs = async (query) => {
  const res = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`);
  const data = await res.json();
  return data.data;
};
