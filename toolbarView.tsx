import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import * as State from "./state";

const ToolbarView = () => {
  const addGameDisabled = useSignal(false);
  const deleteGameDisabled = useSignal(true);
  const clearGameDisabled = useSignal(true);
  const undoDisabled = useSignal(true);
  const redoDisabled = useSignal(true);

  const update = () => {
    const numGames = State.numGames.value;
    const isGameSelected = State.isGameSelected.value;
    const selectedGameIndex = State.selectedGameIndex.value;
    
    addGameDisabled.value = numGames >= 19;
    deleteGameDisabled.value = numGames < 0; 
    clearGameDisabled.value = numGames < 0;
    if (isGameSelected && selectedGameIndex !== -1 && numGames >= 0) {
        const selectedGame = State.currGames.value[selectedGameIndex];
        const undoManager = selectedGame.undoManager;
        undoDisabled.value = !undoManager.canUndo;
        redoDisabled.value = !undoManager.canRedo;
    } else {
        undoDisabled.value = true;
        redoDisabled.value = true;
    }
  };

  useEffect(() => {
    update();
  }, [State.numGames.value, 
      State.isGameSelected.value, 
      State.selectedGameIndex.value,
      State.currGamesChanged.value,
      State.numWordsChanged.value,
      State.fontSizeChanged.value,
      State.guessWord.value]
  );

  const handleAddGame = () => State.addGame();
  const handleDeleteGame = () => State.deleteGame();
  const handleClearGames = () => State.clearGames();
  const handleUndo = () => State.undo();
  const handleRedo = () => State.redo();
  const handleLanguageChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    State.wordsLang.value = select.value;
    State.translateAllWords(select.value);
  }

  return (
    <div
      id="Toolbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flex: "1 1 auto",
          justifyContent: "left",
          width: "50%",
          height: "100%",
          flexFlow: "row",
          alignItems: "stretch"
        }}
      >
        <button
          disabled={addGameDisabled.value}
          onClick={handleAddGame}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Add Game
        </button>
        <button
          disabled={deleteGameDisabled.value}
          onClick={handleDeleteGame}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Delete Game
        </button>
        <button
          disabled={clearGameDisabled.value}
          onClick={handleClearGames}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Clear Games
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flex: "1 1 auto",
          justifyContent: "right",
          width: "50%",
          height: "100%",
          flexFlow: "row",
          alignItems: "stretch"
        }}
      >
        <button
          disabled={undoDisabled.value}
          onClick={handleUndo}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Undo
        </button>
        <button
          disabled={redoDisabled.value}
          onClick={handleRedo}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Redo
        </button>
        <select
          onChange={handleLanguageChange}
          style={{ width: "150px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <option value="English">English</option>
          <option value="Français">Français</option>
        </select>
      </div>
    </div>
  );
};

export default ToolbarView;
