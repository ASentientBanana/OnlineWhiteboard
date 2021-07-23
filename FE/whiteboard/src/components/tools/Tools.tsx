import React, { useEffect, createRef } from "react";
import "./Tools.css";
import { ColorPalete } from "../colorPalete/ColorPalete";


interface tools {
  canvasCtx: CanvasRenderingContext2D;
}
// ovde se nalaze paleta i dugmici/slajder koji pozivajvaju funkcije koje smo prosledili u kmponentu
const Tools = ({ clearCanvas, brushSize, paintCanvas, saveCanvas, saveCanvasToDB, setDrawMode }: any) => {
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
          onClick={() => clearCanvas()}
        >
          Clear Canvas
        </button>
        <input
          type="range"
          id="brush-size-slider"
          min="1"
          max="60"
          onChange={(e) => {
            brushSize.current = parseInt(e.target.value);
          }}
          ref={sliderRef}
        />
      </div>
      {/* on click je event koji se zove kada kliknes... */}
      <div className="buttons-container">
        <a className="waves-effect waves-light btn" onClick={saveCanvas}>
          <i className="material-icons center">save</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={saveCanvasToDB}>
          <i className="material-icons center">cloud_upload</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={paintCanvas}>
          <i className="material-icons center">format_paint</i>
        </a>
      </div>
      <div className="buttons-container">
        <a className="waves-effect waves-light btn" onClick={() => {
          setDrawMode(0)
        }}>
          <i className="material-icons center">brush</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={() => {
          setDrawMode(1)
        }}>
          <i className="material-icons center">check_box_outline_blank</i>
        </a>
        <a className="waves-effect waves-light btn" onClick={() => {
          setDrawMode(2)
        }}>
          <i className="material-icons center">dashboard</i>
        </a>
      </div>
    </div>
  );
};
export default Tools;
