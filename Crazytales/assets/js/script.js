'use strict';

let cart = [];


/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

// shopping cart
function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
}



//customisation logic
let selectedItem = {};

function openCustomizeModal(item) {
  selectedItem = item;
  document.getElementById('modal-item-name').textContent = `Customize: ${item.name}`;
  document.getElementById('custom-qty').value = 1;
  document.getElementById('custom-spice').value = 'Medium';
  document.getElementById('customize-modal').style.display = 'block';
}

function closeCustomizeModal() {
  document.getElementById('customize-modal').style.display = 'none';
}

function confirmCustomization() {
  const qty = parseInt(document.getElementById('custom-qty').value);
  const spice = document.getElementById('custom-spice').value;
  const item = {
    ...selectedItem,
    qty: qty,
    spice: spice
  };

  // Check if already in cart
  const existing = cart.find(i => i.id === item.id && i.spice === item.spice);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push(item);
  }

  updateCartUI();
  closeCustomizeModal();
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
      const btn = e.target;
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price)
      };
      openCustomizeModal(item);
    });
  });
});


//Simulate Order Placement & Save to localStorage
function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

  const order = {
    id: Date.now(),
    items: cart,
    status: "Preparing",
    total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    timestamp: new Date().toLocaleString()
  };

  existingOrders.push(order);
  localStorage.setItem('orders', JSON.stringify(existingOrders));

  alert("Order placed successfully!");
  cart = [];
  updateCartUI();
  toggleCart();
}



//JavaScript Logic for Filter
document.getElementById('search-bar').addEventListener('input', filterMenu);
document.getElementById('filter-type').addEventListener('change', filterMenu);

function filterMenu() {
  const search = document.getElementById('search-bar').value.toLowerCase();
  const type = document.getElementById('filter-type').value;
  const items = document.querySelectorAll('.menu-card');

  items.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const itemType = card.dataset.type;

    const matchesSearch = name.includes(search);
    const matchesType = (type === 'all') || (itemType === type);

    card.style.display = (matchesSearch && matchesType) ? 'block' : 'none';
  });
}


