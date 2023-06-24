import View from './view.js';
import icons from 'url:../../img/icons.svg'; // import the icons of the src folder such that Parcel can map it to the 'dist' folder.

class PaginationView extends View {
  _parent = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parent.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const nbofPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (currentPage === 1 && nbofPage >= 1) {
      return this._generateMarkupNext(currentPage);
    }
    if (currentPage === nbofPage && nbofPage >= 1) {
      return this._generateMarkupPrev(currentPage);
    }
    if (currentPage < nbofPage && nbofPage >= 1) {
      return (
        this._generateMarkupPrev(currentPage) +
        this._generateMarkupNext(currentPage)
      );
    }

    return '';
  }

  _generateMarkupNext(currentPage) {
    return `<button data-goto=${
      currentPage + 1
    } class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
  }
  _generateMarkupPrev(currentPage) {
    return `<button data-goto=${
      currentPage - 1
    } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>`;
  }
}

export default new PaginationView();
