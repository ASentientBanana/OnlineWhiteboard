import React, { useEffect, createRef } from "react";
import "./Tools.css";
import { ColorPalete } from "../colorPalete/ColorPalete";
import bucket from "../../assets/images/paint-bucket.png";
import saveIcon from "../../assets/images/save.png";

interface tools {
  canvasCtx: CanvasRenderingContext2D;
}
const Tools = ({ canvasContext, brushSize, paintCanvas, saveCanvas, setDrawMode }: any) => {
  const sliderRef = createRef<HTMLInputElement>();
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.value = "1";
    }
  }, []);
  return (
    <div className="tool-container container">
      <ColorPalete />
      <div>
        <button
          className="waves-effect waves-light btn col s6 clear-btn"
          onClick={() => {
            canvasContext();
          }}
        >
          Clear Canvas
        </button>
        <input
          type="range"
          id="brush-size-slider"
          min="1"
          max="60"
          onChange={(e) => {
            brushSize(e.target.value);
          }}
          ref={sliderRef}
        />
      </div>
      <div className="buttons-container">
        <a className="waves-effect waves-light btn" onClick={saveCanvas}>
          <i className="material-icons center">save</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={paintCanvas}>
          <i className="material-icons center">format_paint</i>
        </a>
      </div>
      <div className="buttons-container">
        <a className="waves-effect waves-light btn" onClick={() => {
          setDrawMode('line')
        }}>
          <i className="material-icons center">brush</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={() => {
          setDrawMode('rectangle')
        }}>
          <i className="material-icons center">check_box_outline_blank</i>
        </a>
      </div>
    </div>
  );
};
export default Tools;
