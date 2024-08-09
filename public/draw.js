const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');

canvas.setAttribute('width', '100');
canvas.setAttribute('height', '100');

const ctx = canvas.getContext('2d');


var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;

const canvasOffsetX = rect.left;
const canvasOffsetY = rect.top;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isPainting = false;
let isWrittenTo = false;
let lineWidth = 3;
let startX;
let startY;

function getOCR(url) {
    var dataURL = canvas.toDataURL('image/png');
    if (isWrittenTo) {
        $.ajax({
            url: url,
            type: "POST",
            data: {
                imgBase64: dataURL
            },
            success: function (data) {
                console.log(data);
                var ocrResult = document.getElementById('ocrResult');
                ocrResult.textContent = data;
            }
        });
        return;
    }

    var imageForm = document.getElementById('ocrphoto').files[0];

    var fReader = new FileReader();

    fReader.readAsDataURL(imageForm);
    fReader.onloadend = function (event) {
        var img = event.target.result;
        console.log(img)
        console.log(dataURL)

        console.log('should be going to the old ocr')
        $.ajax({
            url: url,
            type: "POST",
            data: {
                imgBase64: img
            },
            success: function (data) {
                console.log(data);
                var ocrResult = document.getElementById('ocrResult');
                ocrResult.textContent = data;
            }
        });

    }
}

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        isWrittenTo = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
});

toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
        console.log('waaaaaa')
    }
});

const draw = (e) => {
    if (!isPainting) {
        return;
    }
    isWrittenTo = true;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    var pos = getMousePos(canvas, e)
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    var pos = getMousePos(canvas, e)
    ctx.moveTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);