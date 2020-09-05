# 01: Planning

For developing this app, I am going to use the **Model-view-Controller Architecture** and **ES6 Modules** as well as the **API** [forkify-api](http://forkify-api.herokuapp.com/) by Jonas Schmedtmann.

<br />




## 🌲 Structure
1. **Model**: one for each different aspect of our app. Where we do AJAX calls, get recipes from a certain search query from an API.
   1. `Search.js`
   2. `Recipe.js`
   3. `List.js`
   4. `Likes.js`
2. **Controller** connects both - `index.js`
3. **View**: one for each part of the app. User Interface, print results
   1. `searchView.js`
   2. `recipeView.js`
   3. `listView.js`
   4. `likesView.js`

