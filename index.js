function getImage(name){
    var API_KEY = '18163249-030c794f94b190a9cfe26d956';
    URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(name)+"&per_page=3";
            return new Promise((resolve,reject)=>{
                $.getJSON(URL,function(data){
                    resolve (data.hits[0].webformatURL)
                })
            })
}

let src;
let output;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

var startX;
var startY;

var texts = [];

var selectedText = -1;
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $canvas.css('background-image','url("'+e.target.result+'")');    
        };

        reader.readAsDataURL(input.files[0]);
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        ctx.fillStyle=text.color;
        ctx.fillText(text.text, text.x, text.y);
    }
}

function textHittest(x, y, textIndex) {
    var text = texts[textIndex];
    return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
}

function handleMouseDown(e) {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    for (var i = 0; i < texts.length; i++) {
        if (textHittest(startX, startY, i)) {
            selectedText = i;
        }
    }
}

function handleMouseUp(e) {
    e.preventDefault();
    selectedText = -1;
}

function handleMouseOut(e) {
    e.preventDefault();
    selectedText = -1;
}

function handleMouseMove(e) {
    if (selectedText < 0) {
        return;
    }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var text = texts[selectedText];
    text.x += dx;
    text.y += dy;
    draw();
}

$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
    handleMouseUp(e);
});
$("#canvas").mouseout(function (e) {
    handleMouseOut(e);
});
$('#view').click(async function(){
    bg=$('#image').val();
    if(bg==undefined){
        alert('Enter valid inputs')
    }
    else{
        src =await getImage(bg);
    
        $canvas.css('background-image','url("'+src+'")');    
    }
})
$("#submit").click( function () {
    size=$('#size').val();
    console.log(size);
    color=$('#color').val();
    var text = {
        text: $("#textCont").val(),
        x: 20,
        y: 50,
        color:color
    };
    ctx.font = size+"px verdana";
    text.width = ctx.measureText(text.text).width;
    text.height = 16;

    texts.push(text);

    console.log(texts);
    draw();
    document.getElementById('textCont').value='';
});