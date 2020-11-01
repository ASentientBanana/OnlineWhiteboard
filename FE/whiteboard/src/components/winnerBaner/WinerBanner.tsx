import React,{useContext, useEffect} from 'react';
import {WinnerBannerContext} from '../../contexts/WinnerBannerProvider';
import {NameContext} from '../../contexts/NameProvider';
const WinnerBanner = () =>{
  const [winner,setWinner] = useContext(WinnerBannerContext);
  const [name,setName] = useContext(NameContext);
  useEffect(()=>{    
  },[winner]);
  const win = ():string =>{
    if(winner !== ''){
      if(winner === name) {return `YOU WIN !!!`}
    else{
      return `${winner} WINS!! ` 
    }
    } else{
      return ''
    }
  }
    return(
        <div className='container'> 
        <h1 className="s12 center ">{win()}</h1>
      </div>
    )
}
export default WinnerBanner;

