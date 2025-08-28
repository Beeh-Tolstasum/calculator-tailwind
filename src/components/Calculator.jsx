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

// Планшетный вид для инженерного режима - больше колонок, меньше пустых ячеек
const buttonsEngineer = [
  "⇄",
  "Rad",
  "√",
  "C",
  "sin",
  "cos",
  "tan",
  "()",
  "ln",
  "log",
  "1/x",
  "%",
  "eˣ",
  "x²",
  "xʸ",
  "÷",
  "|x|",
  "π",
  "e",
  "×",
  "+/−",
  "0",
  ".",
  "+",
  "−",
  "=",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [engineerMode, setEngineerMode] = useState(false);
  const inputRef = useRef(null);

  const isValidChar = (ch) => /^[0-9+\-*/().e%]$/.test(ch) || ch === "E";

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
    if (val === "⇄") return;

    if (val === "+/−") {
      if (display === "0") return;
      if (display.startsWith("-")) setDisplay(display.slice(1));
      else setDisplay("-" + display);
      return;
    }

    if (
      !isValidChar(val) &&
      val !== "=" &&
      val !== "," &&
      val !== "Rad" &&
      val !== "sin" &&
      val !== "cos" &&
      val !== "tan" &&
      val !== "ln" &&
      val !== "log" &&
      val !== "1/x" &&
      val !== "eˣ" &&
      val !== "x²" &&
      val !== "xʸ" &&
      val !== "|x|" &&
      val !== "π" &&
      val !== "e"
    )
      return;

    if (val === "=") {
      try {
        let expr = display
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-")
          .replace(/,/g, ".")
          .replace(/π/g, String(Math.PI))
          .replace(/e/g, String(Math.E));

        if (!/[0-9+\-*/().]/.test(expr)) {
          setDisplay("0");
          return;
        }
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    if (/[+\-*/]/.test(val)) {
      const last = display.slice(-1);
      const op = normalizeOperator(val);
      if (/[+\-*/]/.test(last)) {
        setDisplay(display.slice(0, -1) + op);
      } else {
        insertAtCursor(op);
      }
      return;
    }

    if (val === "." || val === ",") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".") || lastPart.includes(",")) return;
      insertAtCursor(".");
      return;
    }

    if (engineerMode) {
      if (val === "π") {
        insertAtCursor(String(Math.PI));
        return;
      }
      if (val === "e") {
        insertAtCursor(String(Math.E));
        return;
      }
    }

    insertAtCursor(val);
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
      if (k === "Escape") {
        e.preventDefault();
        setDisplay("0");
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [display, engineerMode]);

  // Кнопка удаления символа слева от курсора или выделения
  const onDelete = () => {
    if (inputRef.current) {
      const el = inputRef.current;
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
    }
  };

  // Стили
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
    boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
    width: engineerMode ? 460 : 340,
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
    flexGrow: 1,
    overflowX: "auto",
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
    background: engineerMode ? "#ffb347" : "#ffe066",
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
    gridTemplateColumns: engineerMode ? "repeat(8, 1fr)" : "repeat(4, 1fr)",
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
    userSelect: "none",
  };

  const clearButtonStyle = {
    ...buttonStyle,
    background: "#ff4d4d",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "2px 2px 8px rgba(255, 0, 0, 0.7)",
  };

  const buttons = engineerMode ? buttonsEngineer : buttonsSimple;

  return (
    <div style={containerStyle}>
      <div style={calcStyle}>
        <div style={{ color: "#fff", marginBottom: 6 }}>Калькулятор</div>

        {/* Дисплей — input */}
        <input
          ref={inputRef}
          type="text"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          style={displayStyle}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Кнопки переключения режима и удаления */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 8,
          }}
        >
          <button
            style={toggleModeButtonStyle}
            onClick={() => setEngineerMode((v) => !v)}
            aria-label="Переключить режим"
          >
            {engineerMode ? "Инж" : "Обч"}
          </button>

          <button
            style={{ ...deleteButtonStyle, marginLeft: 8 }}
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
