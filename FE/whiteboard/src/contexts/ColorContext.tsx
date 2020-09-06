import React , {createContext, useState} from 'react';


export const ColorContext = createContext<any>("");


export const ColorProvider = (props:any)=>{

    const [color,setColor] = useState("#000000")
    return(
        <ColorContext.Provider value={[color,setColor]}>
        {props.children}
        </ColorContext.Provider>
    )
}
