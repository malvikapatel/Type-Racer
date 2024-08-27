import { signal, Signal } from '@preact/signals';
import { UndoManager, Command } from './undoManager';

// Interface for i18n words
export interface I18nWord {
    "en-CA": string;
    "fr-CA": string;
    [key: string]: string; // Index signature for dynamic keys
}

export type Game = {
    isSelected: boolean;
    gameID: number;
    completedWords: number; 
    words: string[];
    focusedIndex: number;
    completedIndex: number;
    checkWords: boolean[];
    giveOutline: boolean;
    fontSize: number;
    numWords: number;
    i18nWordArr: I18nWord[];
    undoManager: UndoManager;
    oldFontValue: number;
}

export var numGames: Signal<number> = signal(-1);
export var currGames: Signal<Game[]> = signal<Game[]>([]);
export var isGameSelected: Signal<boolean> = signal(false);
export var selectedGameIndex: Signal<number> = signal(-1);
export var addedGame: Signal<boolean> = signal(false);
export var deletedGame: Signal<boolean> = signal(false);
export var deletedGameIndex: Signal<number> = signal(-1);
export var clearedGames: Signal<boolean> = signal(false);
export var guessWord: Signal<boolean> = signal(false);
export var checkDeletedGames: Signal<boolean[]> = signal<boolean[]>([]);
export var numGamesListManager: Signal<number> = signal(-1);
export var invalidInput: Signal<boolean> = signal(false);
export var isSelectedGameFocused: Signal<boolean> = signal(false);
export var numWordsChanged: Signal<boolean> = signal(false);
export var fontSizeChanged: Signal<boolean> = signal(false);
export var currGamesChanged: Signal<boolean> = signal(false);
export var redOutline: Signal<boolean> = signal(true);
export var keepOutline: Signal<boolean> = signal(false);
export var wordsLang: Signal<String> = signal("English");

// Fetch i18n words from API
async function fetchI18nWords(numWords: number): Promise<I18nWord[]> {
    const response = await fetch(`/myWordsApi/i18nwords?numWords=${numWords}`);
    if (!response.ok) {
        throw new Error('Failed to fetch words');
    }
    return response.json();
}

function wordsTranslation() {
    currGames.value[selectedGameIndex.value].words = [];
    if (wordsLang.value === "English") {
        for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
            currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["en-CA"]);
        }
    }
    else {
        for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
            currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["fr-CA"]);
        }
    }
}

export async function addGame() {
    if (currGames.value.length < 20) {
        numGames.value = numGames.value + 1;
        numGamesListManager.value += 1;
        const i18nWordArr = await fetchI18nWords(20);
        var wordsArr = [];
        if (wordsLang.value === "English") {
            wordsArr = i18nWordArr.map((word: { [x: string]: any; }) => word["en-CA"]);
        }
        else {
            wordsArr = i18nWordArr.map((word: { [x: string]: any; }) => word["fr-CA"]);
        }
        const checkWords = Array(20).fill(false);
        const undoManager = new UndoManager();
        const newGame: Game = {
            isSelected: false,
            gameID: numGamesListManager.value,
            completedWords: 0,
            words: wordsArr,
            focusedIndex: 0,
            completedIndex: 0,
            checkWords: checkWords,
            giveOutline: false,
            fontSize: 16,
            numWords: 20,
            i18nWordArr: i18nWordArr,
            undoManager: undoManager,
            oldFontValue: 16
        };
        currGames.value = [...currGames.value, newGame];
        addedGame.value = true;
        checkDeletedGames.value.push(false);
    }
    else {
        numGames.value = 20;
    }
}

export function deleteGame() {
    if (currGames.value.length !== 0) {
        if (isGameSelected.value) {
            const id = currGames.value[selectedGameIndex.value].gameID;
            currGames.value = currGames.value.filter((t: { gameID: any; }) => t.gameID !== id);
            deletedGameIndex.value = selectedGameIndex.value;
            checkDeletedGames.value[id] = true;
            selectedGameIndex.value = -1;
            isGameSelected.value = false;
        }
        else {
            deletedGameIndex.value = currGames.value.length - 1;
            const id = currGames.value[deletedGameIndex.value].gameID;
            currGames.value = currGames.value.filter((t: { gameID: any; }) => t.gameID !== id);
            checkDeletedGames.value[id] = true;
            if (currGames.value.length == 0) {
                isGameSelected.value = false;
            }
        }
        --numGames.value;
        deletedGame.value = true;
    }
}

export function clearGames() {
    currGames.value = [];
    numGames.value = -1;
    selectedGameIndex.value = -1;
    isGameSelected.value = false;
    clearedGames.value = true;
    checkDeletedGames.value = [];
}

export async function resetButtonPressed(fontSizeVal: number, numWordsVal: number, gameID: number) {
    var oldGame = { ...currGames.value[selectedGameIndex.value] };

    currGames.value[selectedGameIndex.value].fontSize = fontSizeVal;
    currGames.value[selectedGameIndex.value].numWords = numWordsVal;
    currGames.value[selectedGameIndex.value].i18nWordArr = await fetchI18nWords(currGames.value[selectedGameIndex.value].numWords);
    currGames.value[selectedGameIndex.value].words = [];
    if (wordsLang.value === "English") {
        for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
            currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["en-CA"]);
        }
    }
    else {
        for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
            currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["fr-CA"]);
        }
    }
    var cWords = [];
    for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
        cWords.push(false);
    }
    currGames.value[selectedGameIndex.value].checkWords = cWords;
    currGames.value[selectedGameIndex.value].completedWords = 0;
    currGames.value[selectedGameIndex.value].focusedIndex = 0;
    currGames.value[selectedGameIndex.value].completedIndex = 0;

    var newGame = currGames.value[selectedGameIndex.value];

    currGames.value[selectedGameIndex.value].undoManager.execute({
        do: () => {
            currGames.value[selectedGameIndex.value] = newGame;
            wordsTranslation();
        },
        undo: () => {
            newGame = { ...currGames.value[selectedGameIndex.value] };
            currGames.value[selectedGameIndex.value] = oldGame;
            wordsTranslation();
        }
    } as Command);

    fontSizeChanged.value = true;
    numWordsChanged.value = true;
}

export function getGame(gameID: number): Game | undefined {
    return currGames.value.find((game: { gameID: number; }) => game.gameID === gameID);
}    

export function updateGameProgress(gameID: number, completedWords: number) {
    currGames.value[selectedGameIndex.value].completedWords = completedWords;
}

export function selectGame(gameID: number) {
    const selectedGame = currGames.value.find((t: { gameID: any; }) => t.gameID === gameID)
    const index = currGames.value.findIndex((t: { gameID: any; }) => t.gameID === gameID);
    if (!isSelectedGameFocused.value || selectedGame.isSelected === false) {
        currGames.value.forEach((game: { isSelected: boolean; }) => game.isSelected = false);
        if (selectedGame) {
            currGames.value[index].isSelected = true;
        }
        isGameSelected.value = true;
        selectedGameIndex.value = index;
        isSelectedGameFocused.value = true;
        currGamesChanged.value = true;
    } else {
        if (selectedGame) {
            currGames.value[index].isSelected = false;
        }
        isGameSelected.value = false;
        isSelectedGameFocused.value = false;
    }
}

export function all(): Game[] {
    // return a copy (avoids bugs if views try to edit)
    return [...currGames.value];
}

export function checkWordInput(text: string, gameID: number) {
    const oldGame = { ...currGames.value[selectedGameIndex.value] };

    var game = currGames.value[selectedGameIndex.value];
    if (game.giveOutline) {
        keepOutline.value = true;
        if (text.toLowerCase() === game.words[game.focusedIndex].toLowerCase()) {
            game.checkWords[game.focusedIndex] = true;
            game.completedWords += 1;
            game.focusedIndex = game.checkWords.findIndex((e: boolean) => e === false);
            guessWord.value = true;
            keepOutline.value = false;
        }
    } else {
        if (text.toLowerCase() === game.words[game.focusedIndex].toLowerCase()) {
            game.checkWords[game.focusedIndex] = true;
            game.completedIndex = game.focusedIndex + 1;
            game.completedWords += 1;
            game.focusedIndex = game.checkWords.findIndex((e: boolean) => e === false);
            guessWord.value = true;
            keepOutline.value = false;
        }
    }

    var newGame = game;

    if (guessWord.value === true) {
        currGames.value[selectedGameIndex.value].undoManager.execute({
            do: () => {
                currGames.value[selectedGameIndex.value] = newGame;
                currGames.value[selectedGameIndex.value].completedIndex -= 1;
                currGames.value[selectedGameIndex.value].checkWords[currGames.value[selectedGameIndex.value].completedIndex] = true;
                wordsTranslation();
            },
            undo: () => {
                newGame = { ...currGames.value[selectedGameIndex.value] };
                currGames.value[selectedGameIndex.value] = oldGame;
                currGames.value[selectedGameIndex.value].checkWords[currGames.value[selectedGameIndex.value].focusedIndex] = false;
                wordsTranslation();
            }
        } as Command);
    }
    redOutline.value = false;
}

export function setFontSize(fontSizeVal: number) {
    currGames.value[selectedGameIndex.value].fontSize = fontSizeVal;
    fontSizeChanged.value = true;
}

export function setFontSizeChange(fontSizeVal: number) {
    const oldGame = { ...currGames.value[selectedGameIndex.value] };

    currGames.value[selectedGameIndex.value].fontSize = fontSizeVal;
    currGames.value[selectedGameIndex.value].oldFontValue = fontSizeVal;

    var newGame = currGames.value[selectedGameIndex.value];

    currGames.value[selectedGameIndex.value].undoManager.execute({
        do: () => {
            currGames.value[selectedGameIndex.value] = newGame;
            wordsTranslation();
        },
        undo: () => {
            newGame = { ...currGames.value[selectedGameIndex.value] };
            currGames.value[selectedGameIndex.value] = oldGame;
            currGames.value[selectedGameIndex.value].fontSize = oldGame.oldFontValue;
            wordsTranslation();
        }
    } as Command);

    fontSizeChanged.value = true;
}

export async function setNumWords(numWordsVal: number, gameID: number) {
    const oldGame = { ...currGames.value[selectedGameIndex.value] };

    if (numWordsVal > 9999 || numWordsVal < 0) {
        invalidInput.value = true;
        currGames.value[selectedGameIndex.value].numWords = numWordsVal;
    }
    else {
        invalidInput.value = false;
        currGames.value[selectedGameIndex.value].numWords = numWordsVal;
        currGames.value[selectedGameIndex.value].i18nWordArr = await fetchI18nWords(currGames.value[selectedGameIndex.value].numWords);
        currGames.value[selectedGameIndex.value].words = [];
        if (wordsLang.value === "English") {
            for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
                currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["en-CA"]);
            }
        }
        else {
            for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
                currGames.value[selectedGameIndex.value].words.push(currGames.value[selectedGameIndex.value].i18nWordArr[i]["fr-CA"]);
            }
        }
        var cWords = [];
        for (var i = 0; i < currGames.value[selectedGameIndex.value].numWords; i++) {
            cWords.push(false);
        }
        currGames.value[selectedGameIndex.value].checkWords = cWords;
        currGames.value[selectedGameIndex.value].completedWords = 0;
        currGames.value[selectedGameIndex.value].focusedIndex = 0;
        currGames.value[selectedGameIndex.value].completedIndex = 0;
        numWordsChanged.value = true;
    }

    var newGame = currGames.value[selectedGameIndex.value];

    currGames.value[selectedGameIndex.value].undoManager.execute({
        do: () => {
            currGames.value[selectedGameIndex.value] = newGame;
            numWordsVal = currGames.value[selectedGameIndex.value].numWords;
            if (numWordsVal > 9999 || numWordsVal < 0) {
                invalidInput.value = true;
            }
            else {
                invalidInput.value = false;
            }
            wordsTranslation();
        },
        undo: () => {
            newGame = { ...currGames.value[selectedGameIndex.value] };
            currGames.value[selectedGameIndex.value] = oldGame;
            numWordsVal = currGames.value[selectedGameIndex.value].numWords;
            if (numWordsVal > 9999 || numWordsVal < 0) {
                invalidInput.value = true;
            }
            else {
                invalidInput.value = false;
            }
            wordsTranslation();
        }
    } as Command);
}

export function updateFocusedText(index: number, gameID: number) {
    const oldGame = { ...currGames.value[selectedGameIndex.value] };

    if (index === currGames.value[selectedGameIndex.value].focusedIndex) {
        currGames.value[selectedGameIndex.value].checkWords[index] = false;
        currGames.value[selectedGameIndex.value].focusedIndex = currGames.value[selectedGameIndex.value].checkWords.findIndex((e: boolean) => e === false);
        currGames.value[selectedGameIndex.value].giveOutline = false;
    } else {
        currGames.value[selectedGameIndex.value].focusedIndex = index;
        currGames.value[selectedGameIndex.value].giveOutline = true;
        if (currGames.value[selectedGameIndex.value].checkWords[index]) {
            currGames.value[selectedGameIndex.value].checkWords[index] = false;
            currGames.value[selectedGameIndex.value].completedWords -= 1;
        }
    }

    var newGame = currGames.value[selectedGameIndex.value];

    currGames.value[selectedGameIndex.value].undoManager.execute({
        do: () => {
            currGames.value[selectedGameIndex.value] = newGame;
            if (currGames.value[selectedGameIndex.value].undoManager.redoLen >= 0) {
                currGames.value[selectedGameIndex.value].giveOutline = true; 
            }
            wordsTranslation();
        },
        undo: () => {
            newGame = { ...currGames.value[selectedGameIndex.value] };
            currGames.value[selectedGameIndex.value] = oldGame;
            if (currGames.value[selectedGameIndex.value].undoManager.undoLen > 0) {
                currGames.value[selectedGameIndex.value].giveOutline = true; 
            }
            wordsTranslation();
        }
    } as Command);
    currGamesChanged.value = true;
}

export function translateAllWords(lang: string) {
    if (lang === "English") {
        for (var idx = 0; idx < currGames.value.length; idx++) {
            currGames.value[idx].words = [];
            for (var i = 0; i < currGames.value[idx].numWords; i++) {
                currGames.value[idx].words.push(currGames.value[idx].i18nWordArr[i]["en-CA"]);
            }
        }  
    }
    else if (lang === "Français") {
        for (var idx = 0; idx < currGames.value.length; idx++) {
            currGames.value[idx].words = [];
            for (var i = 0; i < currGames.value[idx].numWords; i++) {
                currGames.value[idx].words.push(currGames.value[idx].i18nWordArr[i]["fr-CA"]);
            }
        }   
    }
    currGamesChanged.value = true;
}

export function undo() {
    if (isGameSelected.value) {
        currGames.value[selectedGameIndex.value].undoManager.undo();
    }
    currGamesChanged.value = true;
}

export function redo() {
    if (isGameSelected.value) {
        currGames.value[selectedGameIndex.value].undoManager.redo();
    }
    currGamesChanged.value = true;
}

export function canUndo() {
    return currGames.value[selectedGameIndex.value].undoManager.canUndo;
}

export function canRedo() {
    return currGames.value[selectedGameIndex.value].undoManager.canRedo;
}
