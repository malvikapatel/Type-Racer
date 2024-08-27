import { useEffect, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import * as State from "./state";

const FontSizeView = () => {
  const [fontSizeVal, setFontSizeVal] = useState(16);
  const [fontSizeDisabled, setFontSizeDisabled] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#d3d3d3");

  const update = () => {
    if (State.isGameSelected.value) {
      const currentGame = State.all()[State.selectedGameIndex.value];
      const cWords = currentGame.completedWords;
      if (cWords === currentGame.numWords) {
        setFontSizeVal(currentGame.fontSize);
        setFontSizeDisabled(true);
        setBackgroundColor("#d3d3d3");
      } else {
        setFontSizeDisabled(false);
        setFontSizeVal(currentGame.fontSize);
        setBackgroundColor("white");
      }

      if (State.invalidInput.value || currentGame.numWords < 0 || currentGame.numWords > 9999) {
        setFontSizeDisabled(true);
      }
    } else {
      setFontSizeVal(16);
      setFontSizeDisabled(true);
      setBackgroundColor("#d3d3d3");
    }
    State.fontSizeChanged.value = false;
    State.currGamesChanged.value = false;
  };

  useEffect(() => {
    update();
  }, [State.isGameSelected.value, 
      State.invalidInput.value,
      State.fontSizeChanged.value,
      State.numWordsChanged.value,
      State.currGamesChanged.value,
      State.guessWord.value,]
  );

  const handleInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, "");
    const newFontSize = value === "" ? 0 : parseInt(value, 10);

    setFontSizeVal(newFontSize);
    State.setFontSize(newFontSize);
  };

  const handleInputChangeComplete = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, "");
    const newFontSize = value === "" ? 0 : parseInt(value, 10);

    setFontSizeVal(newFontSize);
    State.setFontSizeChange(newFontSize);
  };

  return (
    <div className="fontSizeView">
      <label>Font Size:</label>
      <input
        type="range"
        min="0"
        max="100"
        value={fontSizeVal}
        disabled={fontSizeDisabled}
        style={{ backgroundColor }}
        onInput={handleInputChange}
        onChange={handleInputChangeComplete}
      />
    </div>
  );
};

export default FontSizeView;
