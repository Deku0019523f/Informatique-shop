// Initialiser Firebase si pas déjà fait
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyC2EZx8g3HPjfIC5ELQKdwofNifn3xCgbo",
    authDomain: "informatique-shop-53a25.firebaseapp.com",
    projectId: "informatique-shop-53a25",
  });
}

const db = firebase.firestore();
let cart = [];
let allProducts = [];

function renderProducts(category = "All") {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  let products = category === "All"
    ? allProducts
    : allProducts.filter(p => p.category === category);

  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.price == 0 ? "Gratuit" : p.price + " FCFA"}</p>
      ${
        p.price == 0 && p.link
          ? `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`
          : `<button onclick="addToCart(${index})">Ajouter au panier</button>`
      }
    `;
    container.appendChild(div);
  });
}

function setCategory(c) {
  renderProducts(c);
}

function addToCart(index) {
  const p = allProducts[index];
  const found = cart.find(i => i.title === p.title);
  if (found) {
    found.qty++;
  } else {
    cart.push({ title: p.title, qty: 1, price: p.price });
  }
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  const count = document.getElementById("cart-count");
  const sum = document.getElementById("cart-sum");

  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const row = document.createElement("div");
    row.innerHTML = `
      ${item.title} x${item.qty} = ${item.qty * item.price} FCFA
      <input type="number" value="${item.qty}" onchange="changeQty(${i}, this.value)">
      <button onclick="removeFromCart(${i})">Supprimer</button>
    `;
    list.appendChild(row);
    total += item.qty * item.price;
  });

  document.getElementById("cart-total").textContent = "Total : " + total + " FCFA";
  document.getElementById("order-btn").style.display = cart.length ? "inline-block" : "none";
  count.textContent = cart.length;
  sum.textContent = total + " FCFA";
}

function changeQty(i, qty) {
  cart[i].qty = parseInt(qty);
  updateCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function sendOrder() {
  const name = document.getElementById("client-name").value.trim();
  const payment = document.getElementById("payment-method").value;
  if (!name || !payment) return alert("Remplissez votre nom et méthode de paiement.");
  let msg = `*Nouvelle commande :*%0A`;
  let total = 0;
  cart.forEach(i => {
    msg += `- ${i.title} x${i.qty} = ${i.qty * i.price} FCFA%0A`;
    total += i.qty * i.price;
  });
  msg += `Total : *${total} FCFA*%0A*Nom :* ${name}%0A*Paiement :* ${payment}`;
  window.open(`https://wa.me/2250575719113?text=${encodeURI(msg)}`);
}

window.onload = () => {
  db.collection("products").orderBy("title").onSnapshot(snapshot => {
    allProducts = [];
    snapshot.forEach(doc => {
      allProducts.push(doc.data());
    });
    renderProducts();
    updateCart();
  });
};
