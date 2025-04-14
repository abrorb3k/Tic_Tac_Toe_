import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [spaces, setSpaces] = useState<string[]>(Array(9).fill("*"));
  const [gameOver, setGameOver] = useState(false);

  const combinates = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const restart = () => {
    setSpaces(Array(9).fill("*"));
    setGameOver(false);
  };

  const check = (arr: string[], player: string) => {
    return combinates.some((c) => c.every((i) => arr[i] === player));
  };

  const makeMove = (index: number, currentArr: string[]) => {
    const newArr = currentArr.map((s, i) => (i === index ? "O" : s));
    setSpaces(newArr);

    if (check(newArr, "O")) {
      toast.error("Siz yutqazdingiz! O yutdi!", { autoClose: 3000 });
      setGameOver(true);
      setTimeout(restart, 3000);
    } else if (!newArr.includes("*")) {
      toast.info("Durrang!", { autoClose: 2000 });
      setGameOver(true);
      setTimeout(restart, 2000);
    }
  };

  const comp = (arr: string[]) => {
    const empty = arr
      .map((v, i) => (v === "*" ? i : null))
      .filter((v) => v !== null) as number[];

    for (const c of combinates) {
      const [a, b, c1] = c;
      const values = [arr[a], arr[b], arr[c1]];
      if (
        values.filter((v) => v === "O").length === 2 &&
        values.includes("*")
      ) {
        return makeMove(c[values.indexOf("*")], arr);
      }
    }

    for (const c of combinates) {
      const [a, b, c1] = c;
      const values = [arr[a], arr[b], arr[c1]];
      if (
        values.filter((v) => v === "X").length === 2 &&
        values.includes("*")
      ) {
        return makeMove(c[values.indexOf("*")], arr);
      }
    }

    const random = empty[Math.floor(Math.random() * empty.length)];
    makeMove(random, arr);
  };

  const fill = (id: number) => {
    if (spaces[id] !== "*" || gameOver) return;

    const updated = spaces.map((s, i) => (i === id ? "X" : s));
    setSpaces(updated);

    if (check(updated, "X")) {
      toast.success("X yutdi! Siz g'olib bo'ldingiz!", { autoClose: 2000 });
      setGameOver(true);
      setTimeout(restart, 2000);
      return;
    }

    if (!updated.includes("*")) {
      toast.info("Durrang!", { autoClose: 2000 });
      setGameOver(true);
      setTimeout(restart, 2000);
      return;
    }

    setTimeout(() => comp(updated), 400);
  };

  return (
    <div className="container bg-gray-950 min-h-screen px-4">
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-amber-200 text-center">
          Tic Tac Toe
        </h1>

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg grid grid-cols-3 border rounded overflow-hidden shadow-lg">
          {spaces.map((s, i) => (
            <div
              key={i}
              onClick={() => fill(i)}
              className={`flex items-center justify-center text-4xl sm:text-5xl md:text-6xl aspect-square border cursor-pointer transition-all duration-300 
              ${
                s === "X"
                  ? "text-green-500"
                  : s === "O"
                  ? "text-red-500"
                  : "text-gray-400"
              }
              hover:bg-gray-800`}
            >
              {s === "*" ? " " : s}
            </div>
          ))}
        </div>

        <button
          onClick={restart}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all cursor-pointer"
        >
          Restart
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
