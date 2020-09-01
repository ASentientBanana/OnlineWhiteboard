
class whiteboard{
  ctx:any
  color:any
  canvas:HTMLCanvasElement;
  constructor(canvas:HTMLCanvasElement){
    this.canvas = canvas;
    if(canvas != null){
      this.ctx = canvas.getContext('2d');
    }else{
      console.error('context is null');
    }
  }
  
  draw(positionX:number,positionY:number,color:any,lineWidth:number = 2,lineCap:string = 'round'){
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
    





// canvasElem.width = whiteboardContainer.current?.clientWidth;
    // canvasElem.height = whiteboardContainer.current?.clientHeight;
    // const aspect = canvasElem.height / canvasElem.width;




// const facadeWhiteboard = (ctx:CanvasRenderingContext2D,positionX:number,positionY:number,color:any,lineWidth:number = 2,lineCap:string = 'round') => {
//     ctx.lineWidth = lineWidth;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = color;
//     ctx.lineTo(positionX, positionY);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(positionX, positionY);
//     return{
//         clientX: positionX,
//         clientY: positionY,
//         color: color,
//         lineWidth: lineWidth,
//         lineCap: lineCap = "round",
//       }
// } 
 export default whiteboardBuilder;