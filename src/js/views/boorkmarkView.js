import View from './view.js';
import previewView from './previewView.js';

class BookmarkView extends View {
  _parent = document.querySelector('.bookmarks__list');

  addHandlerOnWidowLoad(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(function (elt) {
        return previewView.render(elt, false);
      })
      .join('');
  }
}

export default new BookmarkView();
