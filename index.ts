// Import stylesheets
import './style.css';

// point class
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.update = function () {
  this.x = this.x + 1;
  this.y = this.y + 1;
};

// blob class
function Blob(p, char) {
  this.p = p;
  this.char = char;
}

Blob.prototype.update = function () {
  this.p.update();
};

// letter blobs
const blobs = [];
// letter blob els
const blob_els = [];
// game internal count
let t = 0;

// core element
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Octopuz</h1>`;

// svg element
const svgDiv: SVGElement = document.querySelector('svg');

window.addEventListener('resize', layout);
layout();
init();

function layout() {
  svgDiv.setAttribute('width', '100%');
  svgDiv.setAttribute('height', window.innerHeight + 'px');
}

// init game
function init() {
  // create letter blobs
  for (let i = 0; i < 8; ++i) {
    blobs.push(new Blob(new Point(0, 0), 'A'));
  }
  for (let i = 0; i < 8; ++i) {
    const blob_el = document.querySelector('g#b-' + i);
    blob_els.push(blob_el);
  }

  gameloop();
}

// loop
function gameloop() {
  // window.requestAnimationFrame(gameloop);

  update();
  draw();
}

// update game
function update() {
  for (let i = 0; i < blobs.length; ++i) {
    console.log(blobs[i]);
    debugger;
    blobs[i].update();
  }
}

// draw game
function draw() {
  for (let i = 0; i < blobs.length; ++i) {
    const b = blobs[i];
    const b_el = blob_els[i];
    const x = b.p.x;
    const y = b.p.y;
    b_el.setAttribute('transform', `translate(${x}, ${y})`);
  }
  ++t;
}
