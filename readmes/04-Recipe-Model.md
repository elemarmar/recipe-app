# 04: Recipe Model

Two new files are created: `models/Recipe.js` and `views/recipeView.js`



## ☑️ Tasks

- Recipe Model
- Connecting Recipe Model to Controller
- Recipe View
- Recipe servings 

  

<br />



## ⚒️ Building the Recipe Model

We use axios again for AJAX calls. We also use ES6 classes to create a recipe class that holds all the data for a recipe.

**Recipe.js**

```js
import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  
  async getRecipe(id) {
    try {
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
      	this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
	}
}

```

We have a **method** used to get results for the search query --> API call async function written in the previous step.

👉🏻 `getResults` is an asynchronous method of the class Search.  It doesn't accept a parameter because the query will be read from the `query` property of the object itself. 

👉🏻we want to save the recipes in the object -> therefore `this.result = res.data.recipes`

<br >

We import the newly created class in our controller module:

**index.js**

```js
import Search from './models/Search';
const search = new Search('pizza');
console.log(search);

search.getResults();
```

👉🏻 we use the `new` operator and pass a query into it. This query will be attached as a property of the new Search object so that all the data about the search is encapsulated inside the object

-`search.getResults()` gets ther results for query `pizza`



<br >

## ⚒️ Building the Search Controller

There is only one controller file which will be our `index.js`.

### 🗂 Handling state

We are going to handle state in the Controller module through an object.

**index.js**

```js
import Search from './models/Search';

/** Global state of the app
 * - Search object -> all data about the search
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
```

<details><summary><strong>A bit more...</strong></summary>
<ul>
  <li>The state when we start the app will be empty --> empty object</li>
</ul>
</details>



### Adding an event listener for the search input and the search button

```js
const controlSearch = async () => {
  // 1. get the query from the view
  const query = 'placeholder'; // in future -> function by View module
  
 
  if (query) {
    // 2. create new Search object and add it to state
    state.search = new Search(query);
    
    // 3. Prepare UI for results
    
    // 4. Search for recipes
    await state.search.getResults();
    
    // 5. Render results on UI
    console.log(state.search.result);

  }
}

document.querySelector('.search').addEventListener('submnit', ev => {
  ev.preventDefault();
  controlSearch();
})
```

we create a function that defines what happens when we submit the form.

if there is a query provided, then we store a new Search object in our state (`search`)

because we only want to render the results on the UI only to happen after we actually receive the results from the API.  So we have to await the promise returned from `getResults()`  (it returns a promise because `getResults()` is an async funciton and every sync function automatically returns a promise) and so we have to specify that `controlSearch` is an async function. 





<br >



## ⚒️ Building the Search View

### The base module

👉🏻 we have one central variable that stores all of the DOM elements that we need in our app. For that purpose, we are going to create a new module called `base.js`

```js
export const  elements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search')
}
```

### Reading input 

**searchView.js**

This module will have several functions that we will export using named exports.

```js
import { elements } from './views/base';

// reading input from input form
export const getInput = () => elements.searchInput.value;
```

### Passing input value as query for API call

**index.js**

```js
// inside of controlSearch async function step 1. Get query from view:
const query = searchView.getInput();
```



### Printing results on the UI

We write a function in the searchView which can receive the results and print each of the elements

**searchView.js**

```js
export const renderResults = recipes => {
  recipes.foreach(renderRecipe);
}
```

👉🏻 We create a function which purpose is to print one single recipe and then we use it in the loop `recipes.foreach()`

```js
const renderRecipe = recipe => {
  const markup = `
    <li>
   		<a class="results__link" href="#${recipe.recipe_id}">
    		<figure class="results__fig">
    			<img src="${recipe.image_url}" alt="${recipe.title}">
    		</figure>
    		<div class="results__data">
    			<h4 class="results__name">${recipe.title}</h4>
    			<p class="results__author">${recipe.publisher}</p>
    		</div>
    	</a>
    </li>
	`;
  elements.searchResList.insertAdjacent('beforeend', markup);
}
```

We use our `renderResults` function inside of our controller **index.js**

```js
// controlSearch async function step 5. render results on UI
searchView.renderResults(state.search.result);
```



### Clearing out the input once that the user searches for a recipe

We write a new function `clearInput` in our `searchView` module

```js
export const clearInput = () => {
  elements.searchInput.value = ''
};
```

we call it inside of index.js in step 3. prepare UI for results

```js
searchView.clearInput();
```



### Clear the results before displaying new results

we do this in the step 3. prepare UI for results. for that we create a new function in searchView

```js
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
}
```

```js
searchView.clearResults();
```



### Reduce title from results so that they only ocuppy one line

We need to write an algorithm, in the searchView module

```js
const limitRecipeTitle = (title, limit = 17) =>  {
  const newTitle = [];
  if ( title.length > limit ) {
   	title.split(' ').reduce(acc, current) => {
      if (acc + current.length < limit) {
      	  newTitle.push(current);
      }
      return acc + current.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}
```

👉🏻 limit of characters accepted as the maximum length of the title.

split the title into its words and then use the reduce method on the resulting array which allows us to have an accumulator -> like a variable that we can add to in each iteration of the loop. In each iteration of the loop we test if the current title + next word is still under the maximum length 





## ⭕️ Rendering an AJAX loading spinner

We want a spinner to appear both in the results list and in the recipe whenever we click in one of the restyles. 

We are creating it in **base.js** -> not only for the search but also for other modules

```js
export const renderLoader = parentElement => {
  const loader = `
		<div class="loader">
			<svg>
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;
  parent.insertAdjacentHTML('afterbegin', loader);
}
```

because we want it to be reusable, we use a parameter that indicates the element's parent so that the loader is attach to the element that we wish in each moment. 





we call the loader in the step 3. prepare UI for results of controlSearch in index.js

```js
renderLoader(elements.searchRes);
```

to make the spinner disappear when the data loads. We create a method `clearLoader` method

```js
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
```

when rendring the results on UI we start by removing the loader

Step 5....

```js
clearLoader();
```



## Adding Pagination

Search results pagination. 

1. change renderResults function -> we pass recipes but also the page we want to display and results per page

```js
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  
  recipes.slice(start, end).forEach(renderRecipe);
}
```

👉🏻 we determine which one is the first to show and which one is the last





2. render buttons on the interface: we write a private funciton `renderButtons`  -> render buttons according to the number of the page that we're on 

```js
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  
  if (page === 1 && pages > 1) {
    // Button to go to next page
    
  } else if (page < pages) {
    
  } else if (page === pages && pages > 1) {
    // Button to previous page
    
  } 
}
```

create another function 

```js
// type: prev or next
const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                </button>
`
```

we use data-* attribute because we'll later attach event handlers to the buttons -> identify them.

We call the function:

```js
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  
  if (page === 1 && pages > 1) {
    // Button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = createButton(page, 'next') + createButton(page, 'prev');
  } else if (page === pages && pages > 1) {
    // Button to previous page
    button = createButton(page, 'prev');
  } 
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}
```

why rounding up ceil (2.3 -> 3 pages instead of 2)

we call them  inside renderResults







3. attach some event handlers to these buttons in order to make the funcitonality work 

taking advantage od data-* attribute

we go back to the controller (event listeners)  we use event delegation because buttons are not there when the page loads for the first time.  We add the event listener to the box with results__pages

```js
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
})
```

we use the `closest` method: returns the closest ancestor of the current element which matches the selectors given in paramether

we read the data stored in the data-* attribute

we also clear the buttons in the `clearResults` function

