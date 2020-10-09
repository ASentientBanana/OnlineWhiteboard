
interface IDrawingOptions {
  color: any;
  lineWidth: number;
  lineCap: CanvasLineCap
}
interface shapeArray {
  positionX: number
  positionY: number,
}
interface IShapeDrawingOptions {
  color: string,
  lineWidth: number,
  shape: string
}

// Ovde smo def interfejse za objektekoje koristimo za crtanje

export class whiteboard {

  ctx: CanvasRenderingContext2D | null;
  color: string;
  canvas: HTMLCanvasElement;
  shapeArray: shapeArray[];
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

  draw(positionX: number, positionY: number, { color, lineWidth = 50, lineCap = 'round' }: IDrawingOptions) {
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

  drawShape(positionX: number, positionY: number, { color = "#000000", lineWidth = 1, shape = "rectangle" }: IShapeDrawingOptions) {
    //Metoda za crtanje oblika 
    this.shapeArray.push({ positionX, positionY })
    if (!this.canvasImageData) this.canvasImageData = this.imgData;
    this.canvasImageData = this.ctx?.putImageData(this.canvasImageData, 0, 0);
    this.ctx?.beginPath();
    const data = { color, lineWidth, shape }
    const startPosX = this.shapeArray[0].positionX;
    const startPosY = this.shapeArray[0].positionY;
    const currPosX = positionX - startPosX;
    const currPosY = positionY - startPosY;

    if (shape === "rectangle") {
      this.drawRectangle(startPosX, startPosY, currPosX, currPosY, false, color);
    }
    else if (shape === "rectangle-fill") {
      this.drawRectangle(startPosX, startPosY, currPosX, currPosY, true, color);
    }

    this.ctx!.stroke();
    return { positionX, positionY, data }
  }
  private drawRectangle(startX: number, startY: number, endPosX: number, endPosY: number, isFill: boolean, color: string) {
    if (isFill) {
      this.ctx!.rect(startX, startY, endPosX, endPosY);
    } else {
      this.ctx!.fillStyle = this.color;
      this.ctx!.fillRect(startX, startY, endPosX, endPosY);
    }
  }
  private drawCircle(startPosX: number, startPosY: number, currPosX: number, currPosY: number = 0) {
    const x = Math.pow(currPosX - startPosX, 2);
    const y = Math.pow(currPosY - startPosY, 2);
    const diameter = Math.sqrt(x + y);
    this.ctx!.arc(startPosX, startPosY, diameter, 0, 2 * Math.PI, false)
  }

  clearCanvas() { // Ова функција клирује канвас
    this.ctx!.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.paintCanvas(this.defaultCanvasColor);
  }

  drawDots(positionX: number, positionY: number, color: any,) {
    this.ctx!.fillStyle = 'green';
    this.ctx!.fillRect(positionX, positionY, 2, 2);
  }
  saveWhiteboard(imageFormat: string) {//konveruje sliku u base 64 i pita korisnika da li bi da download
    const data = this.canvas.toDataURL('image/jpeg', 1.0);
    console.log(data);
    const a = document.createElement('a');
    a.href = data;
    a.download = `canvas.jpg`;
    a.click();
    return data
  }

}
class whiteboardBuilder {
  canvas: whiteboard;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new whiteboard(canvas);
    this.canvas.canvas.height = 800;
    this.canvas.canvas.width = 600;
  }
  withHeight(height: number) {
    this.canvas.canvas.height = height;
    return this
  }
  withWidth(width: number) {
    this.canvas.canvas.width = width;
    return this
  }
  withBackgroundColor(color: string) {
    this.canvas.paintCanvas(color);
    return this
  }
  build() {
    return this.canvas
  }

}
export default whiteboardBuilder;