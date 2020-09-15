import React, { useEffect, createRef, useContext, useState, InputHTMLAttributes } from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import whiteboardBuilder, { whiteboard } from "../../hooks/facadeWhiteboard";
import Tools from "../tools/Tools";

export const Whiteboard = ({ socket }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const drawingWordRef = createRef<HTMLInputElement>();
  const [color, setColor] = useContext(ColorContext);
  const [lineWidth, setLineWidth] = useState(1);
  const [myCanvas, setMyCanvas] = useState<whiteboard>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  // const defaultCanvasColor = "#d8c1c1";
  // let drawing = false;
  let tmp: whiteboard;
  useEffect(() => {
    socket.on('isOwner', (e: any) => {
      console.log(e);
      if (e == 200) {
        setIsOwner(true);
      }
    });
    if (canvasRef.current && whiteboardContainer.current)
      tmp = new whiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .withBackgroundColor("#d8c1c1")
        .build();
    setMyCanvas(tmp);
  }, []);

  const startPos = (e: any) => {
    myCanvas?.clearShapeArray()
    setIsClicked(true);
    setDrawing(true);
    myCanvas?.setCanvasImageData();
    // draw(e, true,isOwner);
  };

  const endPos = () => {
    setIsClicked(true);
    setDrawing(false);
    myCanvas?.clearShapeArray();
    console.log(myCanvas?.shapeArray);
    
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, isLocal: boolean, isOwner: boolean) => {
    if (!drawing && isLocal) return;
    isOwner = true; //izbaci ovo
    if (myCanvas && isOwner && isClicked) {
      if (isLocal) {
        const { scrollX, scrollY } = window;
        const offsetX = e.clientX - myCanvas.canvas.offsetLeft + scrollX;
        const offsetY = e.clientY - myCanvas.canvas.offsetTop + scrollY;
        const data = myCanvas.drawShape(offsetX, offsetY, { color, lineWidth, shape: "rectangle" });
        socket.emit("draw", data);
      } else {
        console.log(e);
        // const {color,lineWidth,shape} = e;
        // myCanvas.drawShape(e.clientX, e.clientY,{e.color,} ,);
      }
    }
  };
  socket.on("draw", (e: any) => {
    draw(e, false, true);
  });
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
    const b = myCanvas?.saveWhiteboard('jpg')
  }

  const submitWord = () =>{
    if(drawingWordRef.current?.value != "" && drawingWordRef.current){
      socket.emit("update-word",drawingWordRef.current.value);
      drawingWordRef.current.value = "";
    }
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
          onMouseUp={() => {
            endPos();
          }}
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
      <Tools
        canvasContext={clearCanvas}
        brushSize={brushSizeSet}
        paintCanvas={paintCanvas}
        saveCanvas={saveCanvas}
      />
      <div>
        <div className="col s12 word-input">
          Wtite what you are drawing here:
            <div className="input-field inline">
            <input id="drawing_word" type="text" className="validate" ref={drawingWordRef}  />
            <span className="helper-text" data-error="wrong" data-success="right">Owner only</span>
            <a className="waves-effect waves-light btn submit-word-btn" onClick={submitWord}><i className="material-icons left">import_contacts</i>Submit word</a>
          </div>
        </div>
      </div>
    </div>
  );
};
// 