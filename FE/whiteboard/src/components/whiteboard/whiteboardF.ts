interface IDrawInfo {
  x: number;
  y: number;
  lineWidth: number;
  lineCap: CanvasLineCap;
  strokeStyle: string;
}
class WhiteboardUtility {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageData: ImageData;
  baseImageData: ImageData;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    //@ts-ignore
    this.ctx = canvas.getContext("2d");
    this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
    this.baseImageData = this.ctx.createImageData(canvas.width, canvas.height);
  }
  drawLocal(
    x: number = 0,
    y: number = 0,
    lineWidth: number = 1,
    lineCap: CanvasLineCap = "round",
    strokeStyle: string = "white"
  ) {
    this.ctx!.lineWidth = lineWidth;
    this.ctx!.strokeStyle = strokeStyle;
    this.ctx!.lineCap = lineCap;
    this.ctx!.lineTo(x, y);
    this.ctx!.stroke();
    this.ctx!.beginPath();
    this.ctx!.moveTo(x, y);
  }
  drawRemote(
    options: IDrawInfo = {
      x: 0,
      y: 0,
      lineWidth: 1,
      lineCap: "round",
      strokeStyle: "white",
    }
  ) {
    this.ctx!.lineWidth = options.lineWidth;
    this.ctx!.strokeStyle = options.strokeStyle;
    this.ctx!.lineCap = options.lineCap;
    this.ctx!.lineTo(options.x, options.y);
    this.ctx!.stroke();
    this.ctx!.beginPath();
    this.ctx!.moveTo(options.x, options.y);
  }
  saveImageData() {
    this.baseImageData = this.ctx?.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  drawRectangleRemote(
    startX: number,
    startY: number,
    endPosX: number,
    endPosY: number,
    color: string,
    lineWidth: number = 1,
    isFilled: boolean = false
  ) {
    this.ctx!.strokeStyle = color;
    this.ctx!.lineWidth = lineWidth;
    this.ctx.fillStyle = color;
    if (isFilled)
      this.ctx!.fillRect(startX, startY, endPosX - startX, endPosY - startY);
    else
      this.ctx!.strokeRect(startX, startY, endPosX - startX, endPosY - startY);
  }
  drawRectangle(
    startX: number,
    startY: number,
    endPosX: number,
    endPosY: number,
    color: string,
    lineWidth: number = 1,
    isFilled: boolean = false
  ) {
    if (this.imageData) {
      this.clearCanvas();
      this.ctx?.putImageData(
        this.baseImageData,
        0,
        0,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.ctx!.strokeStyle = color;
      this.ctx!.lineWidth = lineWidth;
      this.ctx.fillStyle = color;
      if (isFilled)
        this.ctx!.fillRect(startX, startY, endPosX - startX, endPosY - startY);
      else
        this.ctx!.strokeRect(
          startX,
          startY,
          endPosX - startX,
          endPosY - startY
        );
    }
  }

  drawCircle(
    startX: number,
    startY: number,
    endPosX: number,
    endPosY: number,
    color: string,
    lineWidth: number = 1,
    isFilled: boolean = false
  ) {
    if (this.imageData) {
      this.moveBrush(startX, startY);
      this.clearCanvas();
      this.ctx?.putImageData(
        this.baseImageData,
        0,
        0,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.ctx!.strokeStyle = color;
      this.ctx!.lineWidth = lineWidth;
      this.ctx.arc(
        startX,
        startY,
        Math.abs(
          Math.sqrt(
            Math.pow(startX - endPosX, 2) + Math.pow(startY - endPosY, 2)
          )
        ),
        0,
        2 * Math.PI
      );
      if (isFilled) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  }

  clearCanvas() {
    this.paintCanvas('white');
  }
  moveBrush(x: number, y: number) {
    this.ctx.moveTo(x, y);
  }
  paintCanvas(color:string){
    this.ctx.fillStyle = color;
    this.ctx?.fillRect(0,0,this.canvas.width,this.canvas.height);
  }
  saveWhiteboardLocal() {
    //konveruje sliku u base 64 i pita korisnika da li bi da download
    const data = this.canvas.toDataURL('image/jpeg', 1.0);
    const a = document.createElement('a');
    a.href = data;
    a.download = `canvas.jpg`;
    a.click();
    return data
  }
  saveWhiteboardRemote() {
    //konveruje sliku u base 64 i pita korisnika da li bi da download
     return this.canvas.toDataURL('image/png', 1.0).split(',')[1]
  }
}

export default WhiteboardUtility;
