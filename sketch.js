//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;

var layers = [];
var activeLayer = 0;

var undoManager;

function setup() {
	pixelDensity(1); 

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");

	layers.push({
		gfx: createGraphics(width, height),
		visible: true
	});
	updateLayerList();

	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new sprayCanTool);
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new EraserTool);

	undoManager = new Undo(50);
	undoManager.capture();
}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}

	background(255);

	for (var i = 0; i < layers.length; i++) {
		if (layers[i].visible) {
			image(layers[i].gfx, 0, 0);
		}
	}

	if (frameCount % 30 === 0) updateLayerList();
}

function addLayer() {
	let newLayer = {
		gfx: createGraphics(width, height),
		visible: true
	}
	layers.splice(activeLayer + 1, 0, newLayer);
	activeLayer++;
	updateLayerList();
	undoManager.capture();
}
  
function deleteLayer() {
	if (layers.length > 1) {
		layers.splice(activeLayer, 1);
		activeLayer = max(0, activeLayer - 1);
		updateLayerList();
		undoManager.capture();
	}
}

function updateLayerList() {
	let list = document.getElementById("layersList");
  	list.innerHTML = "";
	for (let i = layers.length - 1; i >= 0; i--) { // topmost first
		let item = document.createElement("div");
		item.className = "layerItem" + (i === activeLayer ? " activeLayer" : "");
		item.onclick = () => { activeLayer = i; updateLayerList(); };

		// Thumbnail
		let thumb = document.createElement("canvas");
		thumb.className = "layerThumb";
		thumb.width = 40;
		thumb.height = 30;
		let ctx = thumb.getContext("2d");
		ctx.drawImage(layers[i].gfx.elt, 0, 0, thumb.width, thumb.height);
		item.appendChild(thumb);

		let name = document.createElement("p");
		name.innerHTML = "Layer " + (i + 1);
		item.appendChild(name);

		// Visibility toggle
		let vis = document.createElement("span");
		vis.innerHTML = layers[i].visible ? "<img src='assets/eye.jpg'/>" : "<img src='assets/ban.jpg'/>";
		vis.className = "layerVisible";
		vis.onclick = (e) => {
			e.stopPropagation();
			layers[i].visible = !layers[i].visible;
			updateLayerList();
		};
		item.appendChild(vis);

		list.appendChild(item);
	}
}

 function mouseReleased() {
	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        undoManager.capture();
    }
}

function windowResized() {
	resizeCanvas(canvasContainer.size().width, canvasContainer.size().height);
}

class Undo {
	constructor(amountOfImages = 10) {
		this.images = new UndoImages(amountOfImages);
	}

	undo() {
		this.images.prev();
		this.images.show();
	}

	redo() {
		this.images.next();
		this.images.show();
	}

	capture() {
		this.images.capture();
	}
}
  
class UndoImages {
	constructor(amountOfImages) {
		this.amount = amountOfImages;
		this.states = [];
		this.current = 0;

		this.capture();
	}

	capture() {
		this.states.splice(this.current + 1);

		let state = {
			layers: [],
			activeLayer: activeLayer
		};

		for (let i = 0; i < layers.length; i++) {
			state.layers.push({
				gfx: layers[i].gfx.get(),
				visible: true
			});
		}

		this.states.push(state);

		if (this.states.length > this.amount) {
			this.states.shift();
		}

		this.current = this.states.length - 1;
	}

	prev() {
		if (this.current > 0) {
			this.current--;
		}
	}

	next() {
		if (this.current < this.states.length - 1) {
			this.current++;
		}
	}

	show() {
		let state = this.states[this.current];

		// rebuild layers
		layers = [];
		for (let i = 0; i < state.layers.length; i++) {
			let g = createGraphics(width, height);
			g.image(state.layers[i].gfx, 0, 0);
			layers.push({
				gfx: g,
				visible: true
			});
		}

		activeLayer = state.activeLayer;
		updateLayerList();
	}
}
  