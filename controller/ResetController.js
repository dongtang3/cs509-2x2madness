

export default function resetHandler(model, canvasObj,forceRedraw) {
  
  model.reset()
  forceRedraw(prev => prev + 1);
}


