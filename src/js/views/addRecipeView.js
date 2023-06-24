import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parent = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded.';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  addHandlerUpload(uploader) {
    this._parent.addEventListener('submit', function (event) {
      event.preventDefault();
      const dataArr = [...new FormData(this /*which is _parent*/)];
      const data = Object.fromEntries(dataArr);
      uploader(data);
    });
  }

  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
