import { useEffect } from "preact/hooks";
import NumWordsView from "./numWordsView";
import FontSizeView from "./fontSizeView";
import * as State from "./state";

const GamePropertiesInputView = () => {
  const update = () => {
    //
  };

  return (
    <div className="gamePropertiesInput">
      <FontSizeView />
      <NumWordsView />
    </div>
  );
};

export default GamePropertiesInputView;
