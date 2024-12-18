"use client";

import React, { useState, useEffect } from "react";
import { searchGifs } from "../lib/giphy";

export default function GifSearch() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-[600px] max-h-[400px] flex flex-col">
      {/* Центрированное окно */}

      

      

      {/* Сетка GIF */}
      {showResults && (
        <div
          className="grid gap-2 overflow-y-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gridAutoFlow: "row dense",
            justifyContent: "center",
            alignContent: "start",
            maxHeight: "700px",
            maxWidth: "600px",
            borderRadius: "10px", // Добавлено для округления контейнера
            paddingRight: "12px", // Добавлен отступ для полосы прокрутки
          }}
        >
          {gifs.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className="rounded-md shadow-sm transition-transform transform hover:scale-105"
              style={{
                maxWidth: "150px", // Максимальная ширина изображения
                height: "auto", // Сохраняем пропорции
              }}
            />
          ))}
        </div>
      )}
      {/* Разделительная полоса с отступами сверху и снизу */}
      <div className="border-b border-gray-300 mt-4 mb-4"></div>


      {/* Часть с поиском - серый фон */}
      <div className="bg-pink-200 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Type /gif to search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
        />
      </div>

      {/* Кастомизация скроллинга в стиле округлой полосы */}
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
      `}</style>
    </div>
  );
}
