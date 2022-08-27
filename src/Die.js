import React from "react"
export default function Dice(props){
   const style={
       backgroundColor:props.isHeld ? "#51cf66" : "",
       color:props.isHeld?"#ffffff":""
   }
   return  <div className="dice" style={style}onClick={props.holdDice}>{props.value} </div>
}