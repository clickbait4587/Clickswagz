let rendered = "";

let divList = "";
let total = document.querySelector(".total");
let productsDOM = document.querySelector("div.products");

let buttonsDOM = [];
let user = "";
class Product {
  async getProducts() {
    let res = await fetch("https://fakestoreapi.com/products");
    let data = await res.json();
    data = data.slice(6, 8);
    console.log(data);
    return data;
  }
}
class UI {
  static displayProducts(products) {
    products.forEach((item) => {
      rendered += `<div id=${item.id} class="product col l4">
                          <img src=${item.image} class="product-img" alt="product">
                       
                 
                  </div>`;
    });

    productsDOM.innerHTML = rendered;
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
}

$(document).ready(() => {
  async function checkUser() {
    auth.onAuthStateChanged((usr) => {
      if (user) {
        $(".n-logged").hide();
        $(".logged").show();
        user = usr;
      } else {
        $(".n-logged").show();
        $(".logged").hide();
      }
    });
  }

  $(".sidenav").sidenav();
  let product = new Product();
  let ui = new UI();
  checkUser();

  product.getProducts().then((products) => {
    UI.displayProducts(products);
    Storage.saveProducts(products);
  });
});
