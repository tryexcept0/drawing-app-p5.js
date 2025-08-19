function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";
	// the vars are set to -1 to indicate that they don't have a starting point yet
	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	this.draw = function(){
		//When mouse is pressed the vars update to the current mouseX and MouseY while saving the current canvas with: loadpixels
		if(mouseIsPressed){
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				layers[activeLayer].gfx.loadPixels();
			}
			//Once the mouse has been let it go the pixels on the screen update ensuring that everything remains clean
			else{
				layers[activeLayer].gfx.updatePixels();
				layers[activeLayer].gfx.line(startMouseX, startMouseY, mouseX, mouseY);
			}

		}
		//returns mouse back to uninitialized values so when you click the mouse again the values change to where you are at the screen
		else if(drawing){
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};
}
