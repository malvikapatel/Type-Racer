import { useEffect, useState } from "preact/hooks";
import GameView from "./gameView"; 
import * as State from "./state";

const GameListManagerView = () => {
  const [gamesList, setGamesList] = useState<number[]>([]);

  const update = () => {
    if (State.addedGame.value) {
      setGamesList((prevGamesList: any) => [
        ...prevGamesList,
        State.numGamesListManager.value, 
      ]);
      State.addedGame.value = false;
    }
    if (State.deletedGame.value) {
      setGamesList((prevGamesList: any[]) =>
        prevGamesList.filter((_: any, index: any) => index !== State.deletedGameIndex.value)
      );
      State.deletedGame.value = false;
    }
    if (State.clearedGames.value) {
      setGamesList([]);
      State.clearedGames.value = false;
    }
  };

  useEffect(() => {
    update();
  }, [State.addedGame.value, State.deletedGame.value, State.clearedGames.value]);

  return (
    <div className="gameListManager">
      {gamesList.map((gameID: number) => (
        <GameView key={gameID} gameID={gameID} />
      ))}
    </div>
  );
};

export default GameListManagerView;
