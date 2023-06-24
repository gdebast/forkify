import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchResultView.js';
import bookmarkView from './views/boorkmarkView.js';
import paginationView from './views/paginationView.js';
import { async } from 'regenerator-runtime';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const showRecipe = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  recipeView.renderSpinner();
  if (model.state.search) {
    searchResultView.update(
      model.getSearchResultsPage(model.state.search.page)
    );
  }

  // 1. loading recipe
  await model.loadRecipe(id);

  // 2. rendering recipe
  recipeView.render(model.state.recipe);
  recipeView.renderError(model.state.errorMessage);

  //3. updating bookmarks
  bookmarkView.update(model.state.bookmark);
};

const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (!query) return;
  searchResultView.renderSpinner();

  // 1. load the search
  await model.loadSearchResult(query);

  //2. render the search
  searchResultView.render(model.getSearchResultsPage(1));
  searchResultView.renderError(model.state.errorMessage);

  //3. render the pagination buttons
  paginationView.render(model.state.search);
};

const controlPagination = function (newPage) {
  searchResultView.render(model.getSearchResultsPage(newPage));
  searchResultView.renderError(model.state.errorMessage);
  paginationView.render(model.state.search);
};

const controlServings = function (newNumberOfServing) {
  model.updateServing(newNumberOfServing);
  recipeView.update(model.state.recipe);
  recipeView.renderError(model.state.errorMessage);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmark);
  bookmarkView.renderError(model.state.errorMessage);
};

const controlBookmarkViewOnLoad = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  addRecipeView.renderSpinner();
  await model.uploadRecipe(newRecipe);
  recipeView.render(model.state.recipe);

  // update the view
  addRecipeView.renderError(model.state.errorMessage);
  if (!model.state.errorMessage) {
    addRecipeView.renderMessage();
  }
  // Render bookmark view
  bookmarkView.render(model.state.bookmark);

  // change id in url
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  setTimeout(function () {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);
};

bookmarkView.addHandlerOnWidowLoad(controlBookmarkViewOnLoad);
recipeView.addHandlerRender(showRecipe);
recipeView.addHandlerOnUpdateServing(controlServings);
recipeView.addHandlerOnAddBookmark(controlAddBookmark);
searchView.addSearchHandler(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);
