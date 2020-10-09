import React, { useEffect, createRef, useContext, useState, InputHTMLAttributes } from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import whiteboardBuilder, { whiteboard } from "../../util/facadeWhiteboard";
import Tools from "../tools/Tools";
import { Link } from 'react-router-dom';

export const Whiteboard = ({ socket, name }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const drawingWordRef = createRef<HTMLInputElement>();
  const [color, setColor] = useContext(ColorContext);
  const [lineWidth, setLineWidth] = useState(1);
  const [myCanvas, setMyCanvas] = useState<whiteboard>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<string>('line');


  let tmp: whiteboard;
  useEffect(() => {
    socket.emit('set_name', name) // salje se serveru ime preko soketa

    socket.on('isOwner', (e: number) => {// is owner event se aktivira ako server posalje is oWner i setuje da si owner...
      if (e === 200) {
        setIsOwner(true);
      }
    });
    if (canvasRef.current && whiteboardContainer.current)
      tmp = new whiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .withBackgroundColor("#ebe4e4")
        .build();// Ovo je pozib buildera koji ce da setuje potrebne stvari canvasu
    setMyCanvas(tmp);
  }, []);

  const startPos = (e: any) => {// ovo se poziva kada se kliken na canvas
    myCanvas?.clearShapeArray()
    setIsClicked(true);
    setDrawing(true);
    myCanvas?.ctx?.beginPath();
    myCanvas?.setCanvasImageData();
    draw(e, true, isOwner);
  };

  const endPos = (e: any) => {// ovo se poziva kada se zavrsi  klik na canvas
    setIsClicked(true);
    setDrawing(false);
    myCanvas?.clearShapeArray();
    console.log(e);
    const [offsetX, offsetY] = getOffset(e.clientX, e.clientY, myCanvas!.canvas);

    socket.emit("reset-line", [offsetX, offsetY])

  };

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
  const draw = (e: React.MouseEvent<HTMLCanvasElement>, isLocal: boolean, isOwner: boolean) => { // funkcija za crtanje
    if (!drawing && isLocal) return;
    isOwner = true; //izbaci ovo
    if (myCanvas && isOwner && isClicked) {
      if (isLocal) {
        const [offsetX, offsetY] = getOffset(e.clientX, e.clientY, myCanvas.canvas);
        let data: any;
        if (drawMode === "line") {
          data = myCanvas.draw(offsetX, offsetY, { color, lineWidth, lineCap: 'round' });
        }
        else {
          data = myCanvas.drawShape(offsetX, offsetY, { color, lineWidth, shape: "rectangle" });
        }
        data['drawMode'] = drawMode;

        socket.emit("draw", data);
      } else {

        const { clientX, clientY, color, lineWidth, drawMode }: any = e;
        console.log(drawMode);
        if (drawMode === "line") {
          myCanvas.draw(clientX, clientY, { color, lineWidth, lineCap: 'round' });//ako se crta cetkicom tj samo linija poziva se ovo
          console.log('draw-Line');

        }
        else {
          myCanvas.drawShape(clientX, clientY, { color, lineWidth: lineWidth, shape: "rectangle-fill" });//ako se crta geometrijski oblik poziva se ovo
          console.log('draw-fill');
        }
      }
    };
  }
  socket.on("draw", (e: any) => { //salje se draw event serveru 
    draw(e, false, true);
    console.log("draw");
  });
  socket.on("reset-line", (e: number[]) => {
    const [positionX, positionY] = e;
    console.log('e');
    myCanvas?.ctx?.moveTo(positionX, positionY);


  })
  const clearCanvas = () => {
    myCanvas?.clearCanvas();
  }

  const paintCanvas = () => {
    myCanvas?.paintCanvas(color);
  };
  const brushSizeSet = (e: any) => {
    setLineWidth(e);
  };

  const saveCanvas = () => {
    myCanvas?.saveWhiteboard('jpg')
  }

  const saveCanvasToDB = () => {
    const image = myCanvas?.saveWhiteboard('jpg')
    socket.emit("save-image-to-database", { image, userName: name })
  }

  const submitWord = () => { // salje se rec koju mora da pogodi neko
    if (drawingWordRef.current?.value !== "" && drawingWordRef.current) {
      socket.emit("update-word", drawingWordRef.current.value);
      drawingWordRef.current.value = "";
    }
  }
  const setDrawingMode = (mode: string) => {
    setDrawMode(mode);
  }


  window.addEventListener('mouseup', () => {
    setIsClicked(false);
  })
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
          onMouseLeave={() => {
            setDrawing(false);
          }}
          onMouseEnter={() => {
            setDrawing(true);
          }}
          onMouseMove={e => {
            draw(e, true, isOwner);
          }}
        ></canvas>
      </div>
      <Tools // Ovde prosledjujemo parametre komponenti tools da bi imala pristup  
        canvasContext={clearCanvas}
        brushSize={brushSizeSet}
        paintCanvas={paintCanvas}
        saveCanvas={saveCanvas}
        setDrawMode={setDrawingMode}
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