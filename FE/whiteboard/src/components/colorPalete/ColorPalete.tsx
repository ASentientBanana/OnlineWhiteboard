import React from 'react';
import {Color} from './Color';
import './ColorPalete.css';




export const ColorPalete = ()=>{
    const colors:string[] = ["#000000","#FFFFFF","#7e7e81","#ff3333","#2a6f41","#3d3df5","#ffcc66","#d65c99",];
    return(
        <div className="color-palete-container col s6">
            {colors.map((color,index)=>(<Color color={color} key={index}/>))}
        </div>
    );
}
