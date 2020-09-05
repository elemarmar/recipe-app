# 05: Shopping List Model

Two new files are created: `models/List.js` and `views/listView.js`



## ☑️ Tasks

- Recipe Model
- Connecting Recipe Model to Controller
- Recipe View
- Recipe servings 

  

<br />



## ⚒️ Building the Shopping List Model



**List.js**

```js
export default class List {
  	constructor() {
      this.items = [];
    }
}
```

We create the method to add a new item to the array:

```js
addItem (count, unit, ingredient) {
  const item = {
    id: uniqid(),
    count,
    unit,
    ingredient
  }
  this.items.push(item);
  return item;
}
```

We need a unique id for each item, for when we want toupdate their count, etc. In order to so we'll use a third-party package to generate these IDs. [uniqid](https://github.com/adamhalasz/uniqid)



```js
deleteItem (id) {
  const index = this.items.findIndex(el => el.id === id);
  this.items.splice(index, 1);
}
```

We want to find the position of the item that matches the passed id



Update the count

```js
updateCount(id, newCount) {
  this.items.find(el => el.id === id).count = newCount;
}
```



In our controller.

```js
import List from './models/List'
```





<br >



## ⚒️ Building the Shopping List View

We create `listView.js`

Two methods one to crete and one to delete

```js
import { elements } from './base';

export const renderItem = item => {
  const markup = `
<li class="shopping__item data-itemid=${item.id}">
	<div class="shopping__count">
		<input type="number" value="${item.count}" step="${item.count}" class="shopping__count--value">
		<p>${item.unit}</p>
	</div>
	<p class="shopping__description">${item.ingredient}</p>
	<button class="shopping__delete btn-tiny">
    <svg>
      <use href="img/icons.svg#icon-circle-with-cross"></use>
    </svg>
	</button>
</li>
	`;
  elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) item.parentElement.removeChild(item);
}
```

We add a data attribute so that we can later identify the element in the DOM



<br >

## ⚒️ Building the Shopping List controller

**index.js**

We add event. Listeners. We di ut ub the one we already created that listens for recipe buttons. Because we need to make use of event delegation -> elements not there by time page is loaded

```js
// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {

  if (e.target.matches('.btn-decrease, .btn-decrease *')) {

		// Decrease button is clicked*
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked*
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }

});
```

We create the list controller

```js
/**
 * LIST CONTROLLER
 */

const controlList = () => {
  // 1. Create a new list if there is none yet
  if (!state.list) state.list = new List();
  
  // 2. Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient;
		listView.renderItem(item);
                       
  })
}
```

Add event listener for deleting and increase decrease value of module. We need event delegation --> 

```js
// Handle delete and update list item events
elements.shopping.addEventListener('click', ev => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  
  // Handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    
    // Delete from UI
    listView.deleteItem(id);
  }
});
```

Now we handle increase and decrease buttons in **index.js**

```js
// Handle delete and update list item events
elements.shopping.addEventListener('click', (ev) => {
  const id = ev.target.closest('.shopping__item').dataset.itemid;
  // Handle delete button
  if (ev.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    
  // Handle the count update
  } else if (ev.target.matches('.shopping__count-value')) {
   
    // read data from interface and update data
    const value = parseFloat(ev.target.value, 10);
    state.list.updateCount(id, value);
    
  }
});
```

