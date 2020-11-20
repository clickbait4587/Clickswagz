let cartName = 'cswgsitmid';
let cartDOM = ""
class UI{
   static async getProducts(){
    let prods = await fetch('/products', (req,res)=>{
      method: 'GET'
    }).then(res=> res.json())
return prods
  }
  static displayProducts(products){
    let prodDOM = ''
    products.map(product =>{
      prodDOM += 
      `
<div class="item col l6 s6" id=${product.id}><img class="prod-img" src=${product.image} alt=""><span class="pai" style="display: inline-block; margin:0 5px"><a href="#" class="add-to-cart"><i class="fas fa-cart-plus" style="color: darkgreen"></i></a><span class="price" style="display: inline-block;">$${product.price.toFixed(2)}</span></span><p class="title">${product.title}</p></div>
`
    })
$('#products').html(prodDOM)
  }
  static updateBtns(){
  Storage.getCart().then(cart=>{
      cart.forEach(item=>{
        let items = document.querySelectorAll('.item')
        items.forEach(itm=> {
          if (parseInt(itm.id) == parseInt(item.id)) {
          $(itm).addClass('in-cart')
          $(itm).find('.pai').text('In Cart')
        }

        })
      })

  })
}
  static populateCart(cart){
    $('.items-count').text(`ITEMS: ${cart.length}`);
    $('.no-cart').text(cart.length);
    cartDOM = ''
    let total = 0
    if (cart.length){ cart.map(cart=>{
    total+= cart.price
      cartDOM += `
      <li style='margin-bottom: 20px;' data-id=${cart.id}>
                    <img class="cart-img" src=${cart.image} alt=''>
                    <p class="crtdesc center container">${cart.title}</p>
                    <div class="container parmvbtn">
                    <span class="center crt-price black-text bold">$${cart.price}</span>
                    <a  href="cart" class="remove grey-text text-darken-2 center btn btn-small transparent z-depth-0" href='#'>
                        <em> Remove</em></a></div>
                      </li>
      `
    })
    $('.total').text(`TOTAL: $${total.toFixed(2)}`)
    $('#cart-cont').html(cartDOM)

    $('.remove').click((e)=>{
      e.preventDefault()
      let title = $(e.target).parents('li').find('.crtdesc').text()
      let id = $(e.target).parents('li').attr('data-id')
      let price =  $(e.target).parents('li').find('.crt-price').text()

      let prods = document.querySelectorAll('.item');
      prods.forEach(itm=>{
        if (itm.id == id){
          
          $(itm).css({
            opacity: 1
          })
          $(itm).find('.pai').html(`<a class="add-to-cart" href="cart"><i class="fas fa-cart-plus" style="color: darkgreen"></i></a><span class="price" style="display: inline-block;">${price}</span>`)
        }
      })
      fetch('/cart',{
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
     
        body: JSON.stringify({title, id})
      }).then((res)=>res.json()).then(cart=>{
        UI.startApp(cart)
      }).catch(err=>{
        console.log(err.message);
      })
    })
  }
  else{
    $('.total').text(`TOTAL: $0.00`)
    $('#cart-cont').html('<p class="flow-text grey-text text-darken-4 center-align" style="margin-top: 50px"> No Items In Cart </p>' )
  }
  }

  static getBtns(){
    $('.add-to-cart').click((e)=>{

      e.preventDefault();
      $(e.target).parents('li').find('.add-to-cart').remove()
      $(e.target).fadeOut(200);
      fetch('/cart', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          title: $(e.target).parents('.item').find('.title').text()})
      }).then(res=> res.json()).then(res=>{
  
        let parentDiv = $(e.target).parents('.item')
        Storage.getCart().then(cart=>{

          UI.populateCart(cart)
           let parent = $(e.target.parentElement.parentElement)
           parent.text('In Cart')
           parentDiv.css({
             opacity: 0.4
           })}).then(()=>{
            
          }).catch(err=>{
            console.log(err.message)
          });
        })
      
      

    })
  }
  static startApp(cart){
    this.getProducts().then(products=> this.displayProducts(products)).then(()=>{
      this.getBtns()
    })
    //Clear cart
    Storage.saveCart(cart)
    this.populateCart(cart);
    this.updateBtns()
  }

}
class Storage{
  static saveCart(cart){
    sessionStorage.setItem('cswgsusrcrt', JSON.stringify(cart))
}
  static async getCart(){
    let cart = await fetch('/cart', {
      method: 'GET'
    }).then(res=> res.json())
    return cart
  }
}
$(document).ready(function(){
  $('.parallax').parallax();
    $('.scrollspy').scrollSpy();
    $('.sidenav').sidenav({
      inDuration: 500,
      outDuration: 500
    });
    
    //


    fetch('/cart', {
      method: 'GET',
    }).then(res=> res.json()).then(res=>{
      UI.startApp(res)
    } )
$('.clr-crt').click((e)=>{
  e.preventDefault();
  fetch('/cart', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}}).then(res=>res.json()).then(res=>{
    UI.startApp([])
    }).catch(e=>{
      console.log(e.message);
    })

})
    
 });