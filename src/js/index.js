import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/** Global state of the app
 * - Search object -> all data about the search
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. get query from the view
  const query = searchView.getInput();

  if (query) {
    // 2. create new Search object and add it to the state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something went wrong with the serach!');
    }
  }
};

elements.searchForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // 1. get ID from URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // 2. prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // 3. highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // 4. create recipe object
    state.recipe = new Recipe(id);

    try {
      // 5. get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // 6. calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // 7. render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (ev) => {
  if (ev.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (ev.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (ev.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (ev.target.matches('.recipe__love, .recipe__love *')) {
    // like controller
    controlLike();
  }
});

/**
 * LIST CONTROLLER
 */

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
  } else if (ev.target.matches('.shopping__count--value')) {
    // read data from interface and update data
    const value = parseFloat(ev.target.value, 10);
    state.list.updateCount(id, value);
  }
});

const controlList = () => {
  // 1. Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // 2. Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

/**
 * LIKE CONTROLLER
 */
// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to the UI list
    likesView.renderLike(newLike);
    // User has liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
