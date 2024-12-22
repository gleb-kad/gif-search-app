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
  const [gifContainerHeight, setGifContainerHeight] = useState("100px"); // Начальная высота контейнера для гифок

  const gifsPerPage = 20; // Количество гифок на страницу (можно настроить)

  // Загрузка гифок
  const fetchGifs = async (searchTerm, pageOffset = 0) => {
    setLoading(true);
    const results = await searchGifs(searchTerm, pageOffset);
    if (pageOffset === 0) {
      setGifs(results); // Загружаем новые результаты
    } else {
      setGifs((prevGifs) => [...prevGifs, ...results]); // Добавляем новые гифки к существующим
    }
    setLoading(false);
    setShowResults(true);
    setGifContainerHeight("calc(100% - 60px)"); // Увеличиваем высоту контейнера для гифок после загрузки
  };

  // Обработчик клика по гифке
  const handleGifClick = (gif) => {
    setSelectedGif(gif);
    setShowResults(false);
    setSentTime(new Date().toLocaleTimeString());
    setIsChatMode(true); // Включаем режим чата
    setQuery(""); // Очищаем строку поиска
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.startsWith("/gif ")) {
      const searchTerm = query.slice(5); // Извлекаем текст после "/gif "
      setOffset(0); // Сбрасываем смещение на первую страницу
      setGifs([]); // Очищаем предыдущие результаты
      fetchGifs(searchTerm); // Загружаем первую страницу
      setShowResults(true); // Показываем окно с результатами
    }
  };

  // При изменении запроса сбрасываем гифки и смещение
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setGifs([]); // Очищаем гифки
    setOffset(0); // Сбрасываем смещение
    setSelectedGif(null);
    setSentTime(null);
    setIsChatMode(false); // Сбрасываем режим чата
    setGifContainerHeight("100px"); // Возвращаем начальную высоту контейнера
  };

  // Обработчик прокрутки (для бесконечного скроллинга)
  const handleScroll = (e) => {
    const container = e.target;
    // Проверяем, достигли ли мы конца контейнера с небольшим запасом (10% от высоты)
    if (container.scrollHeight - container.scrollTop <= container.clientHeight * 1.1 && !loading) {
      setOffset((prevOffset) => prevOffset + gifsPerPage); // Загружаем дополнительные гифки
    }
  };

  // Загружаем гифки при изменении смещения
  useEffect(() => {
    if (offset > 0 || query.startsWith("/gif ")) {
      const searchTerm = query.slice(5); // Извлекаем текст после "/gif "
      fetchGifs(searchTerm, offset);
    }
  }, [offset]);

  const renderQueryText = (query) => {
    // Проверяем, начинается ли текст с "/gif"
    if (query.startsWith("/gif")) {
      const gifText = query.slice(0, 4); // "/gif"
      const restText = query.slice(4); // Остальной текст
      return (
        <span>
          <span
            style={{
              background: "linear-gradient(to right, #00bcd4, #f472b6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {gifText}
          </span>
          <span style={{ color: "black" }}>{restText}</span>
        </span>
      );
    }
    // Если текст не содержит "/gif", отображаем его черным
    return <span style={{ color: "black" }}>{query}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-[700px] flex flex-col border border-gray-300" style={{ height: "600px" }}>
      

      {/* Если выбрана гифка, отображаем её */}
      {selectedGif && (
        <div className="m-4 flex justify-down animate-slide-up relative">
          <img
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            className="rounded-md shadow-md"
            style={{
              maxWidth: "600px",
              height: "500px",
            }}
          />
          <div className=" text-bottom-right text-gray-400 text-sm">{sentTime}</div>
        </div>
      )}

      {/* Сетка GIF */}
      {showResults && !selectedGif && (
        <div
          className="flex flex-wrap gap-2 overflow-y-auto flex-1 justify-start"
          style={{
            marginTop: "22px", // Отступ сверху
            marginLeft: "16px", // Отступ слева
            marginRight: "16px", // Отступ справа
            padding: "5px",
            alignContent: "start",
            maxHeight: gifContainerHeight,
            overflowY: "auto",
            border: "1.5px solid #e5e7eb", // Граница вокруг контейнера
            borderRadius: "1px", // Скругленные углы контейнера
          }}
          onScroll={handleScroll} // Обработчик прокрутки
        >
          {gifs.length > 0 ? (
            gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="rounded-md shadow-sm transition-transform transform hover:shadow-xl cursor-pointer"
                onClick={() => handleGifClick(gif)} // Обработчик клика
                style={{
                  flex: "1 1 auto", // Элементы гибко растягиваются
                  maxWidth: "200px", // Устанавливаем максимальную ширину
                  height: "150px", // Сохраняем пропорции
                  margin: "5px",
                  marginRight: "0px",
                }}
              />
            ))
          ) : (
            <p className="flex justify-right">Нет результатов для поиска.</p>
          )}
        </div>
      )}
      {/* Если загрузка, показываем индикатор */}
      {loading && <p className="text-center mt-4">Загрузка...</p>}
      {/* Часть с поиском */}
      <div className="mt-auto bg-gray-50 border-t border-gray-200 p-4 w-full">
        <div className="relative">
          {/* Поле ввода */}
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Введите текст..."
            className="w-full border border-gray-300 rounded-lg p-3 text-transparent focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{
              background: "transparent", // Прозрачный фон
              color: "transparent", // Текст скрыт
            }}
          />

          {/* Отображение текста */}
          <div
            className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none"
            style={{ whiteSpace: "nowrap" }}
          >
            {renderQueryText(query)}
          </div>
        </div>
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
