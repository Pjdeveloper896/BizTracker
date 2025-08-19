<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const elems = document.querySelectorAll('.sidenav');
		if (window.M) {
			window.M.Sidenav.init(elems);
		} else {
			console.warn('Materialize JS not loaded');
		}
	});
</script>

<!-- Materialize CSS + Google Icons -->
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
	rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<!-- Navbar -->
<nav class="white z-depth-2">
	<div class="nav-wrapper container">
		<a href="/" class="brand-logo black-text">BizKhata</a>
		<a href="#" data-target="mobile-demo" class="sidenav-trigger">
			<i class="material-icons black-text">menu</i>
		</a>
		<ul class="right hide-on-med-and-down">
			<li><a href="/stock" class="black-text">Stocks</a></li>
			<li><a href="/map" class="black-text">Shop Map</a></li>
			<li><a href="/about" class="black-text">About Us</a></li>
			<li><a href="https://invoice-mint.onrender.com/" class="black-text" target="_blank">Invoice Mint</a></li>
			<li><a href="https://bizexpneser.onrender.com/" class="black-text" target="_blank">Expense Classifier</a></li>
			<li><a href="/" class="black-text">Home</a></li>
		</ul>
	</div>
</nav>

<!-- Mobile Nav -->
<ul class="sidenav" id="mobile-demo">
	<li><a href="/stock">Stocks</a></li>
	<li><a href="/map">Shop Map</a></li>
	<li><a href="/about">About Us</a></li>
	<li><a href="https://invoice-mint.onrender.com/" target="_blank">Invoice Mint</a></li>
	<li><a href="https://bizexpneser.onrender.com/" target="_blank">Expense Classifier</a></li>
	<li><a href="/">Home</a></li>
</ul>

<!-- Page content slot -->
<slot />

<style>
	a {
		transition: color 0.3s ease;
	}

	a:hover {
		color: #fb8c00;
	}

	nav {
		padding: 0 1rem;
	}

	.brand-logo {
		font-weight: 700;
		letter-spacing: 0.5px;
	}
</style>
