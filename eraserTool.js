function EraserTool() {
    this.icon = "assets/eraser.jpg"; 
    this.name = "eraser";

    let previousMouseX = -1;
    let previousMouseY = -1;

    this.draw = function() {
        if(mouseIsPressed){
            // Save current drawing settings
            layers[activeLayer].gfx.push();
            
            layers[activeLayer].gfx.strokeWeight(20); // eraser size
            layers[activeLayer].gfx.stroke(255); // background color (white in your case)
            
            if (previousMouseX == -1){
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
            layers[activeLayer].gfx.line(previousMouseX, previousMouseY, mouseX, mouseY);
            
            previousMouseX = mouseX;
            previousMouseY = mouseY;

            // Restore settings so color palette is not affected
            layers[activeLayer].gfx.pop();
        } else {
            previousMouseX = -1;
            previousMouseY = -1;
        }
    };
}
