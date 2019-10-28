// eslint-disable-next-line no-unused-vars
const findInNw = {
  initialized: false,
  lastSearched: '',

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
    count: function () {
      const count = document.createElement('span');
      count.setAttribute('id', 'find-in-nw-count');
      count.setAttribute('class', 'find-in-nw-count');
      count.innerHTML = '0';

      return count;
    },
    close: function () {
      const button = document.createElement('button');
      button.setAttribute('id', 'find-in-nw-close');
      button.setAttribute('class', 'find-in-nw-close');
      button.innerHTML = '&times;';

      return button;
    },

    composeSearchBox: function () {
      const container = this.container();
      const input = this.input();
      const count = this.count();
      const close = this.close();

      container.appendChild(input);
      container.appendChild(count);
      container.appendChild(close);

      return container;
    }
  },

  closeButtonClicked: function () {
    const close = document.getElementById('find-in-nw-close');
    close.addEventListener('click', function (evt) {
      evt.preventDefault();
      this.hideSearchBox();
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

  eventBinding: function () {
    this.closeButtonClicked();
    this.inputChanged();
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

  showSearchBox: function () {
    const searchBox = document.getElementById('find-in-nw-search-box');
    const input = document.getElementById('find-in-nw-input');

    searchBox.classList.add('find-in-nw-search-box-visible');
    input.focus();
  },
  hideSearchBox: function () {
    const searchBox = document.getElementById('find-in-nw-search-box');
    const input = document.getElementById('find-in-nw-input');

    searchBox.classList.remove('find-in-nw-search-box-visible');
    document.body.focus();

    input.value = '';
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

  updateCount: function () {
    const tokens = document.getElementsByClassName('find-in-nw-token');
    const count = document.getElementById('find-in-nw-count');
    count.innerHTML = tokens.length.toLocaleString();
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

    this.lastSearched = '';
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
    this.updateCount();
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
