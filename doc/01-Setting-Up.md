# 01: Setting Up 

Here we focus on setting up the environment so that the project can be written in ES6 and compiled down to ES5. I use **Webpack** and **Babel** for this purpose.



## ☑️ Tasks

- Install webpack
- Create webpack configuration file: `webpack.config.js`
- Create scripts `dev` and `start`
- Install babel and babel-polyfill
- Update webpack configuration
- Create babel configuration file: `.babelrc`



<br />




## 💻 Webpack configuration
What webpack is and what I'm going to use it for:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // looks for all files that end with '.js'
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

```

<details><summary><strong>Explanation of this configuration file</strong></summary>
<ul>
  <li>Point #1</li>
  </ul></details>

<br />



## 💬 Babel configuration file

```json
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 5 versions", "ie >= 8"]
        }
      }
    ]
  ]
}

````

**Explanation of this configuration file**

- 

## 🤖 NPM scripts

```json
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development --open"
  },
```

**Explanation of this configuration file**



```js

````