(function(){
	var canvas, stage, shape, lastPt, oldMidPt, color, stroke, lastPt, image, bitmap, brush, brushimg,
		isMouseDown = false;

	function init() {
		image             = new Image();
		image.onload      = handleComplete;
		image.crossOrigin = '*';
		image.src         = 'img/ShibaInu.png';
		brush             = new Image();
		brush.onload      = handleComplete;
		brush.crossOrigin = '*';
		brush.src         = 'img/brush2.png';
	}

	function handleComplete() {
		canvas = document.getElementById('canvas');

		stage  = new createjs.Stage(canvas);
		shape  = new createjs.Shape();
		bitmap = new createjs.Bitmap(image);

		shape.cache(0, 0, image.width, image.height);
		bitmap.cache(0, 0, image.width, image.height);

		createjs.Touch.enable(stage);

		var overShape = new createjs.Shape();
		
		stage.addChild(overShape, bitmap);
		stage.addChild(shape);
		stage.update();	

		stage.addEventListener('stagemousedown', handleMouseDown);
		stage.addEventListener('stagemousemove', handleMouseMove);
		stage.addEventListener('stagemouseup', handleMouseUp);

		window.addEventListener('contextmenu', function() {
			isMouseDown = false;
		});

		document.querySelector('.btn-save').addEventListener('click',function(){
			var dataURL   = canvas.toDataURL();
			this.href     = dataURL;
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
					image : canvas.toDataURL().split(',')[1],
					type  : 'base64'
				},
				dataType    : 'json',
				crossOrigin : true,
				success     : function(data) {
					console.log(data);
				}
			});
		}, false);
	}

	function handleMouseDown(event) {
		isMouseDown = true;
		stroke      = document.querySelector('.range-picker').value;
		lastPt      = new createjs.Point(stage.mouseX, stage.mouseY);
		oldMidPt    = lastPt.clone();
	}

	function handleMouseMove(event) {
		if ( !isMouseDown ) { return; };

		var nowMidPt = new createjs.Point(
			lastPt.x + stage.mouseX >> 1, 
			lastPt.y + stage.mouseY >> 1
		);

		brushimg = new createjs.Bitmap(brush);
		brushimg.cache(0, 0, brush.width, brush.height);
		brushimg.x = nowMidPt.x - (brush.width / 2 * stroke * 0.02);
		brushimg.y = nowMidPt.y - (brush.height / 2 * stroke * 0.02);
		brushimg.scaleX = stroke * 0.02;
		brushimg.scaleY = stroke * 0.02;

		lastPt.x = stage.mouseX;
		lastPt.y = stage.mouseY;

		oldMidPt.x = nowMidPt.x;
		oldMidPt.y = nowMidPt.y;

		stage.addChild(brushimg);
		stage.update();
	}

	function handleMouseUp(event) {		
		isMouseDown = false;	
	}

	document.addEventListener('DOMContentLoaded', init);
})();