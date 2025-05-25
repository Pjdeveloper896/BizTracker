<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Initialize the mobile sidenav
    const elems = document.querySelectorAll('.sidenav');
    if (window.M) {
      window.M.Sidenav.init(elems);
    } else {
      console.warn('Materialize JS not loaded');
    }
  });
</script>

<!-- Materialize CSS + Icons -->
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
  rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<nav>
  <div class="nav-wrapper container">
    <a href="/" class="brand-logo">BizTrack</a>
    <a href="#" data-target="mobile-demo" class="sidenav-trigger">
      <i class="material-icons">menu</i>
    </a>
    <ul class="right hide-on-med-and-down">
      <li><a href="/stock">Stocks</a></li>
      <li><a href="/map">Shop Map</a></li>
      <li><a href="/about">about us</a></li>
      <li><a href="/">go to home</a></li>
    </ul>
  </div>
</nav>

<ul class="sidenav" id="mobile-demo">
  <li><a href="/stock">Stocks</a></li>
  <li><a href="/map">Shop Map</a></li>
  <li><a href="/about">about us</a></li>
  <li><a href="/">go to home</a></li>
</ul>

<slot />

<style>
  a {
    transition: color 0.3s ease;
  }
  a:active {
    color: orange;
  }
</style>
