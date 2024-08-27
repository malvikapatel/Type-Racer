import { useEffect, useState } from "preact/hooks";
import * as State from "./state";

interface GameViewProps {
  gameID: number;
}

const GameView = ({ gameID }: GameViewProps) => {
  const [game, setGame] = useState(() => State.getGame(gameID));
  const [isSelected, setIsSelected] = useState(false);

  const update = () => {
    const game = State.getGame(gameID);
    if (game && !State.checkDeletedGames.value[gameID]) {
      setIsSelected(State.isGameSelected.value && game.isSelected);
      setGame(game);
    }
    updateProgressBar();
    State.numWordsChanged.value = false;
    State.currGamesChanged.value = false;
    State.currGamesChanged.value = false;
  };

  useEffect(() => {
    update();
  }, [State.isGameSelected.value, 
      State.checkDeletedGames.value,
      State.guessWord.value,
      State.currGames.value,
      State.currGamesChanged.value,
      State.numWordsChanged.value,
      State.isSelectedGameFocused.value]
  );

  const updateProgressBar = () => {
    if (!game || State.invalidInput.value || !State.isGameSelected.value) {
      return (
        <div
          style={{ width: "100%", backgroundColor: "#d3d3d3", height: "100%" }}
        />
      );
    }

    const numWords = game.numWords;
    if (numWords === 0) {
      return (
        <div
          style={{
            width: "100%",
            backgroundColor: "lightgreen",
            height: "100%",
          }}
        />
      );
    }

    const ratio = game.completedWords / numWords;
    const completedWidth = `${ratio * 100}%`;
    const remainingWidth = `${(1 - ratio) * 100}%`;

    return (
      <>
        <div
          style={{
            width: completedWidth,
            backgroundColor: "lightgreen",
            height: "100%",
          }}
        />
        <div
          style={{
            width: remainingWidth,
            backgroundColor: "#d3d3d3",
            height: "100%",
          }}
        />
      </>
    );
  };

  const handleClick = () => {
    State.selectGame(gameID);
  };

  return (
    <div
      className="gameView"
      style={{ border: isSelected ? "2px solid red" : "1px solid black" }}
      onClick={handleClick}
    >
      <label
        className="gameIDLabel"
        style={{
          borderTop: isSelected ? "2px solid red" : "1px solid black",
          borderBottom: isSelected ? "2px solid red" : "1px solid black",
        }}
      >
        Game {gameID}
      </label>
      <div
        className="progressBar"
        style={{
          borderTop: isSelected ? "2px solid red" : "1px solid black",
          borderBottom: isSelected ? "2px solid red" : "1px solid black",
        }}
      >
        {updateProgressBar()}
      </div>
    </div>
  );
};

export default GameView;
