import *  as  whiteboardTypes from '../../../types/Whiteboard'; 

export default class WhiteboardFacade {
  ctx: CanvasRenderingContext2D | null;
  color: string;
  canvas: HTMLCanvasElement;
  shapeArray: whiteboardTypes.IShapeArray[];
  canvasImageData: CanvasImageData | any;
  imgData: any;
  defaultCanvasColor: string;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.color = "#000000";
    this.shapeArray = [];
    this.defaultCanvasColor = "#ebe4e4"
  }

  draw(positionX: number, positionY: number, { color, lineWidth = 50, lineCap = 'round' }: whiteboardTypes.IDrawingOptions) {
    this.ctx!.lineWidth = lineWidth;
    this.ctx!.lineCap = lineCap;
    this.ctx!.strokeStyle = color;
    this.ctx!.lineTo(positionX, positionY);
    this.ctx!.stroke();
    this.ctx!.beginPath();
    this.ctx!.moveTo(positionX, positionY);
    return {
      clientX: positionX,
      clientY: positionY,
      color: color,
      lineWidth: lineWidth,
      lineCap: lineCap,
      drawMode:0
    }
  }

  setCanvasImageData() { // setuje trenutno  stanje canvasa u promenjivu canvasImageData
    this.canvasImageData = this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.imgData = this.canvasImageData;
  }
  clearShapeArray() {
    this.shapeArray = [];
  }

  paintCanvas(color: string) {
    this.ctx!.fillStyle = color;
    this.ctx!.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  clearCanvas() { // Ова функција клирује канвас
    this.ctx!.clearRect(
      0,0,
      this.canvas.width,
      this.canvas.height
    );
    this.paintCanvas(this.defaultCanvasColor);
  }

  drawShape(startPositionX: number, startPositionY: number,endPositionX: number, endPositionY: number, { color = "#000000", lineWidth = 1, shape = 1,isLocal = true }: whiteboardTypes.IShapeDrawingOptions) {
    //Metoda za crtanje oblika 
    if(isLocal){
      if (!this.canvasImageData) this.canvasImageData = this.imgData;
      this.canvasImageData = this.ctx?.putImageData(this.canvasImageData, 0, 0);
    }
    this.ctx?.beginPath();
    const data = { color, lineWidth, shape }
    const startPosX = startPositionX;
    const startPosY = startPositionY;
    const currPosX = endPositionX - startPosX;
    const currPosY = endPositionY - startPosY;
    if (shape === 1) {
      this.drawRectangle(startPosX, startPosY, currPosX, currPosY,  color,lineWidth);
    }
    else if (shape === 2) {
      this.drawRectangleFilled(startPosX, startPosY, currPosX, currPosY,  color);
    }
    this.ctx!.stroke();
    return { endPositionX, endPositionY, data }
  }

  private drawRectangle(startX: number, startY: number, endPosX: number, endPosY: number, color: string,lineWidth:number=1) {
    this.ctx!.strokeStyle = color;
    this.ctx!.lineWidth = lineWidth;
    this.ctx!.rect(startX, startY, endPosX, endPosY);
  }

  private drawRectangleFilled(startX: number, startY: number, endPosX: number, endPosY: number, color: string){
    this.ctx!.fillStyle = color;
    this.ctx!.fillRect(startX, startY, endPosX, endPosY);
  }
  
  private drawCircle(startPosX: number, startPosY: number, currPosX: number, currPosY: number = 0) {
    const x = Math.pow(currPosX - startPosX, 2);
    const y = Math.pow(currPosY - startPosY, 2);
    const diameter = Math.sqrt(x + y);
    this.ctx!.arc(startPosX, startPosY, diameter, 0, 2 * Math.PI, false)
  }

  drawDots(positionX: number, positionY: number, color: any,) {
    this.ctx!.fillStyle = 'green';
    this.ctx!.fillRect(positionX, positionY, 2, 2);
  }
  saveWhiteboard() {//konveruje sliku u base 64 i pita korisnika da li bi da download
    const data = this.canvas.toDataURL('image/jpeg', 1.0);
    console.log(data);
    const a = document.createElement('a');
    a.href = data;
    a.download = `canvas.jpg`;
    a.click();
    return data
  }

}
