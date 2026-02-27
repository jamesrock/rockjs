const numberFormatter = new Intl.NumberFormat('en-GB');
const currencyFormatter = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'});

export const random = (min, max) => (Math.floor(Math.random()*((max-min)+1))+min);
export const randomIndex = (a) => random(0, a.length-1);
export const pluckRandom = (a) => a.splice(randomIndex(a), 1)[0];
export const pluckFirst = (a) => a.splice(0, 1)[0];
export const pluckLast = (a) => a.splice(a.length-1, 1)[0];
export const getRandom = (a) => a[randomIndex(a)];
export const getFirst = (a) => a[0];
export const getLast = (a) => a[a.length-1];
export const isOrientation = (orientation) => matchMedia(`(orientation: ${orientation})`).matches;
export const minWidth = (width) => matchMedia(`(min-width: ${width}px)`).matches;
export const minHeight = (height) => matchMedia(`(min-height: ${height}px)`).matches;
export const isColorScheme = (colorScheme) => matchMedia(`(prefers-color-scheme: ${colorScheme})`).matches;
export const isLandscape = () => isOrientation('landscape');
export const isPortrait = () => isOrientation('portrait');
export const isTiny = () => !minWidth(450);
export const isDarkMode = () => isColorScheme('dark');
export const makeEven = (a) => (a % 2 === 1 ? a - 1 : a);
export const limit = (value, max) => (value > max ? max : value);
export const pad = (a) => a < 10 ? `0${a}` : a;
export const formatNumber = (n) => numberFormatter.format(n);
export const formatCurrency = (n) => currencyFormatter.format(n);
export const formatDate = (date, type = 'short') => date.toLocaleDateString('en-GB', { dateStyle: type });
export const getDateString = (type = 'short') => formatDate(new Date(), type);
export const getTimeString = (type = 'short') => new Date().toLocaleTimeString('en-GB', { timeStyle: type });
export const getDateTimeString = (type = 'short') => `${getDateString(type)} ${getTimeString(type)}`;
export const isValidKey = (key, options) => options.includes(key);
export const makeArray = (length, mapper = (a, i) => i) => Array.from({length}, mapper);
export const floorTo = (number, to = 1) => (Math.floor(number*to)/to);
export const roundTo = (number, to = 1) => (Math.round(number*to)/to);
export const ceilTo = (number, to = 1) => (Math.ceil(number*to)/to);
export const getXPercentOfY = (x, y) => (y*(x/100));
export const getXAsPercentOfY = (x, y) => ((x/y)*100);
// to be removed
export const formatMinutes = (ms) => pad(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)));
export const formatSeconds = (ms) => pad(Math.floor((ms % (1000 * 60)) / 1000));
export const formatTime = (ms) => `${formatMinutes(ms)}:${formatSeconds(ms)}`;

const sortingMethods = {
	'0-9': (prop) => (a, b) => prop(a)-prop(b),
	'9-0': (prop) => (a, b) => prop(b)-prop(a),
	'A-Z': (prop) => (a, b) => {
    a = prop(a);
    b = prop(b);
    if(a<b) {
      return -1;
    }
    else if(a>b) {
      return 1;
    }
    else {
      return 0;
    };
  },
	'Z-A': (prop) => (a, b) => {
    a = prop(a);
    b = prop(b);
    if(b<a) {
      return -1;
    }
    else if(b>a) {
      return 1;
    }
    else {
      return 0;
    };
  }
};

export const sort = (target, prop, method) => target.sort(sortingMethods[method](prop));

export const setDocumentHeight = () => {
  document.documentElement.style.height = window.navigator.standalone ? '100vh' : '100svh';
};

export const empty = (node) => {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  };
};

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
		className.split('.').forEach((a) => {
			node.classList.add(a);
		});
	};
  return node;
};

export const createSVGNode = (type = 'svg', className) => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', type);
  if(className) {
		className.split('.').forEach((a) => {
			node.classList.add(a);
		});
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

export const createContainer = (className) => createNode('div', className);

export const createSelect = (options) => {
  const node = createNode('select');
  options.forEach(([label, value]) => {
    const option = createOption(label, value);
    node.appendChild(option);
  })
  return node;
};

export const createOption = (label = '{label}', value = 0) => {
  const node = createNode('option');
  node.innerText = label;
  node.value = value;
  return node;
};

export const createHeading = (level = 1, label = '{label}') => {
  const node = createNode(`h${level}`);
  node.innerText = label;
  return node;
};

export const createRadio = (value = 0, name = '{name}', id = '{id}', checked = false) => {
  const node = createInput(value, 'radio');
  node.name = name;
  node.id = id;
  node.checked = checked;
  return node;
};

export const createLabel = (label = '{label}', id = '{id}', className) => {
  const node = createNode('label', className);
  node.innerHTML = label;
  node.setAttribute('for', id);
  return node;
};

export const makeToggle = (options, name, defaultValue, className = 'toggle') => {
  const node = createNode('div', className);
	options.forEach(([label, value, optionClassName]) => {
		const optionNode = createNode('div', 'toggle-item');
		const radioNode = createRadio(value, name, `${name}-${value}`, value===defaultValue);
		const labelNode = createLabel(label, radioNode.id, optionClassName);
		optionNode.appendChild(radioNode);
		optionNode.appendChild(labelNode);
		node.appendChild(optionNode);
  });
  return node;
};

export const makeBitArray = (size) => {
  let bob = 2**size;
  return makeArray(size, () => {
    bob = bob/2;
    return bob;
  });
};

const makeBitMapItem = (a, size) => {
  const ref = makeBitArray(size);
  let leftover = a;
  return makeArray(size, (v, i) => {
    if(leftover >= ref[i]) {
      leftover -= ref[i];
      return 1;
    }
    else {
      return 0;
    };
  });
};

export const makeBitMap = (size) => {
  return makeArray(2**size, (a, i) => makeBitMapItem(i, size));
};

export const makeHexMap = (full = true) => {
  const out = [];
  const hexMap = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  if(full) {
    makeArray(hexMap.length).forEach((x) => {
      makeArray(hexMap.length).forEach((y) => {
        out.push(`${hexMap[x]}${hexMap[y]}`);
      });
    });
  }
  else {
    return hexMap;
  };
  return out;
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
  destroy() {

    this.node.parentNode.removeChild(this.node);
    return this;

  };
  setStyle(key, value) {

		this.node.style[key] = value;
		return this;

	};
  setProp(key, value) {

    this.node.dataset[key] = value;
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

export class BrickMaker extends DisplayObject {
	constructor({
    size = 4,
    type = 'binary',
    color = 'red',
    scale = 30,
    gap = 1,
    prefix = '0x'
  } = {}) {

		super();

		this.color = color;
		this.size = size;
    this.scale = scale;
    this.type = type;
    this.gap = gap;
    this.prefix = prefix;
    this.hexMap = size*size > 16 ? makeHexMap() : makeHexMap(false);
    this.typeValues = {
      'binary': makeArray(size*size, () => 1),
      'hex': makeBitArray(size)
    };

		const node = this.node = createNode('div', 'brick-maker');
		const bits = this.bits = [];

    this.setColor(color);
		node.style.width = node.style.height = `${scale*size + (gap*(size-1))}px`;
		node.style.gap = `${gap}px`;

		makeArray(size).forEach((y) => {
			makeArray(size).forEach((x) => {

				const bit = createNode('div', 'brick-maker-bit');
				bit.style.width = bit.style.height = `${scale}px`;
				bit.dataset.x = x;
				bit.dataset.y = y;
				bit.dataset.value = this.typeValues[this.type][x];
				bit.dataset.active = 'N';
				node.appendChild(bit);

				bits.push(bit);

				bit.addEventListener('click', () => {
					bit.dataset.active = bit.dataset.active === 'Y' ? 'N' : 'Y';
					this.calculate();
				});

			});
		});

	};
  calculate() {

    let total = null;
    switch(this.type) {
      case 'binary':
        total = makeArray(this.size*this.size, () => 0);
        this.bits.forEach((bit, i) => {
          if(bit.dataset.active==='Y') {
            total[i] = Number(bit.dataset.value);
          };
        });
        this.value = JSON.stringify(total);
      break;
      case 'hex':
        total = makeArray(this.size, () => 0);
        makeArray(this.size).forEach((y) => {
          this.bits.filter((bit) => bit.dataset.y == y).forEach((bit) => {
            if(bit.dataset.active==='Y') {
              total[y] += Number(bit.dataset.value);
            };
          });
          total[y] = this.hexMap[total[y]];
        });
        this.value = `${this.prefix}${total.join('')}`;
      break;
    };
    this.dispatchEvent('result');

  };
  invert() {

    this.bits.forEach((bit) => {
      bit.dataset.active = bit.dataset.active === 'Y' ? 'N' : 'Y';
    });
    this.calculate();

    return this;

  };
  randomise() {

    this.bits.forEach((bit) => {
      bit.dataset.active = getRandom(['Y', 'N']);
    });
    this.calculate();

    return this;

  };
  clear() {

    this.bits.forEach((bit) => {
      bit.dataset.active = 'N';
    });
    this.calculate();

    return this;

  };
  setColor(color) {

    this.color = color;
    this.node.style.setProperty('--color', this.color);
    return this;

  };
  value = null;
};

export class Collection extends Array {
	constructor() {

    super();

	};
	getItemByKeyValue(key, value) {

		return this.filter((item) => item[key]===value)[0];

	};
	getItemsByKeyValue(key, value) {

		return this.filter((item) => item[key]===value);

	};
	append(item) {

		this.push(item);
		return item;

	};
	prepend(item) {

		this.unshift(item);
		return item;

	};
	exists(value) {

		return (this.indexOf(value)>-1);

	};
	random() {

		return getRandom(this);

	};
	remove(item) {

		return this.removeAt(this.getIndexOf(item));

	};
	removeAt(index) {

		this.splice(index, 1);
		return this;

	};
	addAt(item, index) {

		this.splice(index, 0, item);
		return item;

	};
	first() {

		return this[0];

	};
	last() {

		return this[this.length-1];

	};
	swap(aIndex, bIndex) {

		var
		aProp = this[aIndex],
		bProp = this[bIndex];

		this[aIndex] = bProp;
		this[bIndex] = aProp;

		return this;

	};
	pushift() {

		this.push(this.shift());
		return this;

	};
	shuffle() {

		return shuffle(this);

  };
};

export class Time {
  second = 1000;
  minute = (this.second * 60);
  hour = (this.minute * 60);
  day = (this.hour * 24);
  year = (this.day * 365);
	getSeconds(ms) {
		return floorTo(ms / this.second);
	};
	getMinutes(ms) {
		return floorTo(ms / this.minute);
	};
	getHours(ms) {
		return floorTo(ms / this.hour);
	};
	getDays(ms) {
		return floorTo(ms / this.day);
	};
	getYears(ms) {
		return floorTo(ms / this.year);
	};
  getMillisecondsInHour(ms) {
		return (ms % this.hour);
	};
  getMillisecondsInMinute(ms) {
		return (ms % this.minute);
	};
	getMillisecondsInDay(ms) {
		return (ms % this.day);
	};
  getSecondsInDay(ms) {
		return (this.getSeconds(ms) % this.day);
	};
	getMinutesInDay(ms) {
		return (this.getMinutes(ms) % this.day);
	};
	getHoursInDay(ms) {
		return (this.getHours(ms) % this.day);
	};
	getDaysInYear(ms) {
		return (this.getDays(ms) % this.year);
	};
  getMinutesInHour(ms) {
		return floorTo(this.getMillisecondsInHour(ms) / this.minute);
	};
  getSecondsInMinute(ms) {
		return floorTo(this.getMillisecondsInMinute(ms) / this.second);
	};
  formatSeconds = (ms) => pad(this.getSecondsInMinute(ms));
  formatMinutes = (ms) => pad(this.getMinutesInHour(ms));
  formatHours = (ms) => pad(this.getHours(ms));
  format = (ms) => `${this.formatMinutes(ms)}:${this.formatSeconds(ms)}`;
};

export class PlayingCard extends DisplayObject {
  constructor(deck, value, suit) {

    super();

    this.deck = deck;
    this.value = value;
    this.suit = suit;
    this.rawValue = (this.deck.values.indexOf(this.value) + 1);
    this.id = `${this.value}${this.suit}`;
    this.color = this.deck.getSuitColor(this.suit);
    this.icon = this.deck.getSuitIcon(this.suit);
    this.node = this.make();

  };
  make() {

    const
		node = createNode('div', 'card'),
    svg = createSVGNode('svg'),
		use = createSVGNode('use');

		use.setAttribute('href', `${this.deck.sprite}#${this.suit}${this.value}`);

    svg.append(use);
    node.append(svg);

    return node;

  };
};

export class DeckOfPlayingCards {
  constructor({
    sprite = '/sprite.svg',
    saved = [],
    cardMaker = (deck, value, suit) => new PlayingCard(deck, value, suit)
  } = {}) {

    this.sprite = sprite;
    this.cardMaker = cardMaker;
    this.cards = saved.length ? this.makeFromSaved(saved) : this.make();
    this.map = this.makeMap();
    this.shuffledMap = this.makeShuffledMap();

  };
  make() {

    return shuffle(shuffle(this.makeDeckValues().map(([value, suit]) => this.cardMaker(this, value, suit))));

  };
  makeMap() {

    var out = {};
    this.cards.forEach((card) => {
      out[card.id] = card;
    });
    return out;

  };
  makeShuffledMap() {

    return this.cards.map((card) => card.id);

  };
  makeSaveMap() {

    return this.cards.map((card) => [card.value, card.suit]);

  };
  makeFromSaved(saved) {

    return saved.map(([value, suit]) => this.cardMaker(this, value, suit));

  };
  appendTo(target) {

    this.shuffledMap.forEach((id) => {
      this.map[id].appendTo(target);
    });

    return this;

  };
  destroy() {

    this.shuffledMap.forEach((id) => {
      this.map[id].destroy();
    });

    return this;

  };
  makeSuitValues() {

    return makeArray(this.suits.length).map((suit) => this.suits[suit]);

  };
  makePipValues() {

    return makeArray(this.values.length).map((value) => this.values[value]);

  };
  makeDeckValues() {

    var out = [];

    this.makeSuitValues().forEach((suit) => {
      this.makePipValues().forEach((value) => {
        out.push([value, suit]);
      });
    });

    return out;

  };
  makeCard(value, suit) {

    return this.cardMaker(this, value, suit);

  };
  indexOf(id) {

    return this.shuffledMap.indexOf(id);

  };
  getCard(index = 0) {

    return this.cards[index];

  };
  getSuitIcon(suit) {

    return this.suitIcons[suit];

  };
  getSuitColor(suit) {

    return this.suitColors[suit];

  };
  suits = [
    'C',
    'D',
    'H',
    'S'
  ];
  values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K'
  ];
  suitIcons = {
    'C': '&#9827;',
    'D': '&#9830;',
    'H': '&#9829;',
    'S': '&#9824;'
  };
  suitColors = {
    'C': 'black',
    'D': 'red',
    'H': 'red',
    'S': 'black'
  };
};
