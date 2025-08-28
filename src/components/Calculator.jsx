import React, { useState, useEffect } from "react";

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
  "",
  "",
  "+/−",
  "−",
  "",
  "",
  "0",
  "+",
  "",
  "",
  ",",
  "=",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [engineerMode, setEngineerMode] = useState(false);

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
    if (val === "⇄") return;

    if (val === "+/−") {
      setDisplay((d) => {
        if (d === "0") return d;
        if (d.startsWith("-")) return d.slice(1);
        return "-" + d;
      });
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

    if (val === ",") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(",")) return;
      setDisplay((d) => (d === "0" ? "0," : d + ","));
      return;
    }

    if (engineerMode) {
      if (val === "π") {
        setDisplay((d) => (d === "0" ? String(Math.PI) : d + String(Math.PI)));
        return;
      }
      if (val === "e") {
        setDisplay((d) => (d === "0" ? String(Math.E) : d + String(Math.E)));
        return;
      }
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
  }, [display, engineerMode]);

  // Styles
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
    width: 340,
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
    userSelect: "none",
  };

  const buttons = engineerMode ? buttonsEngineer : buttonsSimple;

  return (
    <div style={containerStyle}>
      <div style={calcStyle}>
        <div style={{ color: "#fff", marginBottom: 6 }}>Калькулятор</div>

        {/* Дисплей */}
        <div style={displayStyle}>{display}</div>

        {/* Кнопки переключения режима и удаления */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
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
            onClick={() =>
              setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)))
            }
            aria-label="Удалить последний символ"
          >
            ⌫
          </button>
        </div>

        {/* Разделительная линия */}
        <hr style={{ border: "2px solid #000", margin: "16px 0" }} />

        {/* Сетка кнопок */}
        <div style={gridStyle}>
          {buttons.map((b, i) =>
            b ? (
              <button key={i} onClick={() => onClick(b)} style={buttonStyle}>
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
