const firebaseConfig = {
  apiKey: "AIzaSyC2EZx8g3HPjfIC5ELQKdwofNifn3xCgbo",
  authDomain: "informatique-shop-53a25.firebaseapp.com",
  projectId: "informatique-shop-53a25",
  storageBucket: "informatique-shop-53a25.appspot.com",
  messagingSenderId: "1070472171156",
  appId: "1:1070472171156:web:6214bbe7726c12ce666e81"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartSum = document.getElementById('cart-sum');

let cart = [];

function renderProducts() {
  const keyword = document.getElementById('search-bar').value.toLowerCase();
  const category = document.getElementById('category-filter').value;

  db.collection('products').orderBy('title').get().then(snapshot => {
    const categories = {
      FREE: [],
      Abonnement: [],
      Logiciel: []
    };

    snapshot.forEach(doc => {
      const p = doc.data();
      p.id = doc.id;
      if (
        (category === "All" || p.category === category) &&
        p.title.toLowerCase().includes(keyword)
      ) {
        categories[p.category]?.push(p);
      }
    });

    productList.innerHTML = '';
    for (const cat of ['FREE', 'Abonnement', 'Logiciel']) {
      if (categories[cat]?.length) {
        const section = document.createElement('div');
        section.innerHTML = `<h2>${cat === 'FREE' ? 'Produits gratuits' : cat}</h2>`;
        categories[cat].forEach(p => {
          const promo = p.discountPrice && p.discountUntil?.seconds * 1000 > Date.now()
            ? `<span style="color:red;text-decoration:line-through">${p.price} FCFA</span> <strong>${p.discountPrice} FCFA</strong>`
            : `${p.price} FCFA`;
          section.innerHTML += `
            <div class="product">
              <img src="${p.img}" alt="${p.title}" />
              <h3>${p.title}</h3>
              <p>${promo}</p>
              ${p.link
                ? `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`
                : `<button onclick="addToCart('${p.id}', '${p.title}', ${p.discountPrice || p.price})">Ajouter au panier</button>`}
            </div>`;
        });
        productList.appendChild(section);
      }
    }
  });
}

function addToCart(id, name, price) {
  const existing = cart.find(p => p.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, price, qty: 1 });
  updateCart();
}

function updateCart() {
  if (!cart.length) {
    cartItems.innerHTML = "Aucun produit pour le moment.";
    cartTotal.textContent = "";
    document.getElementById("order-btn").style.display = "none";
  } else {
    let html = "";
    let total = 0;
    cart.forEach((p, i) => {
      const sum = p.qty * p.price;
      total += sum;
      html += `<div>${p.name} — ${p.price} x 
        <input type="number" min="1" value="${p.qty}" onchange="changeQty(${i}, this.value)" />
        = ${sum} FCFA <button onclick="removeItem(${i})">❌</button></div>`;
    });
    cartItems.innerHTML = html;
    cartTotal.textContent = `Total : ${total} FCFA`;
    document.getElementById("order-btn").style.display = "inline-block";
  }

  cartCount.textContent = cart.reduce((acc, p) => acc + p.qty, 0);
  cartSum.textContent = cart.reduce((acc, p) => acc + p.qty * p.price, 0) + " FCFA";
}

function changeQty(index, val) {
  const qty = parseInt(val);
  if (qty > 0) {
    cart[index].qty = qty;
    updateCart();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function sendOrder() {
  const name = document.getElementById('client-name').value.trim();
  const payment = document.getElementById('payment-method').value;
  if (!name || !payment) return alert("Veuillez remplir votre nom et méthode de paiement.");

  let msg = `*Nouvelle commande :*%0A`;
  let total = 0;
  cart.forEach(p => {
    msg += `- ${p.name} x${p.qty} = ${p.qty * p.price} FCFA%0A`;
    total += p.qty * p.price;
  });
  msg += `Total : *${total} FCFA*%0A*Nom :* ${name}%0A*Paiement :* ${payment}`;
  window.open(`https://wa.me/2250575719113?text=${encodeURIComponent(msg)}`);
}

// MàJ automatique
['search-bar', 'category-filter'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderProducts);
});

renderProducts();
updateCart();
