"use client";

import React, { useState, useEffect } from "react";
import { searchGifs } from "../lib/giphy";

export default function GifSearch() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null); // Выбранная гифка

  useEffect(() => {
    const fetchGifs = async () => {
      if (query.startsWith("/gif ")) {
        const searchTerm = query.slice(5);
        const results = await searchGifs(searchTerm);
        setGifs(results);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    };
    fetchGifs();
  }, [query]);

  // Обработчик клика по гифке
  const handleGifClick = (gif) => {
    setSelectedGif(gif); // Устанавливаем выбранную гифку
  };

  // Обработчик отмены выбранной гифки
  const handleClearSelectedGif = () => {
    setSelectedGif(null); // Сбрасываем выбранную гифку
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 w-[600px] flex flex-col transition-all duration-500`}
      style={{
        height: selectedGif ? "700px" : showResults ? "400px" : "auto", // Динамическая высота
      }}
    >
      {/* Если выбрана гифка, отображаем её сверху */}
      {selectedGif && (
        <div className="mb-4 flex justify-center relative animate-slide-up">
          <img
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            className="rounded-md shadow-md w-[150px] h-auto"
          />
          {/* Кнопка для отмены выбора */}
          <button
            onClick={handleClearSelectedGif}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs transform translate-x-2 -translate-y-2 hover:bg-red-600"
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Разделительная полоса с отступами */}
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
            paddingRight: "12px", // Отступ для полосы прокрутки
          }}
        >
          {gifs.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className="rounded-md shadow-sm transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleGifClick(gif)} // Обработчик клика
              style={{
                maxWidth: "150px", // Максимальная ширина изображения
                height: "auto", // Сохраняем пропорции
              }}
            />
          ))}
        </div>
      )}

      {/* Часть с поиском */}
      <div className="bg-pink-200 p-4 rounded-lg mt-4">
        <input
          type="text"
          placeholder="Type /gif to search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
        />
      </div>

      {/* Кастомизация скроллинга */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #999;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        /* Анимация перемещения гифки наверх */
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
