
interface IDrawInfo{
    x: number; 
    y: number;
    lineWidth: number; 
    lineCap:string;
    strokeStyle: string;
}
class WhiteboardUtility {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        //@ts-ignore
        this.ctx = canvas.getContext('2d');
    }
    drawLocal(x: number = 0, y: number = 0, lineWidth: number = 1, lineCap = 'round', strokeStyle: string = 'white') {
        this.ctx!.lineWidth = lineWidth;
        this.ctx!.strokeStyle = strokeStyle;
        this.ctx!.lineTo(x, y);
        this.ctx!.stroke();
        this.ctx!.beginPath();
        this.ctx!.moveTo(x, y);
    }
    drawRemote(options:IDrawInfo = {x:0,y:0,lineWidth:1,lineCap:'round',strokeStyle:'white'}) {
        this.ctx!.lineWidth = options.lineWidth;
        this.ctx!.strokeStyle = options.strokeStyle;
        this.ctx!.lineTo(options.x, options.y);
        this.ctx!.stroke();
        this.ctx!.beginPath();
        this.ctx!.moveTo(options.x, options.y);
    }
    clearCanvas() { }
    moveBrush(x: number, y: number) {
        this.ctx.moveTo(x, y)
    }

}

export default WhiteboardUtility