import React, { useState, useEffect } from "react";

const basicButtons = [
  "C",
  "()",
  "%",
  "÷",
  "7",
  "8",
  "9",
  "×",
  "4",
  "5",
  "6",
  "−",
  "1",
  "2",
  "3",
  "+",
  "+/−",
  "0",
  ".",
  "=",
];

const scientificButtons = [
  "sin",
  "cos",
  "tan",
  "ln",
  "log",
  "√",
  "π",
  "e",
  "x²",
  "xʸ",
  "1/x",
  "|x|",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [isScientific, setIsScientific] = useState(false);

  // Проверка валидности вводимых символов
  const isValidChar = (ch) =>
    /^[0-9+\-*/().e%]$/.test(ch) ||
    ch === "E" ||
    scientificButtons.includes(ch);

  const normalizeOperator = (op) => {
    if (op === "÷") return "/";
    if (op === "×") return "*";
    if (op === "−") return "-";
    return op;
  };

  // Обработка инженерных функций
  const applyScientificFunc = (val, expr) => {
    switch (val) {
      case "sin":
        return `Math.sin(${expr})`;
      case "cos":
        return `Math.cos(${expr})`;
      case "tan":
        return `Math.tan(${expr})`;
      case "ln":
        return `Math.log(${expr})`;
      case "log":
        return `Math.log10(${expr})`;
      case "√":
        return `Math.sqrt(${expr})`;
      case "π":
        return `${Math.PI}`;
      case "e":
        return `${Math.E}`;
      case "x²":
        return `Math.pow(${expr},2)`;
      case "xʸ":
        return null; // обработка xʸ сделаем через ввод оператора ^
      case "1/x":
        return `1/(${expr})`;
      case "|x|":
        return `Math.abs(${expr})`;
      default:
        return expr;
    }
  };

  const onClick = (val) => {
    if (!val) return;

    // Сброс
    if (val === "C") {
      setDisplay("0");
      return;
    }

    // Удаление последнего символа (по кнопке ⌫)
    if (val === "⌫") {
      setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
      return;
    }

    // Скобки
    if (val === "()") {
      setDisplay((d) => (d === "0" ? "()" : d + "()"));
      return;
    }

    // Обработка "=" - вычисление результата
    if (val === "=") {
      try {
        let expr = display
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-")
          .replace(/π/g, Math.PI)
          .replace(/e/g, Math.E)
          .replace(/%/g, "/100")
          .replace(/xʸ/g, "**"); // поддержка возведения в степень через **

        // Заменим все функции (sin, cos и др.) на вызовы Math
        expr = expr
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/√/g, "Math.sqrt")
          .replace(/\|\s*([^|]+)\s*\|/g, "Math.abs($1)"); // |x| как Math.abs(x)

        const result = Function('"use strict";return (' + expr + ")")();
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    // Если оператор
    if (/[+\-*/÷×−]/.test(val)) {
      setDisplay((d) => {
        const last = d.slice(-1);
        const op = normalizeOperator(val);
        if (/[+\-*/]/.test(last)) return d.slice(0, -1) + op;
        return d + op;
      });
      return;
    }

    // Обработка точки
    if (val === ".") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      setDisplay((d) => (d === "0" ? "0." : d + "."));
      return;
    }

    // Обработка переключения знака +/−
    if (val === "+/−") {
      setDisplay((d) => {
        if (d === "0") return d;
        if (d.startsWith("-")) return d.slice(1);
        return "-" + d;
      });
      return;
    }

    // Добавление научных функций (sin, cos, и т.п.)
    if (scientificButtons.includes(val)) {
      if (val === "π" || val === "e") {
        // Просто вставим число
        setDisplay((d) => (d === "0" ? val : d + val));
        return;
      } else if (val === "x²") {
        setDisplay((d) => d + "^2");
        return;
      } else if (val === "xʸ") {
        setDisplay((d) => d + "^");
        return;
      } else if (val === "1/x") {
        setDisplay((d) => `1/(${d})`);
        return;
      } else if (val === "|x|") {
        setDisplay((d) => `|${d}|`);
        return;
      } else if (val === "√") {
        setDisplay((d) => `√(${d})`);
        return;
      } else {
        setDisplay((d) => val + "(" + d + ")");
        return;
      }
    }

    // По умолчанию добавляем цифру/символ
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
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [display]);

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7F00FF, #E100FF)",
    fontFamily: "Arial, sans-serif",
  };

  const calcStyle = {
    background: "#b18eff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
    width: 320,
  };

  const displayStyle = {
    background: "#1e1e1e",
    color: "#fff",
    height: 60,
    borderRadius: 8,
    textAlign: "right",
    padding: "0 12px",
    fontSize: 28,
    lineHeight: "60px",
    marginBottom: 8,
    fontFamily: "'Courier New', monospace",
    wordWrap: "break-word",
  };

  const deleteButtonStyle = {
    background: "#ffb3b3",
    border: "none",
    borderRadius: 12,
    height: 40,
    width: 60,
    fontSize: 20,
    fontWeight: "bold",
    cursor: "pointer",
    float: "right",
    marginBottom: 10,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  };

  const buttonStyle = {
    background: "#d1b3ff",
    border: "none",
    borderRadius: 12,
    height: 50,
    fontSize: 18,
    fontWeight: 600,
    boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={calcStyle}>
        <div style={{ color: "#fff", marginBottom: 12, fontWeight: "bold" }}>
          Калькулятор
        </div>

        {/* Переключатель режима */}
        <button
          onClick={() => setIsScientific((prev) => !prev)}
          style={{
            marginBottom: 12,
            background: "#ffe066",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {isScientific ? "Обычный режим" : "Инженерный режим"}
        </button>

        {/* Display */}
        <div style={displayStyle}>{display}</div>

        {/* Delete one symbol */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={deleteButtonStyle}
            onClick={() =>
              setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)))
            }
          >
            ⌫
          </button>
        </div>

        {/* Line */}
        <hr style={{ border: "1px solid #aaa", marginBottom: 16 }} />

        {/* Buttons */}
        <div style={gridStyle}>
          {(isScientific ? scientificButtons : basicButtons).map((b, i) => (
            <button key={i} onClick={() => onClick(b)} style={buttonStyle}>
              {b}
            </button>
          ))}

          {/* В обычном режиме добавить кнопку переключения тоже */}
          {!isScientific && (
            <button
              onClick={() => setIsScientific(true)}
              style={{
                gridColumn: "span 4",
                background: "#ffa726",
                border: "none",
                borderRadius: 12,
                height: 50,
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              Перейти в инженерный режим
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
