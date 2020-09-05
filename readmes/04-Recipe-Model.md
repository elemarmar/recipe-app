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
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
	}
  
  // we assume that for every 3 ingredients, we need 15 min
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  
  calcServings() {
    this.servings = 4;
  }
}
```

<details>
  <summary><strong>A bit more...</strong></summary>
  <ul>
    <li>Explanation</li>
  </ul>
</details>



<br >

We import the newly created class in our controller module:

**index.js**

```js
import Recipe from './models/Recipe';

/**
 * RECIPE CONTROLLER
 */
const rec = new Recipe(46956);
rec.getRecipe();
```

<details>
  <summary><strong>A bit more...</strong></summary>
  <ul>
    <li>Here there is a test to see if it works we pass in a real recipe ID.</li>
  </ul>
</details>



<br >

## ⚒️ Building the Recipe Controller

- Reading data from the page URL (id)
- Responding to the `hash change` event
- How to add the same event listener to multiple events.





Whenever we click on a recipe result, the URL of the website changes. We can take advantage of this using the hash change event in js. We add a `hash change` event listener to the global object - the window object

**index.js**

```js
/**
 * RECIPE CONTROLLER
 */

window.addEventListener('hashchange', controlRecipe);
```

We create `controlRecipe` function that will be called whenever the hash in the url changes.

```js
const controlRecipe = async () => {
  // 1. get ID from URL
  const id = window.location.hash.replace('#', '');
  
  if (id) {
    // 2. prepare UI for changes
    
    // 3. create recipe object
    state.recipe = new Recipe(id);
    
    // 4. get recipe data
    await state.recipe.getRecipe();
    
    // 5. calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();
    
    // 6. render recipe
    
  }
}
```

We can get the hash by using `window.location` -> the entire URL but we use the `hash` property on it.

Since that gives us back the id including the hash, we need to get rid of the `#` and therefore we use the `replace` method. 

We make it async because we want to use the await on getting recipe data



**Fixing hash prob**

The event just happens when the hash changes but if we open the url with the id, we want th event to also fire so we need to add an event listener to the load event, which fires whenever the page is loaded

```js
window.addEventListener('load', controlRecipe);
window.addEventListener('hashchange', controlRecipe);
```

Because we adding same callback function to different events to the same object, we can do it with a loop:

```js
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
```



We have to take into account that the promise that `state.recipe.getRecipe()` returns might go wrong -> we add a try catch

```js
const controlRecipe = async () => {
  // 1. get ID from URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // 2. prepare UI for changes

    // 3. create recipe object
    state.recipe = new Recipe(id);

    try {
      // 4. get recipe data
      await state.recipe.getRecipe();

      // 5. calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // 6. render recipe
      console.log(state.recipe);
    } catch (error) {
      alert('Error processing recipe!');
    }
  }
};
```





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



## ⚒️ Building the Recipe Model

- Read through a list of ingredients and in each ingredient, separate the quantity, unit and the description of each ingredient -> later we want to adjust the increment decrement servings and the quantity of ingredients should change accordingly -> also when we add them to the shopping list
  - Read list of ingredients
  - Parse each ingredient into the count, unit and description
  - Before parsing ingredients -> making all units the same (standardise) and getting rid of the parentheses

We add a new method to the Recipe class in **Recipe.js**

```js
parseIngredients() {
  const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds' ];
  const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
  
  const  newIngredients = this.ingredients.map(el => {
    // 1. uniform units
    let ingredient = el.toLowerCase();
    unitsLong.forEach((unit, i) => {
      ingredient = el.replace(unit, unitsShort[i]);
    })
    
    // 2. remove parentheses
    ingredient = el.replace(/ *\([^)]*\) */g, ' ');
    
    // 3. parse ingredients into count, unit and description
    const arrIng = ingredient.split(' ');
    const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
    
    let objIng;
    if (unitIndex > -1) {
      // There is a unit
      // eg. 3 1/2 cups, arrcount = [3, 1/2]
      const arrCount = arrIng.slice(0, unitIndex); 
      let count;
      if (arrCount.length === 1) {
        count = eval(arrIng[0].replace('-', '+'));
      } else {
        // eval("4+1/2") --> 4.5
        count = eval(arrCount.join('+'));
      }
      objIng = {
        count,
        unit: arrIng[unitIndex],
        ingredient: arrIng.slice(unitIndex + 1).join(' ');
      }
    } else if (parseInt(arrIng[0], 10)) {
      // There is no unit, but quantity
      objIng = {
        count: parseInt(arrIng[0], 10),
        unit: '',
        ingredient: arrIng.slice(1);.join(' ');
      }
               
    } else if (unitIndex === -1) {
      // There is no unit and no number in 1st position
      objIng = {
        count: 1,
        unit: '',
        ingredient
      }
    }
    return objIng;
  });
  this.ingredients = newIngredients;
}
```



We create two arrays:

1. First units appear as they do in our ingredients 
2. Second array as we want them to be
3. Then we replace the long version with the short uniformed version
4. We loop over the long unit (explanation)
5. Removing parentheses with regular expression





Separating count, unit description:

- Case 1: only number + description
- Case 2: number + unit + description
- Case 3: description



We convert ingredient string into an array with split method

-> test if there is a unit and check where it is located

- Find the index at which the unit is located



We assume that everything that comes before the unit is the number 



We join them together with + sign and then evaluate the result of that

In ES6 ingredient: ingredient -> ingredient



Parse ingredients in index.js



## ⚒️ Building the Recipe Model

Rendering the recipe in the user interface. We create `RecipeView.js`

```js
export const renderRecipe = recipe => {
  const markup = // here html markup where we replace some elements
	
}
```

--> ingredients: we don't know how many so we have to create a loop 

```js
const createIngredient = ingredient => `
            <li class="recipe__item">
                <svg class="recipe__icon">
                    <use href="img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__count">${ingredient.count}</div>
                <div class="recipe__ingredient">
                    <span class="recipe__unit">${ingredient.unit}</span>
                    ${ingredient.description}
                </div>
            </li>

```

We render the recipe



clearRecipe

```js
export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
}
```



---



We also have grams or l

```js
const units = [...unitsShort, 'kg', 'g'];
```

---

Transforming the 0.5 to 1/2

We use a third-party project: [fractional.js](https://github.com/ekg/fraction.js/)

```bash
npm install fractional --save
```



**recipeViews**

```js
import { Fraction } from 'fractional';
```

We create a new function called `formatCount`

```js
const formatCount = (count) => {
  if (count) {
    const newCount = Math.round(count * 10000) / 10000;
    const [int, dec] = newCount
      .toString()
      .split('.')
      .map((el) => parseInt(el, 10));

    if (!dec) return newCount;

    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return '?';
};
```

> Explain this. We want to display 2 1/2 rather than 5/2

