let products = [];
let editingId = null;
let isAdminLogged = 0;

const saveLogged = () => {
  localStorage.setItem("isAdminLogged", JSON.stringify(isAdminLogged));
};

const loadLogged = () => {
  const load = localStorage.getItem("isAdminLogged");
  isAdminLogged = load ? JSON.parse(load) : 0;
};

loadLogged();

//login
localStorage.setItem(
  "admin",
  JSON.stringify({ email: "admin@gmail.com", password: "admin123" })
);

const formLogin = document.querySelector("#formLogin");
const emailIp = document.querySelector("#email");
const passwordIp = document.querySelector("#password");

const admin = JSON.parse(localStorage.getItem("admin"));

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    if (emailIp.value === admin.email && passwordIp.value === admin.password) {
      location.href = "./admin.html";
      isAdminLogged = 1;
      saveLogged();
    } else {
      alert("Email or Password incorrect!!!");
      return;
    }
  });
}

//admin

const saveData = () => {
  localStorage.setItem("products", JSON.stringify(products));
};

const loadData = () => {
  const loadProduct = localStorage.getItem("products");
  products = loadProduct ? JSON.parse(loadProduct) : [];
};

const formProduct = document.querySelector("#formProduct");
const nameIp = document.querySelector("#name");
const priceIp = document.querySelector("#price");
const describeIp = document.querySelector("#describe");
const imgIp = document.querySelector("#img");
const tbody = document.querySelector("#productTable tbody");
const btnAoR = document.querySelector("#addupdatebtn");

const renderTable = () => {
  tbody.innerHTML = "";
  loadData();

  products.forEach((item, index) => {
    const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} $</td>
                <td>${item.describe}</td>
                <td>
                    <img src="${item.img}" alt="img-${item.name}">
                </td>
                <td>
                    <button onclick="editProduct(${
                      item.id
                    })" class="btn" popovertarget="addOrUpdate"> Edit</button>
                    <button onclick="deleteProduct(${
                      item.id
                    })" class="btn"> Delete</button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
};

const addOrUpdate = () => {
  const name = nameIp.value.trim();
  const price = priceIp.value.trim();
  const describe = describeIp.value.trim();
  const img = imgIp.value.trim();

  if (!name || !price || !describe || !img) {
    alert("Please, Input full information of product!!!");
    return;
  }

  const productData = {
    id: editingId ?? Date.now(),
    name,
    price,
    describe,
    img,
  };

  if (editingId === null) {
    products.push(productData);
  } else {
    products = products.map((p) => (p.id === editingId ? productData : p));
    editingId = null;
  }

  saveData();
  formProduct.reset();
  renderTable();
};

const editProduct = (id) => {
  btnAoR.innerHTML = "Update";
  const product = products.find((p) => p.id === id);
  if (product) {
    editingId = id;
    nameIp.value = product.name;
    priceIp.value = product.price;
    describeIp.value = product.describe;
    imgIp.value = product.img;
  }
};

const deleteProduct = (id) => {
  const product = products.find((p) => p.id === id);
  if (confirm(`Delete product: ${product.name}?`)) {
    products = products.filter((p) => p.id !== id);
    if (editingId === id) {
      editingId = null;
      formProduct.reset();
    }
  }
  saveData();
  renderTable();
};

if (formProduct) {
  renderTable();
  formProduct.addEventListener("submit", (e) => {
    e.preventDefault();
    btnAoR.innerHTML = "Add";
    addOrUpdate();
  });
}

//index
const pGrid = document.querySelector("#productGrid");

const renderGrid = () => {
  pGrid.innerHTML = "";
  loadData();
  products.forEach((item, index) => {
    const pItem = `
            <div class="productItem">
                <img src="${item.img}" alt="product-item-img">
                <h4>${item.name}</h4>
                <h4>${item.price} $</h4>
                <p>${item.describe}</p>
                <button>Buy now</button>
            </div>
    
        `;
    pGrid.innerHTML += pItem;
  });
};

if (pGrid) {
  renderGrid();
}

loadLogged();

if (isAdminLogged) {
  const login = document.querySelector("#login");
  if (login) {
    login.innerHTML = `
            <button><a href="./admin.html">Admin</a></button>
            <button id="logout"><a href="./index.html">Logout</a></button>`;
  }
}

const logoutBtn = document.querySelector("#logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    isAdminLogged = 0;
    saveLogged();
    location.href = "./index.html";
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector("#login").innerHTML = `
            <button>Register</button>
            <button><a href="./login.html">Login</a></button>`;
    });
  });
}
