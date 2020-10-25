let rendered = "";
let carty = "";
let divList = "";
let total = document.querySelector(".total");
let productsDOM = document.querySelector("div.products");
let cartDOM = document.querySelector(".cart-items");
let cart = [];
let buttonsDOM = [];

class Product {
  async getProducts() {
    let res = await fetch("https://fakestoreapi.com/products");
    let data = await res.json();

    return data;
  }
}
class UI {
  static displayProducts(products) {
    products.forEach((item) => {
      rendered += `<div id=${item.id} class="product z-depth- col s12 l3">
                          <img src=${item.image} class="product-img" alt="product">
                          <button data-id=${item.id} class="btn btn-small add-to-cart-btn z-depth-0 orange lighten-3">Add to Cart</button>
                  <p class="desc">${item.title}</p>
                  <span><p class="price">$${item.price}</span>
                  </div>`;
    });

    productsDOM.innerHTML = rendered;
  }

  getBagBtns() {
    const btns = [...document.querySelectorAll(".add-to-cart-btn")];
    buttonsDOM = btns;
    this.clearCart(cart);

    cart = Storage.getCart();
    btns.forEach((btn) => {
      let id = btn.dataset.id;
      let inCart = cart.find((item) => item.id == id);
      if (inCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem).then(() => {});
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    total.innerText = `Total: $${parseFloat(tempTotal.toFixed(2))}`;
  }

  async addCartItem(item) {
    let div = document.createElement("div");
    div.className = "product z-depth- col s12 l4";
    div.innerHTML = `
           
            <img
                src=${item.image}
                class="cart-img" alt="product">
            <div class="right">
                <i class="fas fa-chevron-up"></i>
                <p class="count"></p>
                <i class="fas fa-chevron-down"></i>
            </div>
            <p class="cart-desc">${item.title}</p>
            <span><p class="price">$${item.price}
                </p></span>
            <button data-id=${item.id} class="btn z-depth-0 transparent remove grey-text btn-small">remove</button>
            `;

    cartDOM.appendChild(div);
  }

  clearCart() {
    $(".clear-cart").click((e) => {
      localStorage.removeItem("cart");
      cart = [];
      this.setCartValues(cart);
      $(cartDOM.children).fadeOut(3000);

      this.ennableButtons();
    });
  }
  ennableButtons() {
    buttonsDOM.forEach((btn) => {
      let id = btn.dataset.id;
      let inCart = cart.find((item) => item.id == id);
      if (!inCart) {
        btn.innerText = "Add to cart";
        btn.disabled = false;
      }
    });
  }
  async removeItem() {
    $(".remove").click((e) => {
      let newCart = JSON.parse(localStorage.getItem("cart")).filter(
        (item) => item.id != e.target.dataset.id
      );
      Storage.saveCart(newCart);
      $(e.target.parentElement).fadeOut(2000);
      cart = JSON.parse(localStorage.getItem("cart"));
      this.setCartValues(cart);
      this.ennableButtons();
    });
  }
  populateCart(cart) {
    cart.forEach((item) => {
      this.addCartItem(item);
    });
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id == id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    return cart;
  }
}

$(document).ready(() => {
  $(".sidenav").sidenav();
  let product = new Product();
  let ui = new UI();

  ui.setupAPP();
  product
    .getProducts()
    .then((products) => {
      UI.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagBtns();
    })
    .then(() => {});
  cart = JSON.parse(localStorage.getItem("cart"));
  $(".cart-trigger").click(() => {
    ui.removeItem();
  });
});
