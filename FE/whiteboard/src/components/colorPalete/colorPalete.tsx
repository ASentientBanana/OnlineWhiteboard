import React from 'react';
import {Color} from './Color';
import './ColorPalete.css';




export const ColorPalete = ()=>{
    const colors:string[] = ["#FF0000","#0000FF","#00FF00","#FF00BF","#2EFEF7","#6E6E6E","#000000","#FFFFFF"];
    return(
        <div className="color-palete-container col s6">
            {colors.map((color,index)=>(<Color color={color} key={index}/>))}
        </div>
    );
}
