import WhiteboardFacade from './facadeWhiteboard';

class WhiteboardBuilder {
    canvas: WhiteboardFacade;
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = new WhiteboardFacade(canvas);
    }
    withHeight(height: number = 800) {
      this.canvas.canvas.height = height;
      return this;
    }
    withWidth(width: number = 600) {
      this.canvas.canvas.width = width;
      return this;
    }
    withBackgroundColor(color: string) {
      this.canvas.paintCanvas(color);
      return this;
    }
    build() {
      return this.canvas;
    }
  
  }
  export default WhiteboardBuilder;