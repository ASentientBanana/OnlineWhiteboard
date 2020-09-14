import React , {createContext, useState} from 'react';


export const WinnerBannerContext = createContext<any>("");


export const WinnerBannerProvider = (props:any)=>{

    const [winner,setWinner] = useState("");
    return(
        <WinnerBannerContext.Provider value={[winner,setWinner]}>
        {props.children}
        </WinnerBannerContext.Provider>
    )
}

