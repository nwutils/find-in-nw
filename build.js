const fs = require('fs');
const sass = require('sass');
const uglify = require('terser');

const sassOptions = {
  file: process.cwd() + '/src/index.sass',
  indentedSyntax: true,
  outputStyle: 'compressed'
};
const sassResult = sass.renderSync(sassOptions);
const css = String(sassResult.css);

let findAndReplaceDOMText;
let findInNw;

try {
  findAndReplaceDOMText = String(fs.readFileSync('./node_modules/findandreplacedomtext/src/findAndReplaceDOMText.js'));
  findInNw = String(fs.readFileSync('./src/index.js'));
} catch (error) {
  console.log(error);
}

findInNw = findInNw.replace('/* PLACEHOLDER */', css);

const result = uglify.minify(findAndReplaceDOMText + findInNw);

try {
  fs.writeFileSync('./dist/find-in-nw.js', result.code + '\n');
} catch (error) {
  console.log(error);
}
