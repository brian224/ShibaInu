(function(){
	var canvas, stage, shape, lastPt, oldMidPt, color, stroke, lastPt, image, bitmap,
		isMouseDown = false;

	function init() {
		image = new Image();
		image.onload = handleComplete;
		image.src = 'img/ShibaInu.png';

		if (window.innerWidth < 500) {
			document.getElementById('canvas').width = 250;
			document.getElementById('canvas').height = 304;
		}
	}

	function handleComplete() {
		canvas = document.getElementById('canvas');

		stage = new createjs.Stage(canvas);
		shape = new createjs.Shape();
		bitmap = new createjs.Bitmap(image);

		if (window.innerWidth < 500) {
			bitmap.scaleX = bitmap.scaleY = 0.5;
		}

		shape.cache(0, 0, image.width, image.height);
		bitmap.cache(0, 0, image.width, image.height);

		createjs.Touch.enable(stage);

		var overShape = new createjs.Shape();
		
		stage.addChild(overShape,  bitmap );
		stage.addChild(shape);
		stage.update();	

		stage.addEventListener('stagemousedown', handleMouseDown);
		stage.addEventListener('stagemousemove', handleMouseMove);
		stage.addEventListener('stagemouseup', handleMouseUp);

		window.addEventListener('contextmenu', function() {
			isMouseDown = false;
		});

		document.querySelector('.btn-save').addEventListener('click',function(){
			var dataURL = canvas.toDataURL();
			this.href = dataURL;
			this.download = '汪汪汪';
		}, false);
	}

	function handleMouseDown(event) {
		isMouseDown = true;
		color = document.querySelector('.color-picker').value;
		stroke = document.querySelector('.range-picker').value;

		lastPt = new createjs.Point(stage.mouseX, stage.mouseY);
		oldMidPt = lastPt.clone();	
	}

	function handleMouseMove(event) {
		if ( !isMouseDown ) {
			return;
		};	

		var nowMidPt = new createjs.Point(
			lastPt.x + stage.mouseX >> 1, 
			lastPt.y + stage.mouseY >> 1
		);

		shape.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo( nowMidPt.x, nowMidPt.y ).curveTo(lastPt.x, lastPt.y, oldMidPt.x, oldMidPt.y);

		lastPt.x = stage.mouseX;
		lastPt.y = stage.mouseY;

		oldMidPt.x = nowMidPt.x;
		oldMidPt.y = nowMidPt.y;


		shape.updateCache(erase.checked ? 'destination-out' : 'source-over');
		shape.graphics.clear();
		stage.update();
	}

	function handleMouseUp(event) {		
		isMouseDown = false;	
	}

	document.addEventListener('DOMContentLoaded', init);
})();