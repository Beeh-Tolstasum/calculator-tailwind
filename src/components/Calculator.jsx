import React, { useState, useEffect } from "react";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");

  // Валидация символов
  const isValidChar = (ch) => /[0-9+\-*/.]/.test(ch);

  // Удаление последнего символа
  const backspace = () => {
    setDisplay((d) => {
      if (d.length <= 1) return "0";
      return d.slice(0, -1);
    });
  };

  // Обработка нажатий кнопок
  const onClick = (val) => {
    // Разрешаем только валидные символы или очистку
    if (!isValidChar(val) && val !== "Очистить" && val !== "C" && val !== "=")
      return;

    // Очистка
    if (val === "Очистить" || val === "C") {
      setDisplay("0");
      setHistory("");
      return;
    }

    // Выполнение =
    if (val === "=" || val === "Enter") {
      try {
        // Разрешаем только валидные выражения (есть цифра)
        if (!/[0-9]/.test(display)) {
          setDisplay("0");
          return;
        }
        const result = Function('"use strict";return (' + display + ")")();
        setHistory(display + " = " + result);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    // Замена оператора или добавление
    if (/[+\-*/]/.test(val)) {
      setDisplay((d) => {
        const last = d.slice(-1);
        if (/[+\-*/]/.test(last)) {
          // заменить последний оператор
          return d.slice(0, -1) + val;
        }
        // иначе просто добавить оператор
        return d + val;
      });
      return;
    }

    // Цифры и точка
    setDisplay((d) => (d === "0" ? val : d + val));
  };

  // Клавиатура
  useEffect(() => {
    const handler = (e) => {
      const k = e.key;
      if (isValidChar(k)) onClick(k);
      if (k === "Enter") onClick("="); // Enter вызывает =
      if (k === "Backspace") backspace();
      if (k === "Escape") setDisplay("0");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [display]);

  // Верстка и стиль
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 w-full max-w-md p-6 md:p-8">
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-700">Калькулятор</div>
        </div>
        <div className="bg-black/80 text-white text-right rounded-md h-14 px-4 py-2 text-2xl md:text-3xl mb-4 shadow-inner">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((b) => (
            <button
              key={b}
              onClick={() => onClick(b)}
              className="bg-white/75 hover:bg-white/90 text-black font-semibold rounded-lg shadow-md transition-all duration-150 transform hover:-translate-y-0.5 active:scale-95 w-full h-14"
            >
              {b}
            </button>
          ))}
          <button
            onClick={() => onClick("Очистить")}
            className="col-span-4 bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-semibold rounded-lg shadow-md p-3 w-full h-12"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
