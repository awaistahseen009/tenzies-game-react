import React from "react"
import Dice from "./Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
export default function App(){
    function allRandomNumbers(){
        const newArray=[]
        for(let i=0;i<10;i++){
            newArray.push({value:Math.floor(Math.random()*6)+1,
            isHeld:false,
            id:nanoid()})
        }
        return newArray
    }
    function holdDice(id){
        setDiceState(prevState=>prevState.map((dice)=>{
               return dice.id==id ? {...dice,isHeld:!dice.isHeld}:dice
        }))
    }
    //States
    const [diceArray,setDiceState]=React.useState(allRandomNumbers())
    let [tenzies,setTenzies]=React.useState(false)
    const [time,setTime]=React.useState(0)
    const [startAgain,setStartAgain]=React.useState(false)
    let [bestRecord,setBestRecord]=React.useState(JSON.parse(localStorage.getItem("bestscore")) || 0)
    const [boolDice,setBoolDice]=React.useState(false)
  
    //End of state
    const allDiceArray=diceArray.map((dice)=>{
        
        return <Dice key={dice.id}value={dice.value} holdDice={()=>holdDice(dice.id)} id={dice.id} isHeld={dice.isHeld}/>
    })

//Effect

    React.useEffect(()=>{
        const allHeld=diceArray.every(dice=>dice.isHeld)
        const firstElement=diceArray[0].value
        const allValue=diceArray.every(dice=>dice.value==firstElement)
        if(allHeld && allValue){
            setTenzies(true)
            setStartAgain(true)
            // let timerFinal=bestRecord
            if(time < bestRecord){   
           setBestRecord(time)
            }
            else if(bestRecord==0){
           setBestRecord(time)                
            }
            localStorage.setItem("bestscore",JSON.stringify(bestRecord))
            
        }
    },[diceArray])
    let interval
    React.useEffect(()=>{
       if(!tenzies && boolDice)
       {interval=setInterval(()=>{
         setTime(prevTime=>prevTime+1)
        },1000)}       
    return ()=>clearInterval(interval)
    },[tenzies,boolDice,bestRecord])
    function resetBestScore(){
        setBestRecord(0)
        localStorage.setItem("bestscore",JSON.stringify(bestRecord))
    }
   function rollDice(){
       setBoolDice(true)
        if(!tenzies){
            setDiceState(prevState=>prevState.map((dice)=>{
            return dice.isHeld?dice : {value:Math.floor(Math.random()*6)+1,
            isHeld:false,
            id:nanoid()}
        }))
       
        }
        else {
              setTime(0)
            setStartAgain(false)
            setTenzies(false)
            setDiceState(allRandomNumbers())
        }
   }
    return (
        <main className="main">
        {tenzies && <Confetti 
        numberOfPieces={100}
        />}
        <h1>Welcome to Tenzies</h1>
        {tenzies ? <h2 className="won">You Won ! </h2> : <p>Click roll to roll the dices and click each dice to freeze and when all selected dices matches then you 'll win the game !</p>}
       <h2 className="timer">{time} sec</h2>
       <div className="dice-grid">
       {allDiceArray}
       </div>
       <button onClick={rollDice}>{tenzies?"Play Again":boolDice?"Roll":"Start Game"}</button>
        <h2 className="best">Best: {bestRecord} sec</h2>
        <button className="resetBestScore" onClick={resetBestScore}>Reset Score</button>
        </main>
    )
}