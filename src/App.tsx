import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [spaces, setSpaces] = useState<string[]>(Array(9).fill("*"));
  const [gameOver, setGameOver] = useState(false);

  const sound = new Audio("/Winning_voice.mp3"); 
  const Draww = new Audio("/Draw_voice.mp3"); 
  const Defeat = new Audio("/Defeat_voice.mp3");

  const [winsX, setWinsX] = useState(0);
  const [winsO, setWinsO] = useState(0);

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
    return combinates.some((combinat) =>
      combinat.every((index) => arr[index] === player)
    );
  };

  const makeMove = (index: number, currentArr: string[]) => {
    const newArr = currentArr.map((s, i) => (i === index ? "O" : s));
    setSpaces(newArr);

    if (check(newArr, "O")) {
      if ("vibrate" in navigator) navigator.vibrate(3000); 
      Defeat.play();
      setWinsO(winsO + 1); 
      toast.error("Keyingi safar yaxshiroq harakat qiling ✌️", {
        autoClose: 3000,
      });
      setGameOver(true);
      setTimeout(restart, 3000);
    } else if (!newArr.includes("*")) {
      if ("vibrate" in navigator) navigator.vibrate(200);
      Draww.play(); // Durrang paytda ovoz
      toast.info("Yaxshiroq harakat qiling 😊", { autoClose: 3000 });
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
      sound.play(); 
      setWinsX(winsX + 1); 
      toast.success("Qoyilmaqom! Siz eng zo'risiz 😎!", { autoClose: 2500 });
      setGameOver(true);
      setTimeout(restart, 2000);
      return;
    }

    if (!updated.includes("*")) {
      if ("vibrate" in navigator) navigator.vibrate(200);
      Draww.play();
      toast.info("Durrang!", { autoClose: 2000 });
      setGameOver(true);
      setTimeout(restart, 2000);
      return;
    }

    setTimeout(() => comp(updated), 400);
  };

  return (
    <div className="container bg-gray-950 min-h-screen text-white">
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-amber-200 text-center">
          Tic Tac Toe
        </h1>

        <div className="mb-4 text-lg flex gap-7">
          <p className="text-green-500 text-3xl font-bold">X: {winsX}</p>
          <p className="text-red-500 text-3xl font-bold">O: {winsO}</p>
        </div>

        <div className="w-full max-w-[400px] grid grid-cols-3 border rounded overflow-hidden shadow-lg">
          {spaces.map((s, i) => (
            <div
              key={i}
              onClick={() => fill(i)}
              className={`flex items-center justify-center text-[3rem] sm:text-[4rem] aspect-square border cursor-pointer transition-all duration-300
              ${
                s === "X"
                  ? "text-green-500 font-bold"
                  : s === "O"
                  ? "text-red-500 font-bold"
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








