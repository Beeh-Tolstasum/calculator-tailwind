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
  "e",
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");
  const [showingHello, setShowingHello] = useState(false);

  const isValidChar = (ch) => /^[0-9+\-*/.e]$/.test(ch);

  const backspace = () => {
    if (showingHello) {
      setDisplay("0");
      setShowingHello(false);
      return;
    }
    setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
  };

  const onClick = (val) => {
    if (showingHello) {
      if (val === "Очистить" || val === "C") {
        setDisplay("0");
        setShowingHello(false);
        setHistory("");
        return;
      }
      if (val === "=") return;
      if (isValidChar(val)) {
        setDisplay(val === "0" ? "0" : val);
        setShowingHello(false);
      }
      return;
    }

    if (!isValidChar(val) && val !== "Очистить" && val !== "C" && val !== "=")
      return;

    if (val === "Очистить" || val === "C") {
      setDisplay("0");
      setHistory("");
      setShowingHello(false);
      return;
    }

    if (val === "=") {
      if (display === "8977") {
        setDisplay("Hello World");
        setHistory("8977 = Hello World");
        setShowingHello(true);
        return;
      }
      try {
        if (!/[0-9e]/.test(display)) {
          setDisplay("0");
          return;
        }
        const expression = display.replace(/e/g, `(${Math.E})`);
        const result = Function('"use strict";return (' + expression + ")")();
        setHistory(display + " = " + result);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    if (/[+\-*/]/.test(val)) {
      setDisplay((d) => {
        const last = d.slice(-1);
        if (/[+\-*/]/.test(last)) return d.slice(0, -1) + val;
        return d + val;
      });
      return;
    }

    if (val === ".") {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      setDisplay((d) => (d === "0" ? val : d + val));
      return;
    }

    if (val === "e") {
      const last = display.slice(-1);
      if (!/[0-9]/.test(last)) return;
      setDisplay((d) => d + val);
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
          {buttons.map((b) => (
            <button
              key={b}
              onClick={() => onClick(b)}
              style={glassButtonStyle}
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
          ))}
          <button
            onClick={() => onClick("Очистить")}
            style={clearButtonStyle}
            className="col-span-4"
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
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
