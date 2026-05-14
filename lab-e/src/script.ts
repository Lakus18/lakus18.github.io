interface Style {
  name: string;
  file: string;
}

function injectButtonStyles(): void {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #style-selector {
      display: flex;
      gap: 10px;
      margin: 20px 0;
      flex-wrap: wrap;
      justify-content: center;
    }

    .style-button {
      padding: 10px 20px;
      background-color: #333;
      color: #fff;
      border: 2px solid #646cff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: all 0.3s ease;
    }

    .style-button:hover {
      background-color: #444;
      transform: scale(1.05);
    }

    .style-button.active {
      background-color: #646cff;
      color: #fff;
      font-weight: bold;
      box-shadow: 0 0 10px #646cff;
    }
  `;
  document.head.appendChild(styleElement);
}

injectButtonStyles();

const styles: Style[] = [
  { name: 'Style 1', file: '/style-1.css' },
  { name: 'Style 2', file: '/style-2.css' },
  { name: 'Style 3', file: '/style-3.css' }
];

let currentStyle: Style = styles[0];

function loadCSS(href: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

loadCSS(currentStyle.file);

function generateStyleLinks(): void {
  const styleNav = document.createElement('nav');
  styleNav.id = 'style-selector';
  
  styles.forEach((style) => {
    const button = document.createElement('button');
    button.textContent = style.name;
    button.classList.add('style-button');
    
    if (style === currentStyle) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => changeStyle(style));
    styleNav.appendChild(button);
  });
  
  const header = document.querySelector('header');
  if (header) {
    header.appendChild(styleNav);
  }
}

function changeStyle(newStyle: Style): void {
  currentStyle = newStyle;
  
  const oldLink = document.querySelector('link[rel="stylesheet"]');
  if (oldLink) {
    oldLink.remove();
  }
  
  loadCSS(newStyle.file);
  
  document.querySelectorAll('.style-button').forEach((btn) => {
    btn.classList.remove('active');
  });
  event?.target instanceof HTMLElement && event.target.classList.add('active');
}

generateStyleLinks();

const msg: string = "Hello!";
alert(msg);


