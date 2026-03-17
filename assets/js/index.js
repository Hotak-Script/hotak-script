// ===============================
// --- Page Load after 0.35 Second ---
// ===============================
const links = document.querySelectorAll("a");

links.forEach(link => {
  link.addEventListener("click", function(e){
    const url = this.getAttribute("href"); 
    if(url && url !== "#"){  
      e.preventDefault(); 
      setTimeout(() => {
        window.location.href = url; 
      }, 350); // 800ms = 0.35 second
    }
  });
});

 
// ===============================
// --- Navigation Indicator ---
// ===============================
const list = document.querySelectorAll(".navigation li");
const indicator = document.querySelector(".indicator");

function moveIndicator(el){
  const rect = el.getBoundingClientRect();
  const parent = el.parentElement.getBoundingClientRect();

  if(window.innerWidth > 1000){
    // Desktop
    indicator.style.left = (rect.left - parent.left + rect.width/2 - indicator.offsetWidth/2) + "px";
    indicator.style.top = "-20px";
    indicator.style.width = "60px";
    indicator.style.height = "60px";
  } else {
    // Mobile
    indicator.style.top = (el.offsetTop + el.offsetHeight/2 - indicator.offsetHeight/2) + "px";
    indicator.style.left = "18px";
    indicator.style.width = "50px";
    indicator.style.height = "50px";
  }
}

// set indicator on active
// document.addEventListener("DOMContentLoaded", () => {
const active = document.querySelector(".navigation li.active");
  if(active) moveIndicator(active);
// });

// Window resize: adjust
window.addEventListener("resize", () => {
  const active = document.querySelector(".navigation li.active");
  if(active) moveIndicator(active);
});

// Icon click
list.forEach(item => {
  item.addEventListener("click", function(){
    list.forEach(i => i.classList.remove("active"));
    this.classList.add("active");
    moveIndicator(this);
  });
});


// ===============================
// --- Hamburger Toggle ---
// ===============================
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".navigation");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("show");
});


// ===============================
// --- Typewriter ---
// ===============================
const typeWriterText = ["Learn HTML & CSS", "Master JavaScript", "Build Real Projects", "Become a Pro Developer"];
let typeIndex = 0, charIndex = 0;
const typeWriterElement = document.querySelector(".typeWriter");

function type() {
  if(charIndex < typeWriterText[typeIndex].length){
    typeWriterElement.textContent += typeWriterText[typeIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 50);
  } else { setTimeout(erase,1500); }
}

function erase() {
  if(charIndex > 0){
    typeWriterElement.textContent = typeWriterText[typeIndex].substring(0,charIndex-1);
    charIndex--;
    setTimeout(erase,30);
  } else {
    typeIndex = (typeIndex+1) % typeWriterText.length;
    setTimeout(type,500);
  }
}

document.addEventListener("DOMContentLoaded", () => { setTimeout(type,1000); });

// ===============================
// --- Section Image Tilt Effect ---
// ===============================
const sections = document.querySelectorAll(".section img");

sections.forEach(img => {
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    img.style.transform = `scale(1.05) rotateX(${-(y-rect.height/2)/20}deg) rotateY(${(x-rect.width/2)/20}deg)`;
  });
  img.addEventListener("mouseleave", e => {
    img.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
  });
});

