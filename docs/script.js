let rendered = "";
let carty = "";
let total = document.querySelector(".total");
let productsDOM = document.querySelector("div.products");
let cartDOM = document.querySelector(".cart-items");
let cart = [];
let buttonsDOM = [];
let user = "";


auth.onAuthStateChanged((usr) => {
  if (usr) {
    $(".firebase-error").text("");
    $(".user").text(usr.email.slice(0, 1));
    $(".n-logged").remove();
    $(".logged").removeClass("logged");
    user = usr;
  } else {
    $(".n-logged").removeClass("n-logged");
    $(".n-logged").show();
    $(".logged").remove();
  }
});

class Product {
  async getProducts() {
    let res = await fetch("https://fakestoreapi.com/products");
    let data = await res.json();
    return data.filter(item=> item.category == "women clothing");
  }
}
class UI {
  static displayProducts(products) {
    products.forEach((item) => {
      rendered += `<div id=${item.id} class="product z-depth-1 col l4">
                            <img src=${item.image} class="product-img" alt="product">
                            <button data-id=${item.id} class="btn btn-small logge add-to-cart-btn z-depth-0 orange lighten-3">Add to Cart</button>
                    <p class="desc">${item.title}</p>
                    <span><p class="price">$${item.price}</span>
                    </div>`;

      productsDOM.innerHTML = rendered;
    });
  }

  getBagBtns() {
    const btns = [...document.querySelectorAll(".add-to-cart-btn")];
    buttonsDOM = btns;

    this.clearCart();
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

        let c = Storage.getCart();

        c = [...c, cartItem];
        Storage.saveCart(c);

        Storage.saveFireCart(cartItem, event);
        this.setCartValues(c);
        this.addCartItem(cartItem);
      });
    });
  }
  setCartValues(c) {
    let inC = 0;
    let tempTotal = 0;
    let itemsTotal = 0;

    c.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    total.innerText = `Total: $${parseFloat(tempTotal.toFixed(2))}`;
    inC = c.length;
    $(".in-cart, .in-side-cart").text(inC);
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
      console.log(user.email);
      store
        .collection("cart")
        .get()
        .then((snap) => {
          snap.docs.forEach((doc) => {
            if (doc.id.split("-")[1] == user.email) {
              store.collection("cart").doc(doc.id).delete();
            }
          });
        });
      cart = [];
      this.setCartValues(cart);
      $(cartDOM.children).fadeOut(1000);

      sessionStorage.removeItem("cart");
      this.ennableButtons();
    });
  }

  ennableButtons() {
    c = Storage.getCart();
    buttonsDOM.forEach((btn) => {
      let id = btn.dataset.id;

      let inCart = c.find((item) => item.id == id);
      if (!inCart) {
        btn.innerText = "Add to cart";
        btn.disabled = false;
      }
    });
  }

  removeFireItem() {
    $(".remove").click((e) => {
      store
        .collection("cart")
        .doc(`${e.target.dataset.id}-${user.email}`)
        .delete()
        .then(() => console.log("Item removed successfully!"))
        .catch((err) => {
          console.log(err);
        });
    });
  }

  removeItem() {
    $(".remove").click((e) => {
      let newCart = JSON.parse(sessionStorage.getItem("cart")).filter(
        (item) => item.id != e.target.dataset.id
      );
      Storage.saveCart(newCart);
      this.ennableButtons();
      $(e.target.parentElement).fadeOut(2000);
      this.setCartValues(newCart);
    });
  }
  populateCart(cart) {
    cart.forEach((item) => {
      this.addCartItem(item);
    });
  }
  setupAPP(c) {
    Storage.saveCart(c);
    this.setCartValues(c);
    this.populateCart(c);
  }
}

class Storage {
  static saveProducts(products) {
    sessionStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(sessionStorage.getItem("products"));
    return products.find((product) => product.id == id);
  }
  static getCart() {
    return sessionStorage.getItem("cart")
      ? JSON.parse(sessionStorage.getItem("cart"))
      : [];
  }
  static saveCart(cart) {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }

  static saveFireCart(cartItem, e) {
    store
      .collection("cart")
      .doc(`${e.target.dataset.id}-${user.email}`)
      .set(cartItem);

    store
      .collection("cart")
      .get()
      .then((snap) => {
        snap.docs
          .filter((doc) => doc.id.split("-")[1])
          .forEach((doc) => {
            cart.push(doc.data());
          });
      });
  }
}

// Logging out

$(document).ready(() => {
  $("body").append(
    '<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>'
  );

  $(".main").addClass("nvd");
  $(window).on("load", function () {
    setTimeout(removeLoader, 100); //wait for page load PLUS two seconds.
  });
  function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
      // fadeOut complete. Remove the loading div
      $(".main").removeClass("nvd");
      $("#loadingDiv").remove(); //makes page more lightweight
    });
  }

  $(".lo-btn").click(function (e) {
    e.preventDefault();
    auth.signOut();
    window.location.href = "/ShoppingCart/";
  });

  $(".modal").modal({ inDuration: 1000, outDuration: 1000 });
  $(".sidenav").sidenav({ inDuration: 1000, outDuration: 1000 });
  let product = new Product();
  let ui = new UI();

  product
    .getProducts()
    .then((products) => {
      UI.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagBtns();
    })
    .then(() => {
      auth.onAuthStateChanged((usr) => {
        if (usr) {
          store
            .collection("cart")
            .get()
            .then((snap) => {
              c = [];
              snap.docs
                .filter((doc) => doc.id.split("-")[1] == user.email)
                .forEach((doc) => {
                  c.push(doc.data());
                });

              return c;
            })
            .then((c) => {
              buttonsDOM.forEach((btn) => {
                $(btn).show();
                let id = btn.dataset.id;

                let inCart = c.find((item) => item.id == id);
                if (inCart) {
                  btn.innerText = "In Cart";
                  btn.disabled = true;
                } else {
                  btn.innerText = "Add to card";
                  btn.disabled = false;
                }
              });
              ui.setupAPP(c);
            })
            .catch((err) => {
              $(".firebase-error").text("Sign in to view cart".toUpperCase());
            });

          console.log(usr.email);
          c = JSON.parse(sessionStorage.getItem("cart"));
        } else {
          buttonsDOM.forEach((btn) => {
            $(btn).hide();
          });
        }
      });
    });

  $(".cart-trigger").click(() => {
    c = JSON.parse(sessionStorage.getItem("cart"));
    ui.removeItem();
    ui.removeFireItem();
  });
});
