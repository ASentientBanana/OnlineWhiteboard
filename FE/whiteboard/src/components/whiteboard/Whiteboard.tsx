import React, {
  useEffect,
  MouseEvent,
  createRef,
  useRef,
  useContext,
  useState,
} from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import Tools from "../tools/Tools";
import { Link } from "react-router-dom";
import WhiteboardUtility from "./whiteboardF";
import WhiteboardBuilder from './util/WhiteboardBuilder';
type props = {
  nameInfo: {
    userName: string;
    roomName: string | null;
  };
  socket: SocketIOClient.Socket;
};

// 1 defaulr 2 rectangle 3 filled rectangle
export const Whiteboard = ({ nameInfo, socket }: props) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const drawType = useRef<number>(0);
  const isDrawing = useRef<boolean>();
  const brushSize = useRef<number>(0);
  const [currColor, setCurrColor] = useContext(ColorContext);
  const [whiteboard, setWhiteboard] = useState<WhiteboardUtility>();
  const startPos = useRef({ x: 0, y: 0 });
  const guess = useRef<string>('');
  const [isShowWinnerBanner, setIsShowWinnerBanner] = useState<boolean>(false);
  const winningGuess = useRef<string>('')
  const winner = useRef<string>('')
  
  const getOffset = (
    // metoda za racunjane offseta canvasa da u odnosu na stranu da ne bi bilo ofseta kada se crta
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement
  ): number[] => {
    const { scrollX, scrollY } = window;
    const offsetX = clientX - canvas.offsetLeft + scrollX;
    const offsetY = clientY - canvas.offsetTop + scrollY;
    return [offsetX - 16, offsetY - 16]; // minus je fontsize jer pravi offset
  };
  useEffect(() => {
    if (canvasRef.current)
      setWhiteboard( new WhiteboardBuilder(canvasRef.current).withHeight(600).withWidth(800).withBackgroundColor('white').build());
  }, []);

  const onSubmitGuess = () => {
    socket.emit('userGuess', {
      userName: nameInfo.userName,
      roomName: nameInfo.roomName,
      guess: guess.current
    })
  };
  const showWinnerBanner = (winnerName: string, guess: string) => {
    winningGuess.current = guess;
    winner.current = winnerName;
    setIsShowWinnerBanner(true);
    setTimeout(()=>{
      setIsShowWinnerBanner(false);
    },3000)
  }
  socket?.on("correctGuess", (e: any) => {
    const { winnerName, guess } = e;
    showWinnerBanner(winnerName, guess);
  })

  socket?.on("drawing", (e: any) => {
    whiteboard?.drawRemote(e);
  });
  socket?.on("moveBrush", (e: any) => {
    whiteboard?.moveBrush(e.x, e.y);
  });
  socket?.on("drawRectangle", (e: any) => {
    whiteboard?.drawRectangleRemote(
      e.startX,
      e.startY,
      e.endPosX,
      e.endPosY,
      e.color,
      e.lineWidth,
      e.isFilled
    );
  });


  socket?.on("paintCanvas", (e: string) => {
    console.log("painting " + e);

    whiteboard?.paintCanvas(e);
  })

  const onMouseDownHandler = (e: MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const [x, y] = getOffset(e.clientX, e.clientY, canvasRef.current!);
    switch (drawType.current) {
      case 0:
        whiteboard?.moveBrush(x, y);
        socket?.emit("moveBrush", {
          userInfo: {
            userName: nameInfo.userName,
            roomName: nameInfo.roomName,
          },
          brushPos: { x, y },
        });
        break;
      case 1:
        startPos.current = { x, y };
        whiteboard?.saveImageData();
        break;
      case 2:
        startPos.current = { x, y };
        whiteboard?.saveImageData();
        break;
      case 3:
        startPos.current = { x, y };
        whiteboard?.saveImageData();
        break;
      default:
        break;
    }
  };

  const clearCanvas = () => whiteboard?.clearCanvas();

  const onMouseUpHandler = (e: MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    const [x, y] = getOffset(e.clientX, e.clientY, canvasRef.current!);
    if (drawType.current === 1 || drawType.current === 2) {
      socket.emit("drawRectangle", {
        startX: startPos.current.x,
        startY: startPos.current.y,
        endPosX: x,
        endPosY: y,
        color: currColor,
        lineWidth: brushSize.current,
        isFilled: drawType.current === 1 ? false : true,
        userInfo: {
          userName: nameInfo.userName,
          roomName: nameInfo.roomName,
        },
      });
    }
  };

  const onMouseMoveHandlerDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const [x, y] = getOffset(e.clientX, e.clientY, canvasRef.current!);
    switch (drawType.current) {
      case 0:
        whiteboard?.drawLocal(x, y, brushSize.current, "round", currColor);
        socket?.emit("drawing", {
          userInfo: nameInfo,
          drawingData: {
            x,
            y,
            lineWidth: brushSize.current,
            lineCap: "round",
            strokeStyle: currColor,
          },
        });
        break;
      case 1:
        whiteboard?.drawRectangle(
          startPos.current.x,
          startPos.current.y,
          x,
          y,
          currColor
        );
        break;
      case 2:
        whiteboard?.drawRectangle(
          startPos.current.x,
          startPos.current.y,
          x,
          y,
          currColor,
          2,
          true
        );
        break;
      case 3:
        whiteboard?.drawCircle(
          startPos.current.x,
          startPos.current.y,
          x,
          y,
          currColor,
          1,
          false
        );
        break;
      default:
        break;
    }
  };
  const paintCanvasHandler = () => {
    const data = { userInfo: nameInfo, color: currColor }
    whiteboard?.paintCanvas(currColor);
    socket?.emit("paintCanvas", data);
  }
  const saveToCloud = async()=>{
    //  image64, userName
    const imageString = whiteboard?.saveWhiteboardRemote();
    socket.emit('saveImage',{imageString,userName:nameInfo.userName})
  }
  return (
    <div>
      <div className="col s12 m12 l12 whiteboard-container" ref={null}>
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDownHandler}
          onMouseUp={onMouseUpHandler}
          onMouseLeave={(e) => { }}
          className="canvas"
          onMouseMove={onMouseMoveHandlerDrawing}
        ></canvas>
      </div>
      <Tools
        clearCanvas={clearCanvas}
        brushSize={brushSize}
        paintCanvas={paintCanvasHandler}
        saveCanvas={() => whiteboard?.saveWhiteboardLocal()}
        setDrawMode={(mode: number) => {
          drawType.current = mode;
        }}
        saveCanvasToDB={() => { saveToCloud()}}
      />
      <div>
        <div className="gallery-btn-div">
          <Link
            to={`/gallery/${nameInfo.userName}`}
            className="waves-effect waves-light btn "
          >
            <i className="material-icons center">burst_mode</i>gallery
          </Link>
        </div>
        <div className="col s12 word-input">
          Write is the drawing:
          <div className="input-field inline">
            <input
              id="drawing_word"
              type="text"
              className="validate"
              onChange={(e) => guess.current = e.target.value}
            />
            <a
              className="waves-effect waves-light btn submit-word-btn"
              onClick={onSubmitGuess}
            >
              <i className="material-icons left">import_contacts</i>Submit word
            </a>
            {
              isShowWinnerBanner ?
                <div className="winnerBanner">
                  {winner.current} won by guessing {winningGuess.current}
                </div>
                : null
            }
          </div>
        </div>
      </div>
    </div>
  );
};
