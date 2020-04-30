// eslint-disable-next-line no-unused-vars
const findInNw = {
  initialized: false,
  lastSearched: '',
  total: 0,
  currentToken: 0,
  dataAttribute: 'data-find-in-nw-position',

  resetState: function () {
    this.lastSearched = '';
    this.total = 0;
    this.currentToken = 0;
  },

  create: {
    css: '/* PLACEHOLDER */',
    style: function () {
      const styleBlock = document.createElement('style');
      styleBlock.setAttribute('id', 'find-in-nw-style');
      styleBlock.innerText = this.css;

      return styleBlock;
    },
    container: function () {
      const container = document.createElement('div');
      container.setAttribute('id', 'find-in-nw-search-box');
      container.setAttribute('class', 'find-in-nw-search-box');

      return container;
    },
    input: function () {
      const input = document.createElement('input');
      input.setAttribute('id', 'find-in-nw-input');
      input.setAttribute('class', 'find-in-nw-input');
      input.setAttribute('placeholder', 'Find');

      return input;
    },
    element: function (el, id, value) {
      const element = document.createElement(el);
      element.setAttribute('id', 'find-in-nw-' + id);
      element.setAttribute('class', 'find-in-nw-' + id);
      element.innerHTML = value + '';

      return element;
    },

    composeSearchBox: function () {
      const container = this.container();

      container.appendChild(this.input());
      container.appendChild(this.element('span', 'current', 0));
      container.appendChild(this.element('span', 'of', '/'));
      container.appendChild(this.element('span', 'count', 0));
      container.appendChild(this.element('button', 'previous', '&and;'));
      container.appendChild(this.element('button', 'next', '&or;'));
      container.appendChild(this.element('button', 'close', '&times;'));

      return container;
    }
  },

  keyDownPressed: function () {
    const input = document.getElementById('find-in-nw-input');
    input.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        this.highlightNext();
      }
    }.bind(this));
  },
  inputChanged: function () {
    const input = document.getElementById('find-in-nw-input');
    input.addEventListener('input', function (evt) {
      evt.preventDefault();
      const value = evt.target.value;
      if (value && value !== this.lastSearched) {
        this.search(value);
      } else if (!value) {
        this.clearTokens();
      }
    }.bind(this));
  },
  previousButtonClicked: function () {
    const previous = document.getElementById('find-in-nw-previous');
    previous.addEventListener('click', function (evt) {
      evt.preventDefault();
      this.highlightPrevious();
    }.bind(this));
  },
  nextButtonClicked: function () {
    const next = document.getElementById('find-in-nw-next');
    next.addEventListener('click', function (evt) {
      evt.preventDefault();
      this.highlightNext();
    }.bind(this));
  },
  closeButtonClicked: function () {
    const close = document.getElementById('find-in-nw-close');
    close.addEventListener('click', function (evt) {
      evt.preventDefault();
      this.hideSearchBox();
    }.bind(this));
  },

  eventBinding: function () {
    this.keyDownPressed();
    this.inputChanged();
    this.previousButtonClicked();
    this.nextButtonClicked();
    this.closeButtonClicked();
  },
  keyBindings: function () {
    document.onkeydown = function (pressed) {
      // Check for `CTRL+F`
      if (pressed.ctrlKey && pressed.keyCode === 70) {
        pressed.preventDefault();
        this.showSearchBox();
        return false;
      // Check for `ESCAPE`
      } else if (pressed.keyCode === 27) {
        pressed.preventDefault();
        this.hideSearchBox();
        return false;
      }
    }.bind(this);
  },

  highlightPrevious: function () {
    this.currentToken = this.currentToken - 1;
    if (this.currentToken < 0) {
      this.currentToken = (this.total - 1);
    }
    this.updateCount();
    this.highlightCurrentToken();
  },
  highlightNext: function () {
    this.currentToken = this.currentToken + 1;
    if (this.currentToken > (this.total - 1)) {
      this.currentToken = 0;
    }
    this.updateCount();
    this.highlightCurrentToken();
  },

  showSearchBox: function () {
    const searchBox = document.getElementById('find-in-nw-search-box');
    const input = document.getElementById('find-in-nw-input');

    searchBox.classList.add('find-in-nw-search-box-visible');

    const selectionText = window.getSelection().toString();
    if (selectionText && selectionText.indexOf('\n') < 0) {
      input.value = selectionText;
    }
    if (input.value) {
      this.search(input.value);
    }

    input.focus();
  },
  hideSearchBox: function () {
    const searchBox = document.getElementById('find-in-nw-search-box');
    searchBox.classList.remove('find-in-nw-search-box-visible');

    document.body.focus();
    this.clearTokens();
  },

  getElementsToSearch: function () {
    const elements = [];

    for (let i = 0; i < document.body.children.length; i++) {
      let child = document.body.children[i];
      if (child.tagName.toLowerCase() !== 'style' && child.tagName.toLowerCase() !== 'script') {
        elements.push(child);
      }
    }

    return elements;
  },

  setDataPositionAttribute: function () {
    let index = 0;
    let searchLength = this.lastSearched.length;
    let tempLength = searchLength;

    const tokens = document.getElementsByClassName('find-in-nw-token');

    [...tokens].forEach(function (token) {
      let tokenLength = token.innerText.length;
      token.setAttribute(this.dataAttribute, index);

      if (tokenLength === searchLength) {
        index = index + 1;
        tempLength = searchLength;
      } else {
        tempLength = tempLength - tokenLength;
        if (tempLength < 1) {
          index = index + 1;
          tempLength = searchLength;
        }
      }
    }.bind(this));

    if (!tokens) {
      index = 0;
    }
    this.total = index;
  },
  highlightCurrentToken: function () {
    const currentTokenClass = 'find-in-nw-current-token';

    let previousTokens = document.getElementsByClassName(currentTokenClass);
    let currentTokens = document.querySelectorAll('.find-in-nw-token[' + this.dataAttribute + '="' + this.currentToken + '"]');

    if (previousTokens && previousTokens.length) {
      previousTokens = [...previousTokens];
      previousTokens.forEach(function (token) {
        token.classList.remove(currentTokenClass);
      });
    }

    if (currentTokens && currentTokens.length) {
      currentTokens = [...currentTokens];
      currentTokens.forEach(function (token) {
        token.classList.add(currentTokenClass);
      });

      currentTokens[0].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    }
  },

  updateCount: function () {
    const current = document.getElementById('find-in-nw-current');
    const count = document.getElementById('find-in-nw-count');

    let currentValue = 0;
    if (this.total !== 0) {
      currentValue = this.currentToken + 1;
    }

    current.innerHTML = (currentValue).toLocaleString();
    count.innerHTML = this.total.toLocaleString();
  },
  clearTokens: function () {
    const tokens = document.getElementsByClassName('find-in-nw-token');
    let parents = [];
    for (let i = 0; i < tokens.length; i++) {
      parents.push(tokens[i].parentNode);
    }
    parents = Array.from(new Set(parents));

    while (tokens.length) {
      tokens[0].replaceWith(...tokens[0].childNodes);
    }
    parents.forEach(function (element) {
      element.normalize();
    });

    this.resetState();
    this.updateCount();
  },
  search: function (text) {
    this.clearTokens();
    const elements = this.getElementsToSearch();

    elements.forEach(function (element) {
      window.findAndReplaceDOMText(element, {
        find: text,
        wrap: 'mark',
        wrapClass: 'find-in-nw-token'
      });
    });

    this.lastSearched = text;
    this.setDataPositionAttribute();
    this.updateCount();
    this.highlightCurrentToken();
  },
  initialize: function () {
    if (!this.initialized) {
      const styleBlock = this.create.style();
      const searchBox = this.create.composeSearchBox();
      document.body.append(searchBox);
      document.body.append(styleBlock);
      this.keyBindings();
      this.eventBinding();
      this.initialized = true;
    }
  }
};
