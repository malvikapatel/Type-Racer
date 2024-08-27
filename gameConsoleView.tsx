import { useEffect, useRef } from "preact/hooks";
import { computed, useSignal } from "@preact/signals";
import GamePropertiesInputView from "./gamePropertiesInputView";
import * as State from "./state";

const GameConsoleView = () => {
  const gameSelected = useSignal(false);
  const completedWords = useSignal(0);
  const numWords = useSignal(0);
  const guessWord = useSignal(false);
  const invalidInput = useSignal(false);
  const disabled = useSignal(true);

  const textInputRef = useRef<HTMLInputElement>(null);
  const gameProgressRef = useRef<HTMLDivElement>(null);

  const currentGame = computed(() => {
    return State.isGameSelected.value
      ? State.all()[State.selectedGameIndex.value]
      : null;
  });

  const update = () => {
    if (State.isGameSelected.value) {
      const currentGame = State.all()[State.selectedGameIndex.value];
      const cWords = currentGame.completedWords;
      const nWords = currentGame.numWords;

      completedWords.value = cWords;
      numWords.value = nWords;
      gameSelected.value = true;

      if (cWords === nWords) {
        gameProgressRef.current!.innerText = "Game Completed!";
        textInputRef.current!.disabled = true;
        textInputRef.current!.style.backgroundColor = "#d3d3d3";
        disabled.value = false;
      } else {
        gameProgressRef.current!.innerText = `${cWords} / ${nWords} Words Matched`;
        textInputRef.current!.disabled = false;
        textInputRef.current!.style.backgroundColor = "white";
        disabled.value = false;
      }

      if (State.guessWord.value) {
        State.guessWord.value = false;
        textInputRef.current!.value = "";
      }

      if (State.invalidInput.value || currentGame.numWords < 0 || currentGame.numWords > 9999) {
        textInputRef.current!.disabled = true;
        textInputRef.current!.style.backgroundColor = "#d3d3d3";
        gameProgressRef.current!.innerText =
          "Invalid Num Words! Should be in 0 - 9999";
        State.invalidInput.value = false;
        disabled.value = true;
      }
    } else {
      gameProgressRef.current!.innerText = "Select / Add a game to Start!";
      textInputRef.current!.value = "";
      textInputRef.current!.disabled = true;
      textInputRef.current!.style.backgroundColor = "#d3d3d3";
      gameSelected.value = false;
      disabled.value = true;
    }
    State.numWordsChanged.value = false;
    State.fontSizeChanged.value = false;
    State.currGamesChanged.value = false;
  };

  useEffect(() => {
    update();
  }, [State.isGameSelected.value, 
      State.guessWord.value, 
      State.invalidInput.value, 
      State.currGames.value,
      State.numWordsChanged.value,
      State.fontSizeChanged.value,
      State.currGamesChanged.value,
      currentGame, 
      guessWord, 
      invalidInput]
  );

  const handleResetClick = () => {
    if (State.all().length > 0 && State.isGameSelected.value) {
      State.resetButtonPressed(
        State.all()[State.selectedGameIndex.value].fontSize,
        State.all()[State.selectedGameIndex.value].numWords,
        State.all()[State.selectedGameIndex.value].gameID
      );
    }
  };

  const handleInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    State.checkWordInput(
      input.value,
      State.all()[State.selectedGameIndex.value].gameID
    );
  };

  return (
    <div className="gameConsole">
      <input
        ref={textInputRef}
        className="textInput"
        disabled
        onInput={handleInputChange}
      />
      <GamePropertiesInputView />
      <button
        className="resetButton"
        onClick={handleResetClick}
        disabled={disabled}
      >
        Reset Game
      </button>
      <div ref={gameProgressRef} className="gameProgress">
        {State.isGameSelected.value
          ? `${State.all()[State.selectedGameIndex.value].completedWords} / ${
            State.all()[State.selectedGameIndex.value].numWords
            } Words Matched`
          : "Select / Add a game to Start!"}
      </div>
    </div>
  );
};

export default GameConsoleView;
