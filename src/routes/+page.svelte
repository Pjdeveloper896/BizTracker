<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>Home | BizTrack</title>
	<meta name="description" content="BizTrack - Your smart business companion for inventory and stock management." />
</svelte:head>

<section class="hero-section">
	<div class="welcome-wrapper" transition:fade>
		<picture>
			<source srcset={welcome} type="image/webp" />
			<img src={welcomeFallback} alt="Welcome to BizTrack" />
		</picture>
	</div>

	<h1 class="hero-title" transition:fly={{ y: 20, duration: 500 }}>
		Welcome to <span class="brand">BizTrack</span>
	</h1>

	<p class="hero-subtitle" transition:fly={{ y: 30, delay: 200 }}>
		Track your <strong>stock</strong>, manage <strong>inventory</strong>, and view <strong>shop insights</strong> — all in one place.
	</p>

	<div class="card material-card">
		<div class="card-image">
			<img
				src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
				alt="BizTrack Inventory Visual"
			/>
		</div>
		<div class="card-content">
			<h3>Why BizTrack?</h3>
			<p>
				Manage products, monitor stock performance, and grow your business — smarter and faster.
			</p>
			<a href="/stock" class="btn-link">Start Tracking →</a>
		</div>
	</div>

	<Counter />

	<a
		href="/stock"
		class="btn-cta"
		style="margin-top: 2rem;"
		transition:fade
	>
		🚀 Start Managing Your Stock
	</a>
</section>

<style>
	.hero-section {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 3rem 1.5rem;
		background: linear-gradient(to right, #fefefe, #e0f2f1);
	}

	.welcome-wrapper {
		width: 90%;
		max-width: 600px;
		margin-bottom: 2rem;
	}

	.welcome-wrapper img {
		width: 100%;
		border-radius: 16px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
	}

	.hero-title {
		font-size: 2.6rem;
		font-weight: 700;
		color: #263238;
	}

	.brand {
		color: #fb8c00;
		font-weight: 800;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: #546e7a;
		margin-top: 1rem;
		max-width: 600px;
	}

	.material-card {
		margin-top: 2.5rem;
		max-width: 480px;
		width: 100%;
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		transition: transform 0.3s ease;
	}

	.material-card:hover {
		transform: translateY(-5px);
	}

	.card-image img {
		width: 100%;
		display: block;
	}

	.card-content {
		padding: 1.5rem;
	}

	.card-content h3 {
		margin: 0;
		font-size: 1.4rem;
		color: #333;
	}

	.card-content p {
		margin: 0.75rem 0;
		color: #555;
	}

	.btn-link {
		color: #fb8c00;
		font-weight: 600;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.btn-link:hover {
		color: #ef6c00;
	}

	.btn-cta {
		display: inline-block;
		background-color: #fb8c00;
		color: #fff;
		padding: 0.85rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 50px;
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: background-color 0.3s ease;
	}

	.btn-cta:hover {
		background-color: #ef6c00;
	}
</style>
