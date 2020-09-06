
interface drawingOptions{
  color:any;
  lineWidth:number;
  lineCap:string
}

export class whiteboard{
  
  ctx:any;
  color:any;
  canvas:HTMLCanvasElement;

  constructor(canvas:HTMLCanvasElement){
    this.canvas = canvas;
    if(canvas != null){
      this.ctx = canvas.getContext('2d');
    }else{
      console.error('context is null');
    }
  }
  
  draw(positionX:number,positionY:number,{color="#000000",lineWidth = 50,lineCap = 'round'}:any){
      this.ctx.lineWidth = lineWidth;
      this.ctx.lineCap = lineCap;
      this.ctx.strokeStyle = color;
      this.ctx.lineTo(positionX, positionY);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(positionX, positionY);
      return{
          clientX: positionX,
          clientY: positionY,
          color: color,
          lineWidth: lineWidth,
          lineCap: lineCap,
        }
  }

  // readTheFile(file:any) {
  //   const reader = new FileReader();
  //   return new Promise((resolve) => {
  //     reader.onload = (event) => {
  //       resolve(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   })
  // }
  drawDots(positionX:number,positionY:number,color:any,) {
    
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(positionX, positionY, 2, 2);
    
  }
  saveWhiteboard(imageFormat:string) {
    const data = this.canvas.toDataURL('image/jpeg', 1.0);
    const a = document.createElement('a');
    a.href = data;
    a.download = `canvas.jpg`;
    a.click();
  }

}
class whiteboardBuilder{
   canvas:whiteboard;
  constructor(canvas:HTMLCanvasElement){
    this.canvas = new whiteboard(canvas);
    this.canvas.canvas.height =800;
    this.canvas.canvas.width = 600;
  }
  withHeight(height:number){
    this.canvas.canvas.height = height;
    return this
  }
  withWidth(width:number){
    this.canvas.canvas.width = width;
    return this
  }
  build(){
    return this.canvas
  }

}
export default whiteboardBuilder;