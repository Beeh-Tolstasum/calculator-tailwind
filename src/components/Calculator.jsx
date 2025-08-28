import React, { useState, useEffect, useRef } from "react";

const buttonsSimple = [
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

function Calculator() {
  const [display, setDisplay] = useState("0");
  const inputRef = useRef(null);

  // Фильтрация допустимых символов с клавиатуры
  const allowedKeys = new Set([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/",
    "(",
    ")",
    ".",
    "%",
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Enter",
    "Escape",
    "Tab",
  ]);

  // Перевод операторов в js-формат
  const normalizeOperator = (op) => {
    if (op === "÷") return "/";
    if (op === "×") return "*";
    if (op === "−") return "-";
    return op;
  };

  // Вставка символа в позицию курсора
  const insertAtCursor = (val) => {
    const el = inputRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = display === "0" ? "" : display;

    const newValue = current.substring(0, start) + val + current.substring(end);
    setDisplay(newValue || "0");

    // Установим курсор после вставленного символа
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + val.length;
      el.focus();
    }, 0);
  };

  // Обработка кликов по кнопкам
  const onClick = (val) => {
    if (!val) return;
    if (val === "C") {
      setDisplay("0");
      return;
    }
    if (val === "()") {
      insertAtCursor("()");
      return;
    }
    if (val === "+/−") {
      if (display === "0") return;
      if (display.startsWith("-")) setDisplay(display.slice(1));
      else setDisplay("-" + display);
      return;
    }
    if (val === "=") {
      try {
        let expr = display
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-")
          .replace(/,/g, ".");
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    if (["+", "-", "×", "÷", "−"].includes(val)) {
      const last = display.slice(-1);
      const op = normalizeOperator(val);
      if (["+", "-", "*", "/"].includes(last)) {
        setDisplay(display.slice(0, -1) + op);
      } else {
        insertAtCursor(op);
      }
      return;
    }

    if (val === ".") {
      // Проверяем есть ли уже точка в текущем числе
      const parts = display.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      insertAtCursor(".");
      return;
    }

    // Все остальные числа и символы
    insertAtCursor(val);
  };

  // Обработка событий клавиатуры
  useEffect(() => {
    const onKeyDown = (e) => {
      // Разрешаем только нужные клавиши
      if (!allowedKeys.has(e.key)) {
        e.preventDefault();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onClick("=");
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setDisplay("0");
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [display]);

  // Обработка изменения input (вставка с клавиатуры, мыши и т.д.)
  const onChange = (e) => {
    // Фильтруем ввод
    const filtered = e.target.value
      .split("")
      .filter((ch) => "0123456789+-*/().%".includes(ch))
      .join("");
    setDisplay(filtered || "0");
  };

  // Удаление символа слева от курсора
  const onDelete = () => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start === end && start > 0) {
      const newValue = display.slice(0, start - 1) + display.slice(end);
      setDisplay(newValue || "0");
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start - 1;
        el.focus();
      }, 0);
    } else if (start !== end) {
      const newValue = display.slice(0, start) + display.slice(end);
      setDisplay(newValue || "0");
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start;
        el.focus();
      }, 0);
    }
  };

  // Стили (упрощены, чтобы не было больших теней)
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7F00FF, #E100FF)",
    fontFamily: "Arial, sans-serif",
    padding: 10,
  };

  const calcStyle = {
    background: "#b18eff",
    padding: "24px",
    borderRadius: "16px",
    width: 340,
    maxWidth: "95vw",
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
    border: "none",
    outline: "none",
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
  };

  const toggleModeButtonStyle = {
    background: "#ffe066",
    border: "none",
    borderRadius: 12,
    height: 40,
    width: 60,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  };

  const buttonStyle = {
    background: "#c8aaff",
    border: "none",
    borderRadius: 12,
    height: 50,
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none",
  };

  const clearButtonStyle = {
    ...buttonStyle,
    background: "#ff4d4d",
    color: "#fff",
    fontWeight: "bold",
  };

  const buttons = buttonsSimple;

  return (
    <div style={containerStyle}>
      <div style={calcStyle}>
        <div style={{ color: "#fff", marginBottom: 6 }}>Калькулятор</div>

        {/* Дисплей - input */}
        <input
          ref={inputRef}
          type="text"
          value={display}
          onChange={onChange}
          style={displayStyle}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Кнопки удаления и переключения (только удаление пока) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 8,
          }}
        >
          <button
            style={deleteButtonStyle}
            onClick={onDelete}
            aria-label="Удалить последний символ"
          >
            ⌫
          </button>
        </div>

        <hr style={{ border: "2px solid #000", margin: "16px 0" }} />

        <div style={gridStyle}>
          {buttons.map((b, i) =>
            b ? (
              <button
                key={i}
                onClick={() => onClick(b)}
                style={b === "C" ? clearButtonStyle : buttonStyle}
              >
                {b}
              </button>
            ) : (
              <div key={i} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
