let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>Prix : ${p.price === 0 ? "Gratuit" : p.price + " FCFA"}</p>
      ${p.price === 0 && p.link
        ? `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`
        : `<button onclick="addToCart('${p.title}', ${p.price})">Ajouter au panier</button>`}
    `;
    container.appendChild(div);
  });
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  showToast("Ajouté au panier !");
}

function updateCart() {
  const items = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  const orderBtn = document.getElementById("order-btn");
  const summaryCount = document.getElementById("cart-count");
  const summaryTotal = document.getElementById("cart-sum");
  let sum = 0;

  items.innerHTML = "";
  if (cart.length === 0) {
    items.textContent = "Aucun produit pour le moment.";
    total.textContent = "";
    orderBtn.style.display = "none";
    summaryCount.textContent = "0";
    summaryTotal.textContent = "0 FCFA";
    return;
  }

  cart.forEach(item => {
    const line = document.createElement("div");
    line.className = "cart-item";
    line.innerHTML = `
      ${item.name}
      <input type="number" min="1" value="${item.qty}" onchange="updateQty('${item.name}', this.value)">
      = ${item.qty * item.price} FCFA
      <button onclick="removeFromCart('${item.name}')">X</button>
    `;
    items.appendChild(line);
    sum += item.qty * item.price;
  });

  total.textContent = `Total : ${sum} FCFA`;
  summaryCount.textContent = cart.reduce((a, i) => a + i.qty, 0);
  summaryTotal.textContent = sum + " FCFA";
  orderBtn.style.display = "block";
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  showToast("Produit supprimé.");
}

function updateQty(name, qty) {
  const item = cart.find(i => i.name === name);
  if (item) item.qty = parseInt(qty) || 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCart();
  showToast("Panier vidé.");
}

function sendOrder() {
  const name = document.getElementById("client-name").value.trim();
  const payment = document.getElementById("payment-method").value;
  if (!name || !payment || cart.length === 0) {
    showToast("Remplissez toutes les informations.");
    return;
  }

  if (!confirm("Envoyer cette commande sur WhatsApp ?")) return;

  let msg = `*Nouvelle commande :*%0A`;
  let total = 0;
  cart.forEach(i => {
    msg += `- ${i.name} x${i.qty} = ${i.qty * i.price} FCFA%0A`;
    total += i.qty * i.price;
  });
  msg += `Total : *${total} FCFA*%0A*Nom :* ${name}%0A*Paiement :* ${payment}`;
  window.open(`https://wa.me/2250575719113?text=${encodeURI(msg)}`);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

renderProducts();
updateCart();