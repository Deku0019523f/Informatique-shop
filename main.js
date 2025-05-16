if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyC2EZx8g3HPjfIC5ELQKdwofNifn3xCgbo",
    authDomain: "informatique-shop-53a25.firebaseapp.com",
    projectId: "informatique-shop-53a25",
  });
}

const db = firebase.firestore();
let allProducts = [];
let cart = [];

const categories = ["Abonnement", "Logiciel", "FREE"];

function renderAllProducts(search = "", filterCat = "All") {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  const lowerSearch = search.toLowerCase();

  categories.forEach(cat => {
    if (filterCat !== "All" && filterCat !== cat) return;

    const sectionProducts = allProducts.filter(p =>
      p.category === cat &&
      (p.title.toLowerCase().includes(lowerSearch) || p.category.toLowerCase().includes(lowerSearch))
    );

    if (sectionProducts.length) {
      const section = document.createElement("div");
      section.innerHTML = `<h2 style="color:#007bff">${cat}</h2>`;

      sectionProducts.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";

        const now = new Date();
        let prixHTML = `<p>${p.price == 0 ? "Gratuit" : p.price + " FCFA"}</p>`;
        let bouton = "";

        // Vérifie promo active
        const nowMs = now.getTime();
        let discountActive = p.discountPrice && p.discountUntil?.seconds * 1000 > nowMs;

        if (discountActive) {
          prixHTML = `
            <p>
              <span style="text-decoration:line-through; color:gray;">${p.price} FCFA</span>
              <span style="color:red; font-weight:bold;">${p.discountPrice} FCFA</span><br>
              <small id="timer-${p.title.replace(/\s/g, "")}"></small>
            </p>`;
          setCountdown(`timer-${p.title.replace(/\s/g, "")}`, p.discountUntil.seconds * 1000);
        }

        if (p.price == 0 && p.link) {
          bouton = `<a href="${p.link}" target="_blank"><button>Télécharger</button></a>`;
        } else {
          bouton = `<button onclick="addToCartByTitle('${p.title}')">Ajouter au panier</button>`;
        }

        // Calcul % réduction
        let discountPercent = 0;
        if (discountActive) {
          discountPercent = Math.round(100 - (p.discountPrice / p.price) * 100);
        }

        div.innerHTML = `
          <div style="position:relative; display:inline-block;">
            <img src="${p.img}" alt="${p.title}" />
            ${
              discountPercent > 0
                ? `<div style="
                    position:absolute;
                    top:5px; left:5px;
                    background:red;
                    color:white;
                    padding: 3px 7px;
                    font-weight:bold;
                    font-size:14px;
                    border-radius: 3px;
                    z-index:10;
                  ">-${discountPercent}%</div>`
                : ''
            }
          </div>
          <h3>${p.title}</h3>
          ${prixHTML}
          ${bouton}
        `;
        section.appendChild(div);
      });

      container.appendChild(section);
    }
  });
}

function setCountdown(id, endTime) {
  const el = document.getElementById(id);
  if (!el) return;

  function update() {
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) {
      el.innerText = "Offre expirée";
      return;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    el.innerText = `Expire dans ${h}h ${m}m ${s}s`;
    setTimeout(update, 1000);
  }

  update();
}

function addToCartByTitle(title) {
  const p = allProducts.find(i => i.title === title);
  if (!p) return;

  const nowMs = Date.now();
  const discountActive = p.discountPrice && p.discountUntil?.seconds * 1000 > nowMs;
  const price = discountActive ? p.discountPrice : p.price;

  const found = cart.find(i => i.title === p.title);
  if (found) {
    found.qty++;
  } else {
    cart.push({ title: p.title, qty: 1, price });
  }
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
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

document.getElementById("search-bar").addEventListener("input", () => {
  const q = document.getElementById("search-bar").value;
  const c = document.getElementById("category-filter").value;
  renderAllProducts(q, c);
});

document.getElementById("category-filter").addEventListener("change", () => {
  const q = document.getElementById("search-bar").value;
  const c = document.getElementById("category-filter").value;
  renderAllProducts(q, c);
});

window.onload = () => {
  db.collection("products").orderBy("title").onSnapshot(snapshot => {
    allProducts = [];
    snapshot.forEach(doc => {
      allProducts.push(doc.data());
    });
    renderAllProducts();
    updateCart();
  });
};
