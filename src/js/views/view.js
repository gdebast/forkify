import icons from 'url:../../img/icons.svg'; // import the icons of the src folder such that Parcel can map it to the 'dist' folder.

export default class View {
  _data = undefined;

  render(data, render = true) {
    if (!data) {
      this._data = undefined;
      return;
    }
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._data = undefined;
      return;
    }

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currentElements = Array.from(this._parent.querySelectorAll('*'));
    newElements.forEach(function (newElt, index) {
      const currentElt = currentElements[index];
      // update changed text
      if (
        !newElt.isEqualNode(currentElt) &&
        newElt.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElt.textContent = newElt.textContent;
      }

      // update changed attribute
      if (!newElt.isEqualNode(currentElt)) {
        Array.from(newElt.attributes).forEach(attr =>
          currentElt.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    this._clear();
    const markup = `<div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                      </div>`;
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message) {
    if (!message) {
      return;
    }

    this._clear();
    const markup = `<div class="error">
                          <div>
                              <svg>
                                  <use href="${icons}#icon-alert-triangle"></use>
                              </svg>
                          </div>
                          <p>${message}</p> 
                      </div>`;
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    this._clear();
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parent.innerHTML = '';
  }
}
