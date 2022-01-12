const cartBtn=document.querySelector(".cart-div");
const cartItems=document.querySelector(".item-nos");
const cartOverlay=document.querySelector(".cart-overlay");
const money=document.querySelector(".money"); 
const cartDOM=document.querySelector(".cart");
const productDOM=document.querySelector(".products-center");
const closeBtn=document.querySelector(".close");
const removeBtn=document.querySelector(".remove");
const clearBtn=document.querySelector(".clear");
const cartContent=document.querySelector(".cart-content");
let cart=[];
let btnDOM=[];
class Products{
  async getProducts(){
    try{
   let products=await fetch("./file.json");
   let data=await products.json();
   let dataItems=data.items;
  dataItems=dataItems.map(data=>{
    const {title,price}=data.fields;
 const {id}=data.sys;
 const image=data.fields.image.fields.file.url;
 return {title,price,id,image};
  } ) 
  return dataItems;
}catch(error){
  console.log(error);
}

}
}
class UI{
displayProducts(products){
let result="";
products.forEach((product)=>{
  result+=`
  <div class="my-items"><div class="img-container">
  <img src="${product.image}" class="img-bag">
  <div class="bag-btns" data-id="${product.id}">
    <i class="fas fa-shopping-cart pad"></i>ADD TO CART</div>
  </div>
  <h2>${product.title}</h2>
  <p>$${product.price}</p>
  </div>`
})

productDOM.innerHTML=result;
}
getBtnClick(id){
  let btns=document.querySelectorAll(".bag-btns");
  let btnChecker=[...btns];
  btnDOM=btnChecker;
  btnChecker.forEach((button)=>{
    let id=button.dataset.id;
    let inCart=cart.find(item=>item.id===id);
   if(inCart){
     button.innerText="IN CART";
     button.disabled=true;
   }
   else{
     button.addEventListener('click',event=>{
       event.target.innerText="IN CART";
       event.target.disabled=true;
       
        let newProducts={...this.getSingleProduct(id),amount:1};
        cart=[...cart,newProducts];
       
      
       Storage.setCart(cart);
       //set cart functions
       this.cartFunctions(cart);
       this.addCartItem(newProducts);
       this.showCart();
     })
   }
  }
  )
}
showCart(){
cartOverlay.classList.add("cart-overlay-add");
cartDOM.classList.add("cart-add");
}
setupApp(){
cart=Storage.getCart();
this.cartFunctions(cart);
this.populateCart(cart);
cartBtn.addEventListener("click",this.showCart);
closeBtn.addEventListener("click",this.hideCart);
}
hideCart(){
  cartOverlay.classList.remove("cart-overlay-add");
cartDOM.classList.remove("cart-add");
}
populateCart(cart){
  cart.forEach(item=>{
    this.addCartItem(item);
  })
}
addCartItem(item){
  const div=document.createElement("div");
  div.classList.add("item-cart");
  div.innerHTML=`<img src=${item.image} class="cart-img">
  <div class="together"> <h2>${item.title}</h2>
   <p class="price">$${item.price}</p>
   <p class="remove" data-id=${item.id}>remove</p>
  </div>
  <div class="last">
    <i class="fas fa-chevron-up" data-id=${item.id}></i>
    <p class="amt">1</p>
    <i class="fas fa-chevron-down" data-id=${item.id}></i>
  </div>`
cartContent.appendChild(div);

}
cartFunctions(cart){
let tempTotal=0;
let itemsTotal=0;
cart.map(item=>{
  tempTotal+=item.price*item.amount;
  itemsTotal+=item.amount;
})
cartItems.innerText=itemsTotal;
money.innerText=tempTotal;

}

  getSingleProduct(id){
    let products=Storage.getLocalProducts();
    let newProducts=products.find(product=>{
      if(product.id===id){
        return product;
      }
    })
    return newProducts;
  }
  setCartLogic(){
  clearBtn.addEventListener("click",()=>{this.clearCart()});
  cartContent.addEventListener("click",event=>{
   if(event.target.classList.contains("remove")){
     let id=event.target.dataset.id;
     //console.log(id);
     this.removeThisItem(id);
     Storage.setCart(cart);
     this.cartFunctions(cart);
     let cartItemink=event.target.parentElement.parentElement;
     cartContent.removeChild(cartItemink);
   }
else if(event.target.classList.contains("fa-chevron-up")){
  let id=event.target.dataset.id;
  let tempAmount=cart.find(item=>item.id===id);
  tempAmount.amount=tempAmount.amount+1;
  Storage.setCart(cart);
  this.cartFunctions(cart);
  event.target.nextElementSibling.innerText=tempAmount.amount;
}
else if(event.target.classList.contains("fa-chevron-down")){
  let id=event.target.dataset.id;
  let tempAmount=cart.find(item=>item.id===id);
  tempAmount.amount=tempAmount.amount-1;
  Storage.setCart(cart);
  this.cartFunctions(cart);
  {
    if(tempAmount.amount>0){
      event.target.previousElementSibling.innerText=tempAmount.amount;
    }
    else{
     this.removeThisItem(id);
     cartContent.removeChild(event.target.parentElement.parentElement)
    }
  }
}
  })
 
  }
  clearCart(){
    let cartItems=cart.map(item=>item.id);
    cartItems.forEach((id)=>{this.removeThisItem(id)});
    console.log("hi");
    while(cartContent.children.length>0){
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeThisItem(id){
   cart = cart.filter(item=>item.id!==id);
   this.cartFunctions(cart);
   Storage.setCart(cart);
   let button=this.getSingleBtn(id);
   button.disabled=false;
   button.innerHTML=`<i class="fas fa-shopping-cart"></i>  ADD TO CART`;
  }
  getSingleBtn(id){
    return btnDOM.find(button=>button.dataset.id===id);
  }
}

class Storage{
  static setProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getLocalProducts(){
    let value=JSON.parse(localStorage.getItem("products"));
    return value;
  }
    static setCart(cart){
      localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    }

}
document.addEventListener("DOMContentLoaded",()=>{
  let ui=new UI();
  let products=new Products();
  ui.setupApp();
  products.getProducts().then(products=>{
    ui.displayProducts(products);
    Storage.setProducts(products);
    ui.getBtnClick();
    ui.setCartLogic();
  });
})