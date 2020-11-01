export interface IDrawingOptions {
    color: any;
    lineWidth: number;
    lineCap: CanvasLineCap
  }
export interface IShapeArray {
    positionX: number
    positionY: number,
  }
export interface IShapeDrawingOptions {
    color: string,
    lineWidth: number,
    shape: number,
    isLocal:boolean,
  }
  