const timeToMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const timeToSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
const formatter = new Intl.NumberFormat('en-GB');

export const random = (min, max) => (Math.floor(Math.random()*((max-min)+1))+min);
export const randomIndex = (a) => random(0, a.length-1);
export const pluckRandom = (a) => a.splice(randomIndex(a), 1)[0];
export const pluckFirst = (a) => a.splice(0, 1)[0];
export const pluckLast = (a) => a.splice(a.length-1, 1)[0];
export const getRandom = (a) => a[randomIndex(a)];
export const isLandscape = () => window.matchMedia('(orientation: landscape)').matches;
export const isTiny = () => !window.matchMedia('(min-width: 450px)').matches;
export const timeToDisplay = (time) => `${pad(timeToMinutes(time))}:${pad(timeToSeconds(time))}`;
export const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
export const limit = (value, max) => value > max ? max : value;
export const formatNumber = (n) => formatter.format(n);
export const shuffle = (array) => {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
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
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  return input;
};

export const createOutput = () => {
  const textarea = document.createElement('textarea');
  textarea.rows = 7;
  return textarea;
};

export const createContainer = (className = '') => {
  return createNode('div', className);
};

export const createSelect = (options) => {
  const node = document.createElement('select');
  options.forEach(([label, value]) => {
    const option = createOption(label, value);
    node.appendChild(option);
  })
  return node;
};

const createOption = (label = '', value = '') => {
  const node = document.createElement('option');
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

    return JSON.parse(localStorage.getItem(this.namespace)||"{}");

  };
  clear() {

    this.commit({});

  };
  commit(obj) {

    localStorage.setItem(this.namespace, JSON.stringify(obj));

  };
};
