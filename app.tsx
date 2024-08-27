import ToolbarView from "./toolbarView";
import GameAreaView from "./gameAreaView";
import GameConsoleView from "./gameConsoleView";
import GameListManagerView from "./gameListManagerView";

export default function App() {
  return (
    <div id="root" className="flex flex-col h-screen bg-whitesmoke">
      <ToolbarView />
      <div id="body" className="flex flex-grow w-full h-full">
        <div id="left" className="flex flex-col w-2/3">
          <GameAreaView className="flex-1 bg-white border-black" />
          <GameConsoleView className="h-1/3 bg-white border-black" />
        </div>
        <div id="right" className="w-1/3 flex flex-col">
          <GameListManagerView className="flex-1 bg-whitesmoke border-black" />
        </div>
      </div>
    </div>
  );
};
