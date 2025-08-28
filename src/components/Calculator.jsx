import React, { useState, useEffect } from "react";

const buttons = [
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
  const [history, setHistory] = useState("");

  const isValidChar = (ch) => /^[0-9+\-*/().e%]$/.test(ch) || ch === "E";

  const normalizeOperator = (op) => {
    if (op === "÷") return "/";
    if (op === "×") return "*";
    if (op === "−") return "-";
    return op;
  };

  const onClick = (val) => {
    if (!val) return;

    // Очистка
    if (val === "C") {
      setDisplay("0");
      setHistory("");
      return;
    }

    // Обработка кнопки "()"
    if (val === "()") {
      setDisplay((d) => (d === "0" ? "()" : d + "()"));
      return;
    }

    if (!isValidChar(val) && val !== "=") return;

    if (val === "=") {
      try {
        let expr = display
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/−/g, "-")
          .replace(/e/g, `(${Math.E})`);

        if (!/[0-9+\-*/().e]/.test(expr)) {
          setDisplay("0");
          return;
        }

        const result = Function('"use strict";return (' + expr + ")")();
        setHistory(display + " = " + result);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    // Операторы
    if (/[+\-*/]/.test(val)) {
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

    // Число/константы
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

  const glassButtonStyle = {
    background: "rgba(255, 255, 255, 0.25)",
    boxShadow: `4px 4px 8px rgba(0,0,0,0.2), -4px -4px 8px rgba(255,255,255,0.7)`,
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    width: "100%",
    height: "56px",
    fontWeight: 600,
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          width: 420,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        {/* Дисплей */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 12px",
            fontFamily: "'Courier New', monospace",
            fontSize: 28,
            borderBottom: "1px solid #ccc",
          }}
        >
          {display}
        </div>

        {/* Кнопки */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginTop: 12,
          }}
        >
          {buttons.map((b, i) => (
            <button key={i} onClick={() => onClick(b)} style={glassButtonStyle}>
              {b}
            </button>
          ))}
        </div>

        {/* История (опционально) */}
        {history && (
          <div
            style={{
              marginTop: 12,
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: "#555",
            }}
          >
            {history}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
