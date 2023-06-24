import icons from 'url:../../img/icons.svg'; // import the icons of the src folder such that Parcel can map it to the 'dist' folder.
import { Fraction } from 'fractional';
import View from './view.js';

class RecipeView extends View {
  _parent = document.querySelector('.recipe');

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(function (elt) {
      window.addEventListener(elt, handler);
    });
  }

  addHandlerOnUpdateServing(handler) {
    this._parent.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateto;
      handler(updateTo);
    });
  }

  addHandlerOnAddBookmark(handler) {
    this._parent.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    const markup = `
  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-updateto="${
          this._data.servings - 1
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-updateto="${
          this._data.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
      
      ${this._data.ingredients.map(this._generateIngredientMarkup).join('')}

    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;

    return markup;
  }

  _generateIngredientMarkup(ing) {
    return `<li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            ${
              ing.quantity
                ? `<div class="recipe__quantity">${new Fraction(
                    ing.quantity
                  ).toString()}</div>`
                : ''
            }
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit}</span>
              ${ing.description}
            </div>
          </li>`;
  }
}
export default new RecipeView();
