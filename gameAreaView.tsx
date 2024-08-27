import { useState, useEffect } from "preact/hooks";
import * as State from "./state";

const GameAreaView = () => {
  const [focused, setFocused] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const update = () => {
    if (State.isGameSelected.value) {
      const currentGame = State.all()[State.selectedGameIndex.value];
      if (State.invalidInput.value || currentGame.numWords < 0 || currentGame.numWords > 9999) {
        setInvalidMessage("INVALID GAME PARAMETERS!");
        setBackgroundColor("#ffcbd1");
        State.numWordsChanged.value = false;
        State.fontSizeChanged.value = false;
        return;
      }
      else {
        setInvalidMessage(null);
      }

      const cWords = currentGame.completedWords;

      if (cWords === currentGame.numWords) {
        setBackgroundColor("#ECFFDC");
      } else {
        setBackgroundColor("white");
      }
      updateWords();

    } else {
      setInvalidMessage(null);
      setBackgroundColor("white");
    }
    State.numWordsChanged.value = false;
    State.fontSizeChanged.value = false;
    State.currGamesChanged.value = false;
  };

  const updateWords = () => {
    const currentGame = State.all()[State.selectedGameIndex.value];
    if (!currentGame) return;
    var { words, focusedIndex } = currentGame;

    if (!State.redOutline.value) { 
      setFocused(false);
      currentGame.giveOutline = false;
      State.redOutline.value = true;
    }

    return words.map((word: any, index: any) => {
      let wordBackgroundColor = "white";
      let wordBorder = "none";

      if (currentGame.checkWords[index]) {
        wordBackgroundColor = "lightgreen";
      } else if ((index === focusedIndex && currentGame.giveOutline) ||
                (index === focusedIndex && State.keepOutline.value)) {
        wordBackgroundColor = "yellow";
        wordBorder = "2px solid red";
        setFocused(true);
      } else if (index === focusedIndex) {
        wordBackgroundColor = "yellow";
      }

      if (hoveredIndex === index) {
        wordBackgroundColor = "lightyellow";
        wordBorder = "2px solid lightpink";
      }

      if (focusedIndex === index && currentGame.giveOutline) {
        wordBackgroundColor = "yellow";
        wordBorder = "2px solid red";
      }

      const handleMouseEnter = () => {
        if (currentGame.completedWords !== currentGame.numWords) {
          setHoveredIndex(index);
        }
      };

      const handleMouseLeave = () => {
        setHoveredIndex(null);
        if (currentGame.completedWords !== currentGame.numWords) {
          if (currentGame.checkWords[index]) {
            wordBackgroundColor = "lightgreen";
            wordBorder = "none"
          } else if (index === focusedIndex && focused) {
            wordBackgroundColor = "yellow";
            wordBorder = "2px solid red";
          } else if (index === focusedIndex) {
            wordBackgroundColor = "yellow";
            wordBorder = "none"
          } else {
            wordBackgroundColor = "white";
            wordBorder = "none"
          }
        }
      };

      const handleWordClick = () => {
        setFocused(false);
        if (currentGame.completedWords !== currentGame.numWords) {
          focusedIndex = index;
          State.updateFocusedText(index, State.selectedGameIndex.value);
        }
      };

      return (
        <div
          className="wordContainer"
          onClick={handleWordClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            style={{
              fontSize: `${currentGame.fontSize}pt`,
              padding: "10px",
              display: "inline-block",
              boxSizing: "border-box",
              backgroundColor: wordBackgroundColor,
              border: wordBorder,
            }}
          >
            {word}
          </span>
        </div>
      );
    });
  };

  useEffect(() => {
    update();
  }, [State.isGameSelected.value, 
      State.invalidInput.value, 
      State.selectedGameIndex.value, 
      State.guessWord.value, 
      State.currGames.value,
      State.currGamesChanged.value,
      State.numWordsChanged.value,
      State.fontSizeChanged.value,]
  );

  return (
    <div className="gameArea" style={{ backgroundColor }}>
      {invalidMessage && (
        <label className="invalidMessage">{invalidMessage}</label>
      )}
      {
      State.isGameSelected.value && 
      !State.invalidInput.value && 
      State.all()[State.selectedGameIndex.value].numWords >= 0 && 
      State.all()[State.selectedGameIndex.value].numWords <= 9999 && 
      updateWords()
      }
    </div>
  );
};

export default GameAreaView;
