"use client";

import React, { useState, useEffect } from "react";
import { searchGifs } from "../lib/giphy";

export default function GifSearch() {
  const [query, setQuery] = useState(""); // Запрос
  const [gifs, setGifs] = useState([]); // Гифки
  const [showResults, setShowResults] = useState(false); // Показывать ли результаты
  const [selectedGif, setSelectedGif] = useState(null); // Выбранная гифка
  const [offset, setOffset] = useState(0); // Смещение для пагинации
  const [loading, setLoading] = useState(false); // Состояние загрузки

  // Загрузка гифок при изменении запроса или смещения
  useEffect(() => {
    const fetchGifs = async () => {
      if (query.startsWith("/gif ")) {
        const searchTerm = query.slice(5);
        setLoading(true);

        // Загрузка гифок с учетом смещения
        const results = await searchGifs(searchTerm, offset);

        if (offset === 0) {
          // Если это первый запрос, очищаем старые гифки
          setGifs(results);
        } else {
          // Добавляем новые гифки к уже загруженным
          setGifs((prevGifs) => [...prevGifs, ...results]);
        }

        setLoading(false);
        setShowResults(true);
      } else {
        setShowResults(false);
        setGifs([]);
        setOffset(0); // Сброс смещения, если нет запроса
      }
    };

    fetchGifs();
  }, [query, offset]);

  // Обработчик клика по гифке
  const handleGifClick = (gif) => {
    setSelectedGif(gif);
  };

  // Обработчик кнопки "Показать больше"
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 9); // Увеличиваем смещение на 9
  };

  // При изменении запроса сбрасываем гифки и смещение
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setGifs([]); // Очищаем гифки при смене запроса
    setOffset(0); // Сбрасываем смещение
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 w-[600px] flex flex-col transition-all duration-500`}
      style={{
        height: selectedGif ? "700px" : showResults ? "400px" : "auto",
      }}
    >
      {/* Если выбрана гифка, отображаем её сверху */}
      {selectedGif && (
        <div className="mb-4 flex justify-center animate-slide-up relative">
          <img
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            className="rounded-md shadow-md w-[150px] h-auto"
          />
          <button
            onClick={() => setSelectedGif(null)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
          >
            ✕
          </button>
        </div>
      )}

      {selectedGif && <div className="border-b border-gray-300 mb-4"></div>}

      {/* Сетка GIF */}
      {showResults && (
        <div
          className="grid gap-2 overflow-y-auto flex-1"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gridAutoFlow: "row dense",
            justifyContent: "center",
            alignContent: "start",
          }}
        >
          {gifs.map((gif, index) => (
            <img
              key={`${gif.id}-${index}`} // Уникальные ключи
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className="rounded-md shadow-sm transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleGifClick(gif)}
              style={{
                maxWidth: "150px",
                height: "auto",
              }}
            />
          ))}
        </div>
      )}

      {/* Кнопка "Показать больше" */}
      {showResults && !loading && (
        <button
          onClick={handleShowMore}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Показать больше
        </button>
      )}

      {/* Если загрузка, показываем индикатор */}
      {loading && <p className="text-center mt-4">Загрузка...</p>}

      {/* Часть с поиском */}
      <div className="bg-pink-200 p-4 rounded-lg mt-4">
        <input
          type="text"
          placeholder="Type /gif to search"
          value={query}
          onChange={handleQueryChange} // Используем новый обработчик
          className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
        />
      </div>
    </div>
  );
}
