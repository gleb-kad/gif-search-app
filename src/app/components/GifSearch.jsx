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
  const [sentTime, setSentTime] = useState(null); // Время отправки
  const [isChatMode, setIsChatMode] = useState(false); // Режим чата

  // Загрузка гифок при изменении запроса или смещения
  useEffect(() => {
    const fetchGifs = async () => {
      if (query.startsWith("/gif ")) {
        const searchTerm = query.slice(5);
        setLoading(true);

        const results = await searchGifs(searchTerm, offset);

        if (offset === 0) {
          setGifs(results);
        } else {
          setGifs((prevGifs) => [...prevGifs, ...results]);
        }

        setLoading(false);
        setShowResults(true);
      } else {
        setShowResults(false);
        setGifs([]);
        setOffset(0);
      }
    };

    fetchGifs();
  }, [query, offset]);

  // Обработчик клика по гифке
  const handleGifClick = (gif) => {
    setSelectedGif(gif);
    setShowResults(false);
    setSentTime(new Date().toLocaleTimeString());
    setIsChatMode(true); // Включаем режим чата
    setQuery(""); // Очищаем строку поиска
  };

  // Обработчик кнопки "Показать больше"
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 9);
  };

  // При изменении запроса сбрасываем гифки и смещение
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setGifs([]);
    setOffset(0);
    setSelectedGif(null);
    setSentTime(null);
    setIsChatMode(false); // Сбрасываем режим чата, если пользователь снова ищет гифки
  };

  const renderQueryText = (query) => {
    // Проверяем, начинается ли текст с "/gif"
    if (query.startsWith("/gif")) {
      const gifText = query.slice(0, 5); // "/gif"
      const restText = query.slice(4); // Остальной текст
      return (
        <span>
          <span style={{ background: "linear-gradient(to right, #00bcd4, #f472b6)", WebkitBackgroundClip: "text", color: "transparent" }}>
            {gifText}
          </span>
          {restText}
        </span>
      );
    }
    return query;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg w-[600px] flex flex-col border border-gray-300`}
      style={{
        height: "500px",
      }}
    >
      {/* Если выбрана гифка, отображаем её */}
      {selectedGif && (
        <div className="m-4 flex justify-down animate-slide-up relative">
          
          <img
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            className="rounded-md shadow-md"
            style={{
              maxWidth: "500px",
              height: "400px",
            }}
          />

          
            <div className=" text-bottom-right text-gray-400 text-sm">
              {sentTime}
            </div>
          
        </div>
      )}
      
      {/* Сетка GIF */}
      {showResults && !selectedGif && (
        <div
          className="flex flex-wrap gap-2 overflow-y-auto flex-1 justify-start m-2"
          style={{
            alignContent: "start", // Выравнивание по верхнему краю
          }}
        >
          {gifs.length > 0 ? (
            gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="rounded-md shadow-sm transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer m-1"
                onClick={() => handleGifClick(gif)} // Обработчик клика
                style={{
                  flex: "1 1 auto", // Элементы гибко растягиваются
                  maxWidth: "200px", // Устанавливаем максимальную ширину
                  height: "150px", // Сохраняем пропорции
                }}
              />
            ))
          ) : (
            <p className="flex justify-right">Нет результатов для поиска.</p>
          )}
        </div>
      )}

      {/* Кнопка "Показать больше" */}
      {showResults && !loading && !selectedGif && (
        <button
          onClick={handleShowMore}
          className="m-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Показать больше
        </button>
      )}

      {/* Если загрузка, показываем индикатор */}
      {loading && <p className="text-center mt-4">Загрузка...</p>}


      {/* Часть с поиском */}
      <div className="mt-auto bg-gray-50 border-t border-gray-200 p-4 w-full" style={{ left: "0" }}>
        <input
          type="text"
          placeholder="Напишите сообщение..."
          value={query}
          onChange={handleQueryChange}
          style={{ borderRadius: "6px"}}
          className="border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
        />
      </div>

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

        /* Анимация перемещения гифки вверх */
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
