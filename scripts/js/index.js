(function(){
	var canvas, stage, shape, lastPt, oldMidPt, color, stroke, lastPt, image, bitmap,
		isMouseDown = false;

	function init() {
		image = new Image();
		image.onload = handleComplete;
		image.src = 'img/ShibaInu.png';
	}

	function handleComplete() {
		canvas = document.getElementById('canvas');

		stage = new createjs.Stage(canvas);
		shape = new createjs.Shape();
		bitmap = new createjs.Bitmap(image);

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

		document.querySelector('.btn-fb').addEventListener('click',function(){
			$.ajax({
				type        : 'POST',
				url         : 'https://api.imgur.com/3/image',
				headers     : {
					Authorization : 'Client-ID fdf452e270f3d90'
				},
				data        : {
					// image : canvas.toDataURL(),
					image : 'data:image/png;base64,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',
					type  : 'base64'
				},
				dataType    : 'json',
				crossOrigin : true,
				success     : function(data) {
					console.log('yo');
				}
			});
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