//! Super Task
//! Реализовать имитацию блога

//todo 1. Каждый пользователь должен иметь возможность зарегистрироваться и авторизоваться на сайте, вид объекта пользователя:
// {
//   id: 12,
//   name: 'Jack',
//   password: 'superJack',
//   favorites: []
// }

//todo 2. Полный CRUD на посты, каждый зарегистрированный и авторизованный пользователь должен получить доступ к созданию, редактированию, удалению ТОЛЬКО СВОИХ постов, вид объекта поста:
// {
//   id: 4,
//   title: SomeTitle,
//   content: SomeContent,
//   likes: 8,
//   author: {
//     id: 12,
//     name: 'Jack',
//   }

//todo 3. Незарегистрированные и неавторизованные пользователи могут только просматривать посты

//todo 4. Каждый пользователь может поставить лайк любому посту, после чего пост, который нравится пользователю, отображается в массиве favorites, например пользователю с id-12, нравится пост с id-4, пользователь ставит лайк посту, пост добавляется в массив favorites, который находится в объекте пользователя:
// {
//   id: 12,
//   name: 'Jack',
//   password: 'superJack',
//   favorites: [
//     {
//       id: 4,
//       title: SomeTitle,
//       content: SomeContent,
//       likes: 8
//     }
//   ]
// },
//todo в свою очередь количество лайков у поста повышается:
// {
//   id: 4,
//   title: SomeTitle,
//   content: SomeContent,
//   likes: 8 -> 9
// },
//todo также у поста кнопка ЛАЙК должна измениться на ДИЗЛАЙК, при нажатии количество лайков у поста должно уменьшиться на 1, а у пользователя данный пост должен быть удален из массива favorites
//! ВАЖНО: если пользователь ставик лайк посту, то для него исчезает кнопка лайк и появляется кнопка дизлайк(для данного поста), но если зайти под другим аккаунтом, который еще не ставил лайк, то кнопка лайк снова должна появиться

// 7. комменты // admin -- author ориентир на ID
// title content только вводит пользователь

let registerUserModalBtn = document.querySelector("#registerUser-modal");
let loginUserModalBtn = document.querySelector("#loginUser-modal");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let registerUserBtn = document.querySelector("#registerUser-btn");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");
let closeRegisterModalBtn = document.querySelector(".btn-close");

registerUserModalBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: flex !important");
  registerUserBtn.setAttribute("style", "display: flex !important");

  loginUserModalBlock.setAttribute("style", "display: none !important");
  loginUserBtn.setAttribute("style", "display: none !important");
});

loginUserModalBtn.addEventListener("click", () => {
  loginUserModalBlock.setAttribute("style", "display: flex !important");
  loginUserBtn.setAttribute("style", "display: flex !important");

  registerUserModalBlock.setAttribute("style", "display: none !important");
  registerUserBtn.setAttribute("style", "display: none !important");
});

const USERS_API = "http://localhost:8000/users";

// inputs group
let usernameInp = document.querySelector("#reg-username");
let ageInp = document.querySelector("#reg-age");
let passwordInp = document.querySelector("#reg-password");
let passwordConfirmInp = document.querySelector("#reg-passwordConfirm");
let isAdminInp = document.querySelector("#isAdmin");

async function checkUniqeUsername(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}
// chekUniqeUsername();
async function registerUser() {
  if (
    !usernameInp.value.trim() &&
    !ageInp.value.trim() &&
    !passwordInp.value.trim() &&
    !passwordConfirmInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let uniqeUsername = await checkUniqeUsername(usernameInp.value);
  if (uniqeUsername) {
    alert("User with this username already excists!");
    return;
  }
  if (passwordInp.value !== passwordConfirmInp.value) {
    alert("Password dont match");
    return;
  }

  let userObj = {
    id: Date.now(),
    username: usernameInp.value,
    age: ageInp.value,
    password: passwordInp.value,
    isAdmin: isAdminInp.checked,
    favorites: [],
  };

  await fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  usernameInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";
  isAdminInp.checked = "";

  closeRegisterModalBtn.click();
}
registerUserBtn.addEventListener("click", registerUser);

// login logicH
let showUsername = document.querySelector("#showUsername");
function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginUserModalBtn.parentNode.style.display = "block";
    logoutUserBtn.parentNode.style.display = "none";
    showUsername.innerText = "No user";
  } else {
    logoutUserBtn.parentNode.style.display = "block";
    loginUserModalBtn.parentNode.style.display = "none";
    showUsername.innerText = JSON.parse(user).username;
  }
  showAdminPanel();
}
checkLoginLogoutStatus();

let loginUsernameInp = document.querySelector("#login-username");
let passUsernameInp = document.querySelector("#login-password");

function checkUserInUsers(username, users) {
  return users.some((item) => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function setUserToStorage(username, isAdmin, favorites, id) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username,
      isAdmin,
      favorites,
      id,
    })
  );
}
function getProductsFromStorage() {
  let products = JSON.parse(localStorage.getItem("user"));
  return products;
}
function toLokaleStorage(product) {
  localStorage.setItem("user", JSON.stringify(product));
}
async function loginUser() {
  if (!loginUsernameInp.value.trim() || !passUsernameInp.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  let res = await fetch(USERS_API);
  let users = await res.json();

  if (!checkUserInUsers(loginUsernameInp.value, users)) {
    alert("User not found!");
    return;
  }

  let userObj = users.find((item) => item.username === loginUsernameInp.value);

  if (!checkUserPassword(userObj, passUsernameInp.value)) {
    alert("Wrong password!");
    return;
  }

  setUserToStorage(
    userObj.username,
    userObj.isAdmin,
    userObj.favorites,
    userObj.id
  );

  loginUsernameInp = "";
  passUsernameInp = "";

  checkLoginLogoutStatus();

  closeRegisterModalBtn.click();

  render();
}

// logout logic
logoutUserBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkLoginLogoutStatus();
  render();
});

loginUserBtn.addEventListener("click", loginUser);

// create logic
function checkUserForProductCreate() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) return user.isAdmin;
  return false;
}

function showAdminPanel() {
  let adminPanel = document.querySelector("#admin-panel");
  if (!checkUserForProductCreate()) {
    adminPanel.setAttribute("style", "display: none !important;");
  } else {
    adminPanel.setAttribute("style", "display: flex !important;");
  }
}

let productTitle = document.querySelector("#product-title");
let productDesc = document.querySelector("#product-desc");

const PRODUCTS_API = "http://localhost:8000/products";

let count = 0;
async function createProduct() {
  let user = localStorage.getItem("user");
  if (!productTitle.value.trim() || !productDesc.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }
  let productObj = {
    title: productTitle.value,
    desc: productDesc.value,
    like: count,
    author: JSON.parse(user).username,
  };

  await fetch(PRODUCTS_API, {
    method: "POST",
    body: JSON.stringify(productObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  productTitle.value = "";
  productDesc.value = "";

  render();
}
let addProductBtn = document.querySelector(".add-product-btn");
addProductBtn.addEventListener("click", createProduct);

async function render() {
  let productsList = document.querySelector("#products-list");
  productsList.innerHTML = "";
  let res = await fetch(PRODUCTS_API);
  let products = await res.json();
  products.forEach((item) => {
    productsList.innerHTML += `
    <div class="card m-5" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Title: ${item.title}</h5>
        <p class="card-text">Description: ${item.desc}</p>
        <p class="card-text">Likes: ${item.like}</p>
        <p class="card-text">Author: ${item.author}</p>
        ${
          checkUserForProductCreate()
            ? `
        <a href="#" class="btn btn-outline-warning btn-like" id="like-${item.id}">LIKE</a>
        <a href="#" class="btn btn-outline-warning btn-dislike" id="disedit-${item.id}">DISLIKE</a>
        <a href="#" class="btn btn-dark btn-edit" id="edit-${item.id}">EDIT</a>
        <a href="#" class="btn btn-danger btn-delete" id="del-${item.id}">DELETE</a>
        `
            : ""
        }
      </div>
    </div>
    `;
  });

  if (products.length === 0) return;
  addDeleteEvent();
  likeProduct();
  getLikeButton();
  // disAndLike();
  dislikeProduct();
}
render();
async function deleteProductFunc(e) {
  let productId = e.target.id.split("-")[1];
  await fetch(`${PRODUCTS_API}/${productId}`, {
    method: "DELETE",
  });
  render();
}

function addDeleteEvent() {
  let deleteProductBtn = document.querySelectorAll(".btn-delete");
  deleteProductBtn.forEach((item) =>
    item.addEventListener("click", deleteProductFunc)
  );
}

// // like logic
async function likeToProductFunc(e) {
  let user = await getProductsFromStorage();
  let productId = e.target.id.split("-")[1];
  let res = await fetch(PRODUCTS_API);
  let data = await res.json();
  let product = await data.find((item) => item.id == productId);
  if (product) {
    product.like -= 1;
    await fetch(`${USERS_API}/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    let favorites = user.favorites.filter((item) => item.id == productId);
    user.favorites = favorites;
    toLokaleStorage(user);
    render();
  }

  console.log(product);
  product.like += 1;
  console.log(user);
  if (user) {
    user.favorites.push(product);
    toLokaleStorage(user);
    let res = await fetch(USERS_API);
    let data = await res.json();
    let userObj = data.find((item) => item.id);

    await fetch(`${USERS_API}/${userObj.id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorites: user.favorites }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  // disAndLike();
  render();
  // if (product) {
  //   user.favorites.splice(index, 1);
  //   edit(user.id, user);
  //   console.log(user.favorites);
  //   console.log("yes");
  // }
}
function disToProductFunc() {
  console.log("Hello");
}
function likeProduct(e) {
  let likeProductBtn = getLikeButton("like");
  likeProductBtn.forEach((item) => {
    item.addEventListener("click", likeToProductFunc);
  });
}
function dislikeProduct(e) {
  let dislikeProductBtn = getLikeButton("dis");
  dislikeProductBtn.forEach((item) => {
    item.addEventListener("click", disToProductFunc);
  });
}
function getLikeButton(or) {
  let likeProductBtn = document.querySelectorAll(".btn-like");
  let dislikeProductBtn = document.querySelectorAll(".btn-dislike");
  if (or == "like") {
    return likeProductBtn;
  } else if (or == "dis") {
    return dislikeProductBtn;
  }
}
// async function disAndLike() {
//   let likeProductBtn = getLikeButton("like");
//   let dislikeProductBtn = getLikeButton("dis");
//   likeProductBtn.forEach((item) => {
//     if (likeToProductFunc) {
//       item.setAttribute("style", "display: block !important");
//       dislikeProductBtn.setAttribute("style", "display: none !important");
//     } else {
//       item.setAttribute("style", "display: none !important");
//       dislikeProductBtn.setAttribute("style", "display: block !important");
//     }
//   });
//   dislikeProductBtn.forEach((item) => {
//     if (!likeToProductFunc) {
//       item.setAttribute("style", "display: none !important");
//     } else {
//       item.setAttribute("style", "display: block !important");
//     }
//   });
// }
// disAndLike();
