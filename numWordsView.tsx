import { useEffect, useState } from "preact/hooks";
import * as State from "./state";

const NumWordsView = () => {
  const [numWords, setNumWords] = useState(20);
  const [isGameSelected, setIsGameSelected] = useState(false);

  const update = () => {
    if (State.isGameSelected.value) {
      setIsGameSelected(true);
      if (State.invalidInput.value) {
        setNumWords(State.all()[State.selectedGameIndex.value].numWords);
      } else {
        setNumWords(State.all()[State.selectedGameIndex.value].numWords);
      }
    } else {
      setNumWords(null);
      setIsGameSelected(false);
    }
    State.numWordsChanged.value = false;
    State.currGamesChanged.value = false;
  };

  useEffect(() => {
    update();
  }, [State.isGameSelected.value, 
      State.invalidInput.value, 
      State.numWordsChanged.value,
      State.currGamesChanged.value]
  );

  const handleInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9-]/g, "");
    input.value = value;

    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 9999) {
      setNumWords(parsedValue);
      State.setNumWords(
        parsedValue,
        State.all()[State.selectedGameIndex.value].gameID
      );
    } else if (value === "") {
      setNumWords(0);
      State.setNumWords(0, State.all()[State.selectedGameIndex.value].gameID);
    } else {
      setNumWords(parsedValue);
      State.setNumWords(
        parsedValue,
        State.all()[State.selectedGameIndex.value].gameID
      );
    }
  };

  return (
    <div className="numWordsView">
      <label>Num Words:</label>
      <input
        type="number"
        value={numWords}
        onInput={handleInputChange}
        step="1"
        disabled={!isGameSelected}
        style={{
          backgroundColor: State.invalidInput.value || numWords > 9999 || numWords < 0 ? "#ee6b6e" : ((isGameSelected) ? ("white") : ("#d3d3d3")),
          border: State.invalidInput.value || numWords > 9999 || numWords < 0 ? "2px solid red" : "1px solid black",
        }}
      />
    </div>
  );
};

export default NumWordsView;
