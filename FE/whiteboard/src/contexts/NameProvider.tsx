import React , {createContext, useState} from 'react';


export const NameContext = createContext<any>("");


export const NameProvider = (props:any)=>{

    const [name,setName] = useState("");
    return(
        <NameContext.Provider value={[name,setName]}>
        {props.children}
        </NameContext.Provider>
    )
}

