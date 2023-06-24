import View from './view.js';
import previewView from './previewView.js';

class SearchResultView extends View {
  _parent = document.querySelector('.results');

  _generateMarkup() {
    return this._data
      .map(function (elt) {
        return previewView.render(elt, false);
      })
      .join('');
  }
}

export default new SearchResultView();
