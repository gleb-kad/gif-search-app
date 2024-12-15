"use client";

import { useState, useEffect } from 'react';
import { searchGifs } from '../lib/giphy';

const GifSearch = () => {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (query.startsWith('/gif ') && query.length > 5) {
      const searchQuery = query.slice(5); // Убираем '/gif '
      searchGifs(searchQuery).then(setGifs);
      setIsActive(true);
    } else {
      setGifs([]);
      setIsActive(false);
    }
  }, [query]);

  const handleGifSelect = (gif) => {
    setSelectedGif(gif);
    setQuery('');
    setIsActive(false);
  };

  return (
    <div className="relative">
      {/* Выбранный GIF */}
      {selectedGif && (
        <div className="mb-4 text-center">
          <div className="border p-4 rounded-md shadow-lg bg-white">
            <img
              src={selectedGif.images.fixed_height.url}
              alt={selectedGif.title}
              className="w-full max-w-[300px] mx-auto rounded-lg mb-4"
            />
            <p className="text-lg font-semibold text-gray-700">{selectedGif.title}</p>
          </div>
        </div>
      )}

      {/* Поле ввода */}
      <input
        type="text"
        placeholder="Type /gif to search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-3 rounded-md w-full max-w-[400px] mx-auto text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Сетка GIF-ов */}
      {isActive && gifs.length > 0 && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg rounded-md max-h-64 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {gifs.map((gif) => (
              <div key={gif.id} className="group cursor-pointer" onClick={() => handleGifSelect(gif)}>
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  className="rounded-md group-hover:opacity-80 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GifSearch;
