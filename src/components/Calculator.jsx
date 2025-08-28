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

  const isValidChar = (ch) => /^[0-9+\-*/().e%]$/.test(ch) || ch === "E";

  const normalizeOperator = (op) => {
    if (op === "÷") return "/";
    if (op === "×") return "*";
    if (op === "−") return "-";
    return op;
  };

  const onClick = (val) => {
    if (!val) return;

    if (val === "C") {
      setDisplay("0");
      return;
    }

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
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    if (/[+\-*/]/.test(val)) {
      setDisplay((d) => {
        const last = d.slice(-1);
        const op = normalizeOperator(val);
        if (/[+\-*/]/.test(last)) return d.slice(0, -1) + op;
        return d + op;
      });
      return;
    }

    if (val === ".") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      setDisplay((d) => (d === "0" ? "0." : d + "."));
      return;
    }

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
        <div style={{ color: "#fff", marginBottom: 6 }}>Калькулятор</div>

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
          {buttons.map((b, i) => (
            <button key={i} onClick={() => onClick(b)} style={buttonStyle}>
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
