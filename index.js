const formatMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const formatSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
const formatter = new Intl.NumberFormat('en-GB');
const currencyFormatter = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'});

export const random = (min, max) => (Math.floor(Math.random()*((max-min)+1))+min);
export const randomIndex = (a) => random(0, a.length-1);
export const pluckRandom = (a) => a.splice(randomIndex(a), 1)[0];
export const pluckFirst = (a) => a.splice(0, 1)[0];
export const pluckLast = (a) => a.splice(a.length-1, 1)[0];
export const getRandom = (a) => a[randomIndex(a)];
export const getFirst = (a) => a[0];
export const getLast = (a) => a[a.length-1];
export const isLandscape = () => window.matchMedia('(orientation: landscape)').matches;
export const isTiny = () => !window.matchMedia('(min-width: 450px)').matches;
export const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
export const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
export const limit = (value, max) => value > max ? max : value;
export const formatTime = (t) => `${pad(formatMinutes(t))}:${pad(formatSeconds(t))}`;
export const formatNumber = (n) => formatter.format(n);
export const formatCurrency = (n) => currencyFormatter.format(n);
export const getDateString = (type = 'short') => new Date().toLocaleDateString('en-GB', { dateStyle: type });
export const getTimeString = (type = 'short') => new Date().toLocaleTimeString('en-GB', { timeStyle: type });
export const getDateTimeString = (type = 'short') => `${getDateString(type)} ${getTimeString(type)}`;
export const isValidKey = (key, options) => options.includes(key);
export const makeArray = (length, mapper = (a, i) => i) => Array.from({length}, mapper);

export const shuffle = (a) => {
  for(let i = 0; i < a.length; i++) {
    const b = Math.floor(Math.random() * a.length);
    [a[i], a[b]] = [a[b], a[i]];
  };
  return a;
};

export const createNode = (type, className) => {
  const node = document.createElement(type);
  if(className) {
    node.classList.add(className);
  };
  return node;
};

export const createButton = (label = '{label}', className) => {
  const btn = createNode('button', className);
  btn.innerText = label;
  return btn;
};

export const createInput = (value = 0, type = 'number') => {
  const input = createNode('input');
  input.type = type;
  input.value = value;
  return input;
};

export const createOutput = (rows = 7) => {
  const textarea = createNode('textarea');
  textarea.rows = rows;
  return textarea;
};

export const createContainer = (className) => {
  return createNode('div', className);
};

export const createSelect = (options) => {
  const node = createNode('select');
  options.forEach(([label, value]) => {
    const option = createOption(label, value);
    node.appendChild(option);
  })
  return node;
};

const createOption = (label = '{label}', value = 0) => {
  const node = createNode('option');
  node.innerText = label;
  node.value = value;
  return node;
};

export class Storage {
  constructor(namespace) {

    this.namespace = namespace;

  };
  get(key) {

    var
    existing = this.fetch();

    return existing[key];

  };
  set(key, value) {

    var
    existing = this.fetch();

    existing[key] = value;

    this.commit(existing);

    return this;

  };
  remove(key) {

    var
    existing = this.fetch();

    delete existing[key];

    this.commit(existing);

    return this;

  };
  fetch() {

    return JSON.parse(localStorage.getItem(this.namespace)||'{}');

  };
  clear() {

    this.commit({});

  };
  commit(obj) {

    localStorage.setItem(this.namespace, JSON.stringify(obj));

  };
};

export class GUID {
  constructor() {
    
    this.chars = [...this.uppercase, ...this.lowercase, ...this.numeric];

  };
  uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  numeric = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  segment() {
    
    return makeArray(4, (a, i) => getRandom(i > 0 ? this.chars : this.uppercase)).join('');

  };
  get() {
    
    return makeArray(this.segments, () => this.segment()).join('-');
    
  };
  segments = 3;
};

export class Scaler {
  constructor(scale) {
    this.scale = scale;
  }
  inflate(value) {
		return value * this.scale;
	};
	deflate(value) {
		return value / this.scale;
	};
};

export class Rounder {
  constructor(tolerance) {
    this.tolerance = tolerance;
  };
  round(value) {
		return Math.round(value / this.tolerance) * this.tolerance;
	};
};

export class DisplayObject {
  appendTo(to) {

		to.appendChild(this.node);
		return this;

	};
	addEventListener(event, handler, passive = true) {
		
		this.node.addEventListener(event, handler, {passive});
		return this;
		
	};
	dispatchEvent(event) {
		
		this.node.dispatchEvent(new Event(event));
		return this;

	};
};

export class GameBase extends DisplayObject {
  constructor(name) {

    super();
    
    this.node = createNode('div', name);
		this.gameOverNode = createNode('div', 'game-over');
		this.canvas = createNode('canvas', 'game-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.storage = new Storage(`me.jamesrock.${name}`);
    
  };
  showGameOverScreen() {

		const best = this.storage.get('best') || 0;
		this.storage.set('best', this.score > best ? this.score : best);
		
		this.gameOverNode.innerHTML = `\
			<div class="game-over-body">\
				<h1>Game over!</h1>\
				<div>\
					<p class="score">${formatNumber(this.score)}</p>\
					<p class="best">Best: ${formatNumber(this.storage.get('best'))}</p>\
				</div>\
				<p class="continue">Tap to continue</p>\
			</div>`;
		this.gameOver = true;
		this.gameOverNode.dataset.active = true;

		return this;

	};
};
