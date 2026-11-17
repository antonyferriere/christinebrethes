// Surface only: navigation is hidden only after its controller is ready.
document.documentElement.classList.toggle('header-scrolled', window.scrollY > 16);
