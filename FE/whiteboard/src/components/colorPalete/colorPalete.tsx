import React from 'react';
import {Color} from './color';
import './colorPalete.css';




export const ColorPalete = ()=>{
    const colors:string[] = ["#FF0000","#0000FF","#00FF00","#FF00BF","#2EFEF7","#6E6E6E","#000000","#FFFFFF"];
    return(
        <div className="color-palete-container">
            {colors.map(color=>(<Color color={color}/>))}
        </div>
    );
}
