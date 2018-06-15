(function(){
	var canvas, stage, shape, lastPt, oldMidPt, color, stroke, lastPt, image, bitmap, brush1, brush2, brushselect, brushimg,
		isMouseDown = false;

	function init() {
		image             = new Image();
		image.onload      = handleComplete;
		image.crossOrigin = '*';
		image.src         = 'img/ShibaInu.png';
		brush1             = new Image();
		brush1.onload      = handleComplete;
		brush1.crossOrigin = '*';
		brush1.src         = 'img/brush1.png';
		brush2             = new Image();
		brush2.onload      = handleComplete;
		brush2.crossOrigin = '*';
		brush2.src         = 'img/brush2.png';
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
		if (two.checked) {
			brushselect = brush1;
		} else {
			brushselect = brush2;
		}
	}

	function handleMouseMove(event) {
		if ( !isMouseDown ) { return; };

		var nowMidPt = new createjs.Point(
			lastPt.x + stage.mouseX >> 1, 
			lastPt.y + stage.mouseY >> 1
		);

		brushimg = new createjs.Bitmap(brushselect);
		brushimg.cache(0, 0, brushselect.width, brushselect.height);
		brushimg.x = nowMidPt.x - (brushselect.width / 2 * stroke * 0.02);
		brushimg.y = nowMidPt.y - (brushselect.height / 2 * stroke * 0.02);
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