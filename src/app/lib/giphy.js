const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const BASE_URL = 'https://api.giphy.com/v1/gifs/search';

export const searchGifs = async (query, offset = 0) => {
  try {
    const res = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${query}&limit=9&offset=${offset}`);
    const data = await res.json();
    return data.data; // Возвращает массив GIFs
  } catch (error) {
    console.error('Error fetching GIFs:', error);
    return [];
  }
};
