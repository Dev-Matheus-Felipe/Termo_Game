import { useEffect, useState, type Dispatch } from "react";

type State = {
    board: string[],
    index: number
}

const LINE_LENGTH = 5;
const WORD_TARGET = "MIOJO"


export default function App(){
    const [state ,setState] = useState<State>({
        board: Array(6).fill(""),
        index: 0
    })

    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        
        const TypeHandler = (event: KeyboardEvent) => {
            const keyTest = /^[a-zA-Z]$/;
            const key = event.key;

            if(state.index >= 6 || gameOver){
                window.removeEventListener("keydown", TypeHandler);
                return;
            }

            setState( (prev) => {
                const newBoard = [...prev.board];
                const currentIndex = prev.index;


                switch(key){
                    case "Enter":
                        if(newBoard[currentIndex].length === LINE_LENGTH)
                            return {...prev, index: currentIndex + 1};
                        
                        return prev;

                    case "Backspace":
                        if(newBoard[currentIndex].length > 0){
                            newBoard[currentIndex] = newBoard[currentIndex].slice(0,-1);
                            return {...prev, board: newBoard};
                        }

                        return prev;

                    default:
                        if(keyTest.test(key) && newBoard[currentIndex].length < LINE_LENGTH){
                            newBoard[currentIndex] = newBoard[currentIndex] + key.toLocaleUpperCase();
                            return {...prev, board: newBoard};
                        }

                        return prev;
                }
            })
        }

        window.addEventListener("keydown",TypeHandler);
        return () => window.removeEventListener("keydown", TypeHandler);
    },[state.index, gameOver])


    return (
        <div className="container">
            {
                state.board.map((word: string, index: number ) => (
                    <Line key={index} word={word} setGameOver={setGameOver} index={state.index > index}  />
                ))
            }
        </div>
    )
}


const SetColors = (word: string, index: boolean) => {
    if(!index || word.length !== LINE_LENGTH){
        return Array(LINE_LENGTH).fill("white");
    }

    const result = Array(LINE_LENGTH).fill("gray");
    const targetLetters = WORD_TARGET.split("");

    for (let i = 0; i < LINE_LENGTH; i++) {
        if (word[i] === WORD_TARGET[i]) {
        result[i] = "green";
        targetLetters[i] = "";
        }
    }

    for (let i = 0; i < LINE_LENGTH; i++) {
        if (result[i] === "green") continue;

        const idx = targetLetters.indexOf(word[i]);
        if (idx !== -1) {
        result[i] = "yellow";
        }
    }

    return result;
}

function Line({
    word,
    setGameOver,
    index
} : {
    word: string,
    setGameOver: Dispatch<React.SetStateAction<boolean>>,
    index: boolean
}){

    const line:string[]  = [];

    for(let i = 0; i < LINE_LENGTH; i++)
        line.push(word[i] ?? "");

    const colors = SetColors(word, index);

    useEffect(() => {
        if(colors.every(e => e === "green"))
            setGameOver(true);
    },[index])

    return (
        <div className="line_container">
            {
                line.map((l: string, index: number) => (
                    <div 
                        key={index} 
                        style={{backgroundColor:colors[index]}}
                        className="line">
                        {l}
                    </div>
                ))
            }
        </div>
    )
}