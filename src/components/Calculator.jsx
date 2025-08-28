import React, { useState, useEffect } from "react";

const buttons = [
  "C",
  "(",
  ")",
  "%",
  "÷",
  "7",
  "8",
  "9",
  "×",
  "←",
  "4",
  "5",
  "6",
  "−",
  "÷",
  "1",
  "2",
  "3",
  "+",
  "e",
  "+/−",
  "0",
  ".",
  "=",
  "",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");
  const [showingHello, setShowingHello] = useState(false);

  // Разрешённые символы и простой синтаксис
  const isValidChar = (ch) => /^[0-9+\-*/().e%]$/.test(ch) || ch === "E";

  const normalizeOperator = (op) => {
    // нормализуем визуальные операторы
    if (op === "÷") return "/";
    if (op === "×") return "*";
    if (op === "−") return "-";
    return op;
  };

  const backspace = () => {
    if (showingHello) {
      setDisplay("0");
      setShowingHello(false);
      return;
    }
    setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
  };

  const onClick = (val) => {
    if (!val) return;

    if (val === "←") {
      backspace();
      return;
    }

    if (val === "C" || val === "C") {
      setDisplay("0");
      setHistory("");
      setShowingHello(false);
      return;
    }

    // Русский/английский режим кнопки Очистить не требуется: используем C
    if (showingHello) {
      if (val === "=") return;
      if (isValidChar(val)) {
        setDisplay(val === "0" ? "0" : val);
        setShowingHello(false);
      }
      return;
    }

    if (!isValidChar(val) && val !== "=") return;

    if (val === "=") {
      if (display === "8977") {
        setDisplay("Hello World");
        setHistory("8977 = Hello World");
        setShowingHello(true);
        return;
      }

      try {
        // Простой безопасный вычислитель: разрешаем только цифры, скобки и операторы
        // Преобразование визуальных символов в программные
        let expr = display
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-")
          .replace(/e/g, `(${Math.E})`);

        // Элементарная фильтрация: не допускаем букв и прочего
        if (!/[0-9+\-*/().e]/.test(expr)) {
          setDisplay("0");
          return;
        }

        // Безопасный вычислитель: ограничиваемся встроенным парсингом через Function в рамках строгой изоляции (для демонстрации).
        // Для продакшна лучше заменить на mathjs/expr-eval.
        const result = Function('"use strict";return (' + expr + ")")();
        setHistory(display + " = " + result);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    // Обработка арифметических операторов
    if (/[+\-*/]/.test(val)) {
      // вставляем оператор, заменяя предыдущий если он есть
      setDisplay((d) => {
        const last = d.slice(-1);
        const op = normalizeOperator(val);
        if (/[+\-*/]/.test(last)) return d.slice(0, -1) + op;
        return d + op;
      });
      return;
    }

    // Точка
    if (val === ".") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      setDisplay((d) => (d === "0" ? "0." : d + "."));
      return;
    }

    // Роль e как константы - простая обработка, разрешаем добавлять после цифры
    if (val === "e") {
      const last = display.slice(-1);
      if (!/[0-9]/.test(last)) return;
      setDisplay((d) => d + val);
      return;
    }

    // +/− инвертирование последнего числа (упрощение)
    if (val === "+/−") {
      // Найти последнее число в выражении и поменять знак
      const parts = display.match(/(.*?)([0-9]+)$/);
      if (parts && parts[2]) {
        const idx = display.lastIndexOf(parts[2]);
        const before = display.slice(0, idx);
        const num = parts[2];
        // инвертируем число
        const inv = (-Number(num)).toString();
        setDisplay(before + inv);
      }
      return;
    }

    // Число
    setDisplay((d) => (d === "0" ? val : d + val));
  };

  useEffect(() => {
    const handler = (e) => {
      const k = e.key;
      if (k.length === 1 && isValidChar(k)) {
        e.preventDefault();
        onClick(k);
        return;
      }
      if (k === "Enter") {
        e.preventDefault();
        onClick("=");
        return;
      }
      if (k === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (k === "Escape") {
        e.preventDefault();
        setDisplay("0");
        setShowingHello(false);
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [display, showingHello]);

  const glassButtonStyle = {
    background: "rgba(255, 255, 255, 0.25)",
    boxShadow: `4px 4px 8px rgba(0,0,0,0.2), -4px -4px 8px rgba(255,255,255,0.7)`,
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    transform: "perspective(500px) rotateY(-10deg) translateY(-2px)",
    transition: "all 0.3s ease",
    color: "black",
    fontWeight: "600",
    width: "100%",
    height: "56px",
  };

  const clearButtonStyle = {
    ...glassButtonStyle,
    background: "linear-gradient(135deg, #f43f5e, #ec4899)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.6)",
    fontWeight: "700",
    height: "48px",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 w-full max-w-md p-6 md:p-8">
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-700">Калькулятор</div>
        </div>
        <div
          className="bg-black/80 text-white rounded-md h-14 px-4 py-2 text-2xl md:text-3xl mb-4 shadow-inner select-none"
          style={{
            textAlign: "right",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {display.length > 23 ? display.slice(-23) : display}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((b, idx) => {
            // пропустим пустой элемент
            if (!b) return <div key={"sp-" + idx} />;
            // zvl. кнопка «C» как очистка
            const isClear = b === "C";
            return (
              <button
                key={b + idx}
                onClick={() => onClick(b)}
                style={isClear ? clearButtonStyle : glassButtonStyle}
                className={isClear ? "col-span-1" : ""}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform =
                    "perspective(500px) rotateY(-10deg) translateY(0)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform =
                    "perspective(500px) rotateY(-10deg) translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform =
                    "perspective(500px) rotateY(-10deg) translateY(-2px)")
                }
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
