import React , {useEffect,createRef} from 'react';
import './Tools.css';
import {ColorPalete}  from '../colorPalete/ColorPalete';

interface tools  {
    canvasCtx:CanvasRenderingContext2D;
}
const Tools = ({canvasContext,brushSize}:any)=>{
    const sliderRef = createRef<HTMLInputElement>()
    useEffect(() => {
        if(sliderRef.current) {sliderRef.current.value = '1';
    }
    }, [])
    return(
        <div className='tool-container container'>
            <ColorPalete />
            <div>
                <button className="waves-effect waves-light btn col s6 clear-btn" onClick={()=>{
                canvasContext();
            }}>
                Clear Canvas
            </button>
                <input type="range" id="test5" min="1" max="60"onChange={e=>{
                    brushSize(e.target.value);
                }}
                ref={sliderRef} 
                />
            </div>
        </div>
    );
}
export default Tools;