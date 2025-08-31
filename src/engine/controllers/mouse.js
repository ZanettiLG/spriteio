class MouseController {

  #canvas = null;
  constructor(onAction) {
    this.width = 0;
    this.height = 0;
    this.destination = null;
    this.onAction = onAction;
  }

  onMouseClick = (event) => {
    const rect = this.#canvas.getBoundingClientRect();
    const vector = [
      event.clientX - rect.left - this.width,
      event.clientY - rect.top - this.height,
    ];
    this.destination = vector;
  };

  set canvas(canvas) {
    if(this.#canvas) {
      this.#canvas.removeEventListener('click', this.onMouseClick);
    }
    this.#canvas = canvas;
    this.width = canvas.width / 2;
    this.height = canvas.height / 2;
    
    canvas.addEventListener('click', this.onMouseClick);
  }

  update = () => {
    if(this.destination) {
      const [x, y] = this.destination;
      
      if(!x && !y) {
        this.destination = null;
        return;
      }
      this.onAction?.("move", this.destination);
    }
  }

}

export default MouseController;