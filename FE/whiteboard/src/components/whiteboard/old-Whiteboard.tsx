import React, { useEffect, createRef, useContext, useState, InputHTMLAttributes } from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import WhiteboardBuilder from './util/WhiteboardBuilder'
import WhiteboardFacade  from './util/facadeWhiteboard';
import Tools from "../tools/Tools";
import { Link } from 'react-router-dom';

export const Whiteboard = ({ socket, name }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const drawingWordRef = createRef<HTMLInputElement>();
  const [color, setColor] = useContext(ColorContext);
  const [lineWidth, setLineWidth] = useState(1);
  const [myCanvas, setMyCanvas] = useState<WhiteboardFacade>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<number>(0);
  const [shapeStartPositions,setStartPositions] = useState<number[]>();

  let tmp: WhiteboardFacade;
  useEffect(() => {
    socket.emit('set_name', name) // salje se serveru ime preko soketa
    if (canvasRef.current && whiteboardContainer.current)
    if(myCanvas === undefined) setMyCanvas(new WhiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .withBackgroundColor("#ebe4e4")
        .build());// Ovo je poziv buildera koji ce da setuje potrebne stvari canvasu
    //   if(myCanvas === undefined)
    // ^^^^ ovo je provera da li postoji myCanvas, moramo ovo da proverimo jer je asynhrono i ako ne postoji komponenta se renderuje ponovo
    socketListenerEvents();

    
  }, [myCanvas]);

  const socketListenerEvents = ()=>{
    socket.on('isOwner', (e: number) => {// is owner event se aktivira ako server posalje is oWner i setuje da si owner...
      if (e === 200) {
        setIsOwner(true);
      }
    });
    socket.on("draw", (e: any) => { //salje se draw event serveru 
      console.log('DD');
      draw(e, false, true);
    });
    socket.on("draw-shape", (e: any) => { //salje se draw-shape event serveru 
      serverShapeHandler(e);
    });
    socket.on("reset-line", (e: number[]) => {
      const [positionX, positionY] = e;
      myCanvas?.ctx?.moveTo(positionX, positionY);
    })
  }

  const startPos = (e: any) => {// ovo se poziva kada se kliken na canvas
    myCanvas?.clearShapeArray()
    setIsClicked(true);
    setDrawing(true);
    myCanvas?.setCanvasImageData();
    if(drawMode != 0 ) {
      localShapeHandler(e); 
      const [offsetX, offsetY] = getOffset(e.clientX, e.clientY, myCanvas!.canvas);
      setStartPositions([offsetX,offsetY])
    }
  };

  const endPos = (e: any) => {// ovo se poziva kada se zavrsi  klik na canvas
    if(!drawing) return;
    setIsClicked(true);
    myCanvas?.clearShapeArray();
    if(shapeStartPositions){
      const startX = shapeStartPositions[0];
      const startY = shapeStartPositions[1]
      const [endOffsetX, endOffsetY] = getOffset(e.clientX, e.clientY, myCanvas!.canvas);
      socket.emit('draw-shape',{startX,startY,endOffsetX, endOffsetY,color,lineWidth,shape:drawMode});
    }
      // socket.emit("reset-line", [offsetX, offsetY])
      setDrawing(false);
      setIsClicked(false);
  };

const localShapeHandler = (drawEvent:any) => {
  if(!drawing) return;
  const [endOffsetX, endOffsetY] = getOffset(drawEvent.clientX, drawEvent.clientY, myCanvas!.canvas);
  if(shapeStartPositions) myCanvas?.drawShape(shapeStartPositions[0],shapeStartPositions[1],endOffsetX, endOffsetY,{color,lineWidth,shape:drawMode,isLocal:true});
}

const serverShapeHandler = (drawShapeEvent:any) => {
  const options:any = {}
  options["color"] = drawShapeEvent.color;
  options["lineWidth"] = drawShapeEvent.lineWidth;
  options["shape"] = drawShapeEvent.shape;
  options["isLocal"] = false;
  myCanvas?.drawShape(drawShapeEvent.startX,drawShapeEvent.startY,drawShapeEvent.endOffsetX,drawShapeEvent.endOffsetY,options);
}
  const getOffset = (// metoda za racunjane offseta canvasa da u odnosu na stranu da ne bi bilo ofseta kada se crta
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement
  ): number[] => {
    const { scrollX, scrollY } = window;
    const offsetX = clientX - canvas.offsetLeft + scrollX;
    const offsetY = clientY - canvas.offsetTop + scrollY;
    return [offsetX, offsetY]
  }
  const draw = (e: React.MouseEvent<HTMLCanvasElement>,isLocal: boolean,isOwner: boolean) => { // funkcija za crtanje
    if (isLocal) {
      isOwner = true;
      if (!drawing || !isClicked) return;
      const [offsetX, offsetY] = getOffset(e.clientX, e.clientY, myCanvas!.canvas);
      let data: any;
      if (drawMode === 0) data = myCanvas!.draw(offsetX, offsetY, { color, lineWidth, lineCap: 'round' });
      if(data) data.drawMode = drawMode;
      if(drawMode == 0) socket.emit("draw", data);
    }
    else {
      if(myCanvas){
        console.log('cloud');
        const { clientX, clientY, color, lineWidth }: any = e;
        myCanvas.draw(clientX, clientY, { color, lineWidth, lineCap: 'round' });//ako se crta cetkicom tj samo linija poziva se ovo
      }
    }
  }
  const saveCanvasToDB = () => {
    const image = myCanvas?.saveWhiteboard();
    socket.emit("save-image-to-database", { image, userName: name })
  }
  const submitWord = () => { // salje se rec koju mora da pogodi neko
    if (drawingWordRef.current?.value !== "" && drawingWordRef.current) {
      socket.emit("update-word", drawingWordRef.current.value);
      drawingWordRef.current.value = "";
    }
  }



  
  return (
    <div>
      <div
        className="col s12 m12 l12 whiteboard-container"
        ref={whiteboardContainer}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startPos}
          onMouseUp={endPos}
          onMouseLeave={(e) => {
            if(drawing){
              endPos(e);
              setDrawing(false);
            }
          }}
          onMouseMove={e =>{
          if(drawMode === 0) draw(e, true, isOwner);
          if(drawMode !== 0) localShapeHandler(e)  
        }}
        ></canvas>
      </div>
      <Tools // Ovde prosledjujemo parametre komponenti tools da bi imala pristup  
        canvasContext={()=>myCanvas?.clearCanvas()}
        brushSize={setLineWidth}
        paintCanvas={()=>myCanvas?.paintCanvas(color)}
        saveCanvas={()=>myCanvas?.saveWhiteboard()}
        setDrawMode={(mode:number)=>setDrawMode(mode)}
        saveCanvasToDB={saveCanvasToDB}
      />
      <div>
        <div className='gallery-btn-div'>
          <Link to={`${name}/gallery`} className="waves-effect waves-light btn "><i className="material-icons center">burst_mode</i>gallery</Link>
        </div>
        <div className="col s12 word-input">
          Write what you are drawing here:
            <div className="input-field inline">
            <input id="drawing_word" type="text" className="validate" ref={drawingWordRef} />
            <span className="helper-text" data-error="wrong" data-success="right">Owner only</span>
            <a className="waves-effect waves-light btn submit-word-btn" onClick={submitWord}><i className="material-icons left">import_contacts</i>Submit word</a>
          </div>
        </div>
      </div>
    </div>
  );
};