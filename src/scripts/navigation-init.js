// Runs before the body is painted: do not wait for the module dependency graph.
document.documentElement.classList.add('js');
document.documentElement.classList.toggle('header-scrolled', window.scrollY > 16);
