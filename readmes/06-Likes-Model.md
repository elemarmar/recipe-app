# 06: Likes Model

Two new files are created: `models/Likes.js` and `views/likesView.js`



## ☑️ Tasks

- Recipe Model
- Connecting Recipe Model to Controller
- Recipe View
- Recipe servings 

  

<br />



## ⚒️ Building the Likes Model



**Likes.js**

```js
export default class Likes {
  	constructor() {
      this.likes = [];
    }
}
```

We create the method to add a new item to the array:

```js
addItem (id, title, author, img) {
  const like = {
    id,
    title,
    author,
    img
  }
  this.likes.push(like);
  return like;
}
```

We need a unique id for each item, for when we want toupdate their count, etc. In order to so we'll use a third-party package to generate these IDs. [uniqid](https://github.com/adamhalasz/uniqid)



```js
deleteItem (id) {
  const index = this.likes.findIndex(el => el.id === id);
  this.items.splice(index, 1);
}
```



Test if we have a like in our array that has the id that we pass iin

```js
isLiked(id) {
  return this.likes.findIndex(el => el.id === id) !== -1;
}
```

Explain 



Simple get number of likes

```js
getNumLikes() {
  return this.likes.length;
}
```



In our controller.

```js
import Likes from './models/Likes'
```





<br >



## ⚒️ Building the Likes Controller

**index.js**

```js
/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  
  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
		const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    
    // toggle the like button

    // Add like to the UI list
    
  // User has liked current recipe
  } else {
    // Remove like from the state
    state.like.deleteLike(currentID);
    // toggle the like button
    
    // Remove like from UI list
    
  }
};


```

WE TRIGGER THE like in the like button so we add event listener. We add a event listener for that button in the handling recipe button click 

```js
//...
} else if (ev.target.matches('.recipe__love, .recipe__love *')) {
  // like controller
  controlLike();
}
```



---



## ⚒️ Building the Likes View

**likesView.js**



```js
import { elements } from './base';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'

  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}
```

We create a function to toggle the like button

To make sure that the heart appears as liked when we load the page: in the **recipeView.js**

```js
export const renderRecipe = (recipe, isLiked) => {
  //....
  // ternary for the class of the like button
  ` 
	<button class="recipe__love">
		<svg class="header__likes">
			<use href="img/icons.svg#icon-heart${
  isLiked ? '' : '-outlined'
}"></use>
		</svg>
	</button`
}
```

We add a toggleLikeMenu in likesview

```js
export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}
```



```js
export const renderLike = like => {
  const markup = `
    <li>
    	<a class="likes__link" href="#${like.id}">
   			<figure class="likes__fig">
    			<img src="${like.img}" alt="${like.title}">
    		</figure>
    		<div class="likes__data">
    			<h4 class="likes__name">${like.title}</h4>
    			<p class="likes__author">${like.author}</p>
    		</div>
    	</a>
    </li>
	`;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
}
```

delete like

```js
export const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="#${id}]"`).parentElement;
  if (el) el.parentElement.removechild(el);
}
```

We want to select the li, not the a





We shorten the title in the like list using the function we created at the beginning

```js
import { limitRecipeTitle } from './searchView';

//.... 
limitRecipeTitle(like.title);
```



---

## Persistent Data with LocalStorage

The web storage API allows us to save key value pairs right in the browser and data stays even after website reloads

localStorace is a function that lives  in the global object (window object)



In Likes because it's where we want to implement localStorage

Wach time we change our likes, we persist the data into the localStorage (adding a like and deleting a like) we call a new method:

```js
persistData() {
  localStorage.setItem('likes', JSON.stringify(this.likes));
}
```

Method to read back from the local storage when the page reloads

```js
readStorage() {
  const storage = JSON.parse(localStorage.getItem('likes'));
  
  // Restore likes from the localstorage
  if ( storage) this.likes = storage;
}
```

We call it in the controller

```js
// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesview.toggleLikeMenu(state.likes.getNumLikes());
  
  state.likes.likes.forEach(like => likesView.renderLike(like));
})
```

```js
const newCount = Math.round(count * 10000) / 10000;
```



----

build process

```bash
npm run build
```



Challenges:

- Implement button to delete all shopping list items
- Implement functionality to manually add items to shopping list
- Save shopping list data in local Stoage
- Improve ingredient parsing algorithgm
- Come up with an algorithm for calculating the amount of servings
- Improve error handling

- Improve documentation