import { async } from 'regenerator-runtime';
import { API_URL, PAGE_SIZE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: state.bookmark?.some(function (bookmarkedRecipe) {
      return bookmarkedRecipe.id === recipe.id;
    }),
    ...(recipe.key && {
      key: recipe.key,
    }) /*if there is a key parameter, we return an object which is destructured*/,
  };
};

export const loadRecipe = async function (id) {
  state.errorMessage = undefined;
  state.recipe = undefined;
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
  } catch (err) {
    state.errorMessage = `No recipe found for your query. Please try again! Error: ${err.message}`;
  }
};

export const loadSearchResult = async function (query) {
  state.search = { query: query, results: [], resultsPerPage: PAGE_SIZE };
  state.errorMessage = undefined;
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const recipes = data.data.recipes;
    if (recipes.length === 0) throw new Error('empty list.');

    recipes.forEach(function (rec) {
      state.search.results.push({
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      });
    });
  } catch (error) {
    state.errorMessage = `No recipes found for your query '${query}'. Please try again! Error: ${error.message}`;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  return state.search.results.slice(start, end);
};

export const updateServing = function (numberOfServings) {
  if (numberOfServings <= 0) return;
  if (!state.recipe) return;
  const previousServing = state.recipe.servings;
  if (previousServing === numberOfServings) return;
  state.recipe.ingredients.forEach(function (ing) {
    ing.quantity = (numberOfServings * ing.quantity) / previousServing;
  });
  state.recipe.servings = numberOfServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};

export const addBookmark = function (recipe) {
  if (!state.bookmark) state.bookmark = [];
  state.bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const removeBookmark = function (id) {
  if (state.bookmark) {
    const index = state.bookmark.findIndex(function (rec) {
      return id === rec.id;
    });
    state.bookmark.splice(index, 1);
  }

  if (state.recipe) {
    if (state.recipe.id === id) state.recipe.bookmarked = false;
  }

  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  state.errorMessage = undefined;
  const ingredients = Object.entries(newRecipe)
    .filter(function (entry) {
      return entry[0].startsWith('ingredient') && entry[1] !== '';
    })
    .map(function (ing) {
      const ingArr = ing[1].split(',').map(function (elt) {
        return elt.trim();
      });
      if (ingArr.length !== 3) {
        state.errorMessage =
          'Wrong ingredient format! Please use the correct format.';
        return {};
      }
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

  if (state.errorMessage) return;

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients: ingredients,
  };
  try {
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    console.log('here');
    state.errorMessage = `No recipes could be upladed. Please try again! Error: ${error.message}`;
    return;
  }
};

init();
