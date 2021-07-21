import React, { useEffect, MouseEvent,createRef, useRef, useContext, useState, InputHTMLAttributes, MutableRefObject } from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import WhiteboardBuilder from './util/WhiteboardBuilder'
import WhiteboardFacade from './util/facadeWhiteboard';
import Tools from "../tools/Tools";
import { Link } from 'react-router-dom';
import WhiteboardUtility from './whiteboardF'
import syncToSocket from '../../util';
import { useParams } from "react-router-dom";
type props ={
  nameInfo:{
    userName:string,
    roomName:string | null
  };
  socket:SocketIOClient.Socket;
}

export const Whiteboard = ({ nameInfo,socket }: props) => {
  const canvasRef = createRef<HTMLCanvasElement>()
  // const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const isDrawing = useRef<boolean>()
  const [whiteboard,setWhiteboard] = useState<WhiteboardUtility>();
  // new WhiteboardBuilder(canvasRef.current).withHeight(500).withWidth(500).withBackgroundColor('red').build()
  // const [socket,setSocket] = useState<SocketIOClient.Socket>()
  const getOffset = (// metoda za racunjane offseta canvasa da u odnosu na stranu da ne bi bilo ofseta kada se crta
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement
  ): number[] => {
    const { scrollX, scrollY } = window;
    const offsetX = clientX - canvas.offsetLeft + scrollX;
    const offsetY = clientY - canvas.offsetTop + scrollY;
    return [offsetX-16, offsetY-16] //fixes the offset
  }
  useEffect(()=>{
    // if(!socket) setSocket(getSocket())
    if(canvasRef.current) setWhiteboard(new WhiteboardUtility(canvasRef.current))
  },[])

  socket?.on("draw", (e: any) => { //salje se draw event serveru
    whiteboard?.drawRemote(e);
  });
  socket?.on("moveBrush", (e: any) => { //salje se draw event serveru
    whiteboard?.moveBrush(e.x,e.y);
  });

  const onMouseDownHandler = (e:MouseEvent<HTMLCanvasElement>)=>{
    isDrawing.current = true;
    const [x,y] = getOffset(e.clientX,e.clientY,canvasRef.current!);
    whiteboard?.moveBrush(x,y);
    socket?.emit('moveBrush',{x,y})
  }
  const onMouseMoveHandler = (e:MouseEvent<HTMLCanvasElement>)=>{
    if (!isDrawing.current) return;
            const [x,y] = getOffset(e.clientX,e.clientY,canvasRef.current!);
            whiteboard?.drawLocal(x,y)
            socket?.emit('draw',{x,y,lineWidth:1,lineCap:'round',strokeStyle:'white'})
  }
  // onMouseMoveHandler
  return (
    <div>
      <div
        className="col s12 m12 l12 whiteboard-container"
        ref={null}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDownHandler}
          onMouseUp={() => {isDrawing.current = false }}
          onMouseLeave={(e) => { }}
          onMouseMove={(e)=>{
            socket?.emit('drawing',{userInfo:nameInfo,drawingData:{}})
          }}
          height='600'
          width='800'
        ></canvas>
      </div>
      <Tools // Ovde prosledjujemo parametre komponenti tools da bi imala pristup
        canvasContext={() => { }}
        brushSize={0}
        paintCanvas={() => { }}
        saveCanvas={() => { }}
        setDrawMode={(mode: number) => { }}
        saveCanvasToDB={() => { }}
      />
      <div>
        <div className='gallery-btn-div'>
          <Link to={`${nameInfo.userName}/gallery`} className="waves-effect waves-light btn "><i className="material-icons center">burst_mode</i>gallery</Link>
        </div>
        <div className="col s12 word-input">
          Write what you are drawing here:
            <div className="input-field inline">
            <input id="drawing_word" type="text" className="validate" ref={null} />
            <span className="helper-text" data-error="wrong" data-success="right">Owner only</span>
            <a className="waves-effect waves-light btn submit-word-btn" onClick={() => { }}><i className="material-icons left">import_contacts</i>Submit word</a>
          </div>
        </div>
      </div>
    </div>
  );
};
