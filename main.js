const db = firebase.firestore(); let products = []; let cart = [];

function renderProducts() { const list = document.getElementById('product-list'); const search = document.getElementById('search-bar').value.toLowerCase(); const category = document.getElementById('category-filter').value; list.innerHTML = '';

products.forEach(p => { if ( (category === 'All' || p.category === category) && p.title.toLowerCase().includes(search) ) { const card = document.createElement('div'); card.className = 'product'; const isPromo = p.discountPrice && p.discountUntil?.seconds * 1000 > Date.now(); const displayPrice = isPromo ? <del>${p.price} FCFA</del> <strong>${p.discountPrice} FCFA</strong> : (p.price === 0 ? 'Gratuit' : p.price + ' FCFA'); const countdown = isPromo ? <small class="countdown" data-end="${p.discountUntil.seconds * 1000}"></small> : '';

card.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <h3>${p.title}</h3>
    <p>${displayPrice}</p>
    ${countdown}
    ${p.link && p.price === 0
      ? `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`
      : `<button onclick="addToCart('${p.id}')">Ajouter au panier</button>`
    }
  `;
  list.appendChild(card);
}

}); }

function updateCountdowns() { document.querySelectorAll('.countdown').forEach(el => { const end = parseInt(el.dataset.end); const remaining = end - Date.now(); if (remaining > 0) { const h = Math.floor(remaining / (1000 * 60 * 60)); const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)); const s = Math.floor((remaining % (1000 * 60)) / 1000); el.textContent = Promo: ${h}h ${m}m ${s}s; } else { el.textContent = 'Promo terminée'; } }); } setInterval(updateCountdowns, 1000);

function updateCart() { const container = document.getElementById('cart-items'); const totalDisplay = document.getElementById('cart-total'); const countDisplay = document.getElementById('cart-count'); const sumDisplay = document.getElementById('cart-sum'); const orderBtn = document.getElementById('order-btn'); container.innerHTML = ''; let total = 0;

if (cart.length === 0) { container.textContent = 'Aucun produit pour le moment.'; orderBtn.style.display = 'none'; } else { cart.forEach(item => { const div = document.createElement('div'); div.innerHTML = ${item.title} x${item.qty} = ${item.price * item.qty} FCFA  <input type="number" value="${item.qty}" min="1" onchange="updateQty('${item.id}', this.value)" /> <button onclick="removeFromCart('${item.id}')">x</button>; container.appendChild(div); total += item.price * item.qty; }); orderBtn.style.display = 'inline-block'; }

totalDisplay.textContent = 'Total : ' + total + ' FCFA'; countDisplay.textContent = cart.length; sumDisplay.textContent = total + ' FCFA'; }

function addToCart(id) { const item = products.find(p => p.id === id); const exist = cart.find(c => c.id === id); const price = item.discountPrice && item.discountUntil?.seconds * 1000 > Date.now() ? item.discountPrice : item.price;

if (exist) { exist.qty += 1; } else { cart.push({ ...item, qty: 1, price }); } updateCart(); }

function updateQty(id, qty) { const item = cart.find(c => c.id === id); if (item) { item.qty = parseInt(qty); updateCart(); } }

function removeFromCart(id) { cart = cart.filter(c => c.id !== id); updateCart(); }

function clearCart() { cart = []; updateCart(); }

function sendOrder() { const name = document.getElementById('client-name').value.trim(); const payment = document.getElementById('payment-method').value; if (!name || !payment) { alert('Veuillez remplir votre nom et méthode de paiement.'); return; } let msg = *Nouvelle commande :*%0A; let total = 0; cart.forEach(item => { msg += - ${item.title} x${item.qty} = ${item.qty * item.price} FCFA%0A; total += item.qty * item.price; }); msg += Total : *${total} FCFA*%0A*Nom :* ${name}%0A*Paiement :* ${payment}; window.open(https://wa.me/2250575719113?text=${encodeURIComponent(msg)}); }

['search-bar', 'category-filter'].forEach(id => { document.getElementById(id).addEventListener('input', renderProducts); });

db.collection('products').onSnapshot(snapshot => { products = []; snapshot.forEach(doc => { products.push({ id: doc.id, ...doc.data() }); }); renderProducts(); });

updateCart();

  
