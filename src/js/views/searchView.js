class SearchView {
  _parent = document.querySelector('.search');

  getQuery() {
    const query = this._parent.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parent.querySelector('.search__field').value = '';
  }

  addSearchHandler(handler) {
    this._parent.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
