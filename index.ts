// Import stylesheets
import './style.css';

// physics constants
const FRICTION = 0.975;
const REST = 23;

// point class
function Point(x, y) {
  this.x = x;
  this.y = y;
  this.ax = 0;
  this.ay = 0;
}

Point.prototype.update = function () {
  this.ax *= FRICTION;
  this.ay *= FRICTION;
  this.x = this.x + this.ax;
  this.y = this.y + this.ay;
};

Point.prototype.clone = function () {
  return new Point(this.x, this.y);
};

// constraint class
function Constraint(rest, a, b) {
  this.rest = rest;
  this.a = a;
  if (typeof b === 'undefined' || typeof b === null) {
    this.b = a.clone();
    this.pin = true;
  } else {
    this.b = b;
  }
}

Constraint.prototype.update = function () {
  let dx = this.a.x - this.b.x;
  let dy = this.a.y - this.b.y;
  let len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) {
    len += 0.001;
  }
  let dist = 1 * (this.rest - len) * 0.5 * -1;
  let ddx = this.b.x + dx * 0.5;
  let ddy = this.b.y + dy * 0.5;
  dx /= len;
  dy /= len;
  if (!this.pin) {
    this.b.x = ddx + dx * 0.5 * this.rest * -1;
    this.b.y = ddy + dy * 0.5 * this.rest * -1;
    this.b.ax = this.b.ax + dx * dist;
    this.b.ay = this.b.ay + dy * dist;
  }
  this.a.x = ddx + dx * 0.5 * this.rest;
  this.a.y = ddy + dy * 0.5 * this.rest;
  this.a.ax = this.a.ax + dx * -dist;
  this.a.ay = this.a.ay + dy * -dist;
};

// blob class
function Blob(p, char) {
  this.p = p;
  this.char = char;
}

Blob.prototype.update = function () {
  this.p.update();
};

// constraints
const constraints = [];
// letter blobs
const blobs = [];
// letter blob els
const blob_els = [];
// game internal count
let t = 0;

// svg element
const svgDiv: SVGElement = document.querySelector('svg');

window.addEventListener('resize', layout);
layout();
init();

function layout() {
  svgDiv.setAttribute('width', '100%');
  svgDiv.setAttribute('height', window.innerHeight + 'px');
}

function getPointOnCircle(i) {
  const cx = 50;
  const cy = 50;
  const angle = (Math.PI / 4) * i;
  const radius = 30;
  const x = cx + Math.sin(angle) * radius;
  const y = cy + Math.cos(angle) * radius;
  return { x, y };
}

// init game
function init() {
  // create letter blobs
  for (let i = 0; i < 8; ++i) {
    const { x, y } = getPointOnCircle(i);
    blobs.push(new Blob(new Point(x, y), 'A'));
    if (i > 0) {
      // create constraint
      const constraint = new Constraint(REST, blobs[i - 1].p, blobs[i].p);
      constraints.push(constraint);
    }
  }
  const constraint = new Constraint(
    REST,
    blobs[blobs.length - 1].p,
    blobs[0].p
  );
  constraints.push(constraint);
  for (let i = 0; i < 8; ++i) {
    const { x, y } = getPointOnCircle(i);
    const blob_el = document.querySelector('g#b-' + i);
    const debug_el = document.querySelector('g#d-' + i);
    debug_el.setAttribute('transform', `translate(${x}, ${y})`);
    blob_el.addEventListener('mousedown', handler, false);
    blob_els.push(blob_el);
  }

  gameloop();
}

// handle click
function handler(e) {
  console.log(e.currentTarget);
}

// loop
function gameloop() {
  window.requestAnimationFrame(gameloop);
  update();
  draw();
}

// update game
function update() {
  for (let i = 0; i < blobs.length; ++i) {
    blobs[i].update();
  }
  for (let i = 0; i < constraints.length; ++i) {
    constraints[i].update();
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
