import React, { useContext } from 'react';
import {ColorContext} from '../../contexts/ColorContext';

type ColorProps ={
    color:string
}
export const Color = ({color}:ColorProps)=>{
    const [currColor,setCurrColor] = useContext(ColorContext); 
    const changeColor = () =>{
        setCurrColor(color);
        console.log(color);
    }

    return(
        <div className="color-box" style={{"backgroundColor": color}} onClick={changeColor}></div>
    );

}

