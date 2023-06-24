import View from './view.js';
import icons from 'url:../../img/icons.svg'; // import the icons of the src folder such that Parcel can map it to the 'dist' folder.

class PreviewView extends View {
  _parent = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    const markup = `
                    <li class="preview">
                        <a class="preview__link ${
                          this._data.id === id ? 'preview__link--active' : ''
                        }" href="#${this._data.id}">
                            <figure class="preview__fig">
                                <img src="${this._data.image}" alt="Test" />
                            </figure>
                            <div class="preview__data">
                                
                                <h4 class="preview__title">${
                                  this._data.title
                                } ...</h4>
                                
                                <p class="preview__publisher">${
                                  this._data.publisher
                                }</p>

                                <div class="preview__user-generated ${
                                  this._data.key ? '' : 'hidden'
                                }">
                                  <svg>
                                    <use href="${icons}#icon-user"></use>
                                  </svg>
                                </div>

                            </div>
                        </a>
                    </li>
    `;
    return markup;
  }
}

export default new PreviewView();
