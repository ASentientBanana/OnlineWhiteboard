import React from 'react';
import {Color} from './Color';
import './ColorPalete.css';




export const ColorPalete = ()=>{
    const colors:string[] = ["#000000","#FFFFFF","#7e7e81","#ff0009","#00ff0c","#0008ff","#ffe414","#19bae6",];
    return(
        <div className="color-palete-container col s6">
            {colors.map((color,index)=>(<Color color={color} key={index}/>))}
        </div>
    );
}
