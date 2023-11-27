import {move, down, up} from './src/draw.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
export {context};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onmousemove = move;
window.onmousedown = down;
window.onmouseup = up;
window.onresize = resize;
resize();
