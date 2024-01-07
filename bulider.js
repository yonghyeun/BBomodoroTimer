class Bulider {
  constructor(tag) {
    this.tag = document.createElement(tag);
  }

  addClass(className) {
    this.tag.classList.add(className);
    return this;
  }

  setID(idName) {
    this.tag.id = idName;
    return this;
  }

  setTransform(transform) {
    this.tag.style.transform = transform;
    return this;
  }

  setTextContent(text) {
    this.tag.textContent = text;
    return this;
  }
}
