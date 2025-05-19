const firebaseConfig = {
  apiKey: "AIzaSyC2EZx8g3HPjfIC5ELQKdwofNifn3xCgbo",
  authDomain: "informatique-shop-53a25.firebaseapp.com",
  projectId: "informatique-shop-53a25",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function fetchProducts() {
  db.collection('products').onSnapshot(snapshot => {
    products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    renderProducts();
  });
}

function renderProducts() {
  const list = document.getElementById('product-list');
  const search = document.getElementById('search-bar')?.value.toLowerCase() || '';
  const category = document.getElementById('category-filter')?.value || 'All';
  list.innerHTML = '';

  products.filter(p =>
    p.title.toLowerCase().includes(search) &&
    (category === 'All' || p.category === category)
  ).forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';

    const isPromo = p.discountPrice && p.discountUntil?.seconds * 1000 > Date.now();
    const displayPrice = isPromo
      ? `<del>${p.price} FCFA</del> <strong>${p.discountPrice} FCFA</strong>`
      : (p.price === 0 ? 'Gratuit' : p.price + ' FCFA');

    const countdown = isPromo
      ? `<small class="countdown" data-end="${p.discountUntil.seconds * 1000}"></small>`
      : '';

    let promoBadge = '';
    if (isPromo && p.discountPrice < p.price) {
      const percent = Math.round(100 - (p.discountPrice / p.price) * 100);
      promoBadge = `<div class="badge" style="position:absolute;top:10px;left:10px;background:red;color:white;padding:3px 6px;border-radius:5px;font-size:12px;">-${percent}%</div>`;
    }

    card.innerHTML = `
      <div style="position: relative;">
        ${promoBadge}
        <img src="${p.img}" alt="${p.title}">
      </div>
      <h3>${p.title}</h3>
      <p>${displayPrice}</p>
      ${countdown}
      ${p.link && p.price === 0
        ? `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`
        : `<button onclick="addToCart('${p.id}')">Ajouter au panier</button>`}
    `;
    list.appendChild(card);
  });

  updateCountdowns();
}

function updateCountdowns() {
  document.querySelectorAll('.countdown').forEach(el => {
    const end = +el.dataset.end;
    const left = end - Date.now();
    if (left > 0) {
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      el.textContent = `Promo expire dans ${h}h ${m}min`;
    } else {
      el.textContent = 'Promo expirée';
    }
  });
}

function getProductPrice(p) {
  const now = Date.now();
  return p.discountPrice && p.discountUntil?.seconds * 1000 > now
    ? p.discountPrice : p.price;
}

function addToCart(id) {
  const prod = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, name: prod.title, price: getProductPrice(prod), qty: 1 });
  saveCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const div = document.getElementById('cart-items');
  const sum = document.getElementById('cart-sum');
  const count = document.getElementById('cart-count');
  if (!div) return;

  if (!cart.length) {
    div.innerHTML = 'Aucun produit pour le moment.';
    document.getElementById('order-btn').style.display = 'none';
    count.textContent = 0;
    sum.textContent = '0 FCFA';
    return;
  }

  let html = '', total = 0;
  cart.forEach((item, i) => {
    total += item.qty * item.price;
    html += `
      <p>
        ${item.name} x 
        <input type="number" min="1" value="${item.qty}" onchange="updateQty(${i}, this.value)" /> 
        = ${item.qty * item.price} FCFA
        <button onclick="removeItem(${i})">X</button>
      </p>
    `;
  });

  div.innerHTML = html;
  count.textContent = cart.reduce((a, b) => a + b.qty, 0);
  sum.textContent = total + ' FCFA';
  document.getElementById('order-btn').style.display = 'block';
  document.getElementById('cart-total').textContent = 'Total : ' + total + ' FCFA';
}

function updateQty(index, val) {
  cart[index].qty = parseInt(val);
  saveCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

function clearCart() {
  if (confirm('Vider le panier ?')) {
    cart = [];
    saveCart();
  }
}

function sendOrder() {
  const name = document.getElementById('client-name').value.trim();
  const payment = document.getElementById('payment-method').value;
  if (!name || !payment) return alert("Remplissez votre nom et méthode de paiement.");

  let msg = `*Nouvelle commande :*%0A`;
  let total = 0;
  cart.forEach(i => {
    msg += `- ${i.name} x${i.qty} = ${i.qty * i.price} FCFA%0A`;
    total += i.qty * i.price;
  });
  msg += `Total : *${total} FCFA*%0A*Nom :* ${name}%0A*Paiement :* ${payment}`;
  window.open(`https://wa.me/2250575719113?text=${encodeURI(msg)}`);
}

['search-bar', 'category-filter'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', renderProducts);
});

fetchProducts();
updateCart();
setInterval(updateCountdowns, 30000);
