// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Fullscreen test2</h1>`;

const svgDiv: SVGElement = document.querySelector('svg');

window.addEventListener('resize', layout);
layout();

function layout() {
  svgDiv.setAttribute('width', '100%');
  svgDiv.setAttribute('height', window.innerHeight + 'px');
}
