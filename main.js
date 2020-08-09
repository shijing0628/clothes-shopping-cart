let products = [
  {
    name: "Grey Tshirt",
    tag: "greytshirt",
    price: 15,
    inCart: 0,
  },
  {
    name: "Grey Hoddie",
    tag: "greyhoddie",
    price: 20,
    inCart: 0,
  },
  {
    name: "Black Tshirt",
    tag: "blacktshirt",
    price: 10,
    inCart: 0,
  },
  {
    name: "Black Hoddie",
    tag: "blackhoddie",
    price: 25,
    inCart: 0,
  },
];

// Display cart icon number
let carts = document.querySelectorAll(".add-cart");

for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener("click", () => {
    // console.log("add cart");
    // pass pram to make sure which product we clicked
    cartNumbers(products[i]);
    totalCost(products[i]);
  });
}

//refresh page cart icon number
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

//save "addtocart" click times into local storage, also display in cart icon
function cartNumbers(product, action) {
  //console.log(product);

  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = JSON.parse(productNumbers);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action == "decrease") {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart span").textContent = productNumbers - 1;
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }

  //   if (productNumbers) {
  //     localStorage.setItem("cartNumbers", productNumbers + 1);
  //     document.querySelector(".cart span").textContent = productNumbers + 1;
  //   } else {
  //     localStorage.setItem("cartNumbers", 1);
  //     document.querySelector(".cart span").textContent = 1;
  //   }
  setItems(product);
}

//grab the item that was clicked
function setItems(product) {
  //get item from local storage need to pase to js object by json parse
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    }
    cartItems[product.tag].inCart += 1;
  } else {
    // console.log(product);
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }
  cartItems = JSON.stringify(cartItems);
  localStorage.setItem("productsInCart", cartItems);
}

//calulate total price add into local storage
function totalCost(product, action) {
  // console.log(product.price);
  let cartCost = localStorage.getItem("totalCost");
  if (action == "decrease") {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost - product.price);
  } else if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", product.price + cartCost);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let cartCost = localStorage.getItem("totalCost");
  let productContainer = document.querySelector(".products");

  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
       <div class="product-item">
            <div class="product">
                <ion-icon name="close-circle"></ion-icon>
                <img src="./images/${item.tag}.jpg"/>
                <span>${item.name}</span>
            </div>
            <div class="price">${item.price}</div>
            <div class="quantity"> <ion-icon class="decrease" name="close-circle"></ion-icon>
            <span>${item.inCart}</span>
             <ion-icon class="increase" name="close-circle"></ion-icon>
            </div>
            <div class="total">
            $${item.inCart * item.price}.00</div>
          </div>
        `;
    });
    productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">
            Basket Total:
            <h4>
            <h4 class="basketTotal">
            $${cartCost}.00
            </h4>
        </div>
        
      `;
  }

  deleteButton();
  manageQuantity();
}

// delete item
function deleteButton() {
  let deleteButtons = document.querySelectorAll(".product ion-icon");
  let productName;
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let cartCost = localStorage.getItem("totalCost");
  cartCost = JSON.parse(cartCost);

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[i].parentElement.textContent
        .trim()
        .toLowerCase()
        .replace(/ /g, "");

      //   console.log(productName);
      //   console.log(productNumbers);

      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );

      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].inCart * cartItems[productName].price
      );

      delete cartItems[productName];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      onLoadCartNumbers();
      displayCart();
    });
  }
}

function manageQuantity() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let currentQuantity = 0;
  let currentProduct = "";

  for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;
      currentProduct = decreaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling.querySelector(
        "span"
      ).textContent;
      currentProduct = currentProduct.toLowerCase().trim().replace(/ /g, "");
      // console.log(currentProduct);
      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCart();
      }
    });
  }
  for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener("click", () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;
      currentProduct = decreaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling.querySelector(
        "span"
      ).textContent;
      currentProduct = currentProduct.toLowerCase().trim().replace(/ /g, "");
      // console.log(currentProduct);

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCart();
    });
  }
}
//???
function directHomePage() {
  let cartImages = document.querySelectorAll(".products img");
  console.log(cartImages);
  for (let i = 0; i < cartImages.length; i++) {
    cartImages[i].addEventListener("click", () => {
      console.log(cartImages);
      window.location.href = "/";
    });
  }
}
directHomePage();

onLoadCartNumbers();
displayCart();
