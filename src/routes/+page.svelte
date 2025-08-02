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

<section>
	<div class="welcome-wrapper" transition:fade>
		<picture>
			<source srcset={welcome} type="image/webp" />
			<img src={welcomeFallback} alt="Welcome to BizTrack" />
		</picture>
	</div>

	<h1 transition:fly={{ y: 20, duration: 500 }}>
		Welcome to <span class="brand">BizTrack</span>
	</h1>

	<h2 transition:fly={{ y: 30, delay: 200 }}>
		Track your <strong>stock</strong>, manage <strong>inventory</strong>, and view <strong>shop maps</strong> with ease.
	</h2>

	<div class="card">
		<div class="card-image waves-effect waves-block waves-light">
			<img
				class="activator"
				src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
				alt="BizTrack Inventory Visual"
			/>
		</div>
		<div class="card-content">
			<span class="card-title activator grey-text text-darken-4">
				BizTrack
				<i class="material-icons right">more_vert</i>
			</span>
			<p><a href="/stock">Get started with stock tracking</a></p>
		</div>
		<div class="card-reveal">
			<span class="card-title grey-text text-darken-4">
				BizTrack
				<i class="material-icons right">close</i>
			</span>
			<p>
				With BizTrack, you can manage your products, monitor live stock profit/loss, and
				boost your business operations — all in one app. We hope your business becomes the #1
				in the world!
			</p>
		</div>
	</div>

	<Counter />

	<a
		href="/stock"
		class="btn-large waves-effect waves-light amber darken-2"
		style="margin-top: 2rem;"
		transition:fade
	>
		🚀 Start Managing Your Stock
	</a>
</section>

<style>
	section {
		min-height: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 2rem;
		background: linear-gradient(to right, #f8f9fa, #e0f7fa);
	}

	h1 {
		font-size: 2.8rem;
		margin-top: 1rem;
		color: #2e3c48;
	}

	.brand {
		color: #ff6f00;
		font-weight: bold;
	}

	h2 {
		font-size: 1.5rem;
		color: #546e7a;
		margin-top: 1rem;
	}

	.welcome-wrapper {
		width: 80%;
		max-width: 600px;
		padding-top: 1rem;
	}

	.welcome-wrapper img {
		width: 100%;
		border-radius: 20px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.card {
		margin-top: 2rem;
		max-width: 500px;
	}

	.card img {
		border-radius: 10px;
	}
</style>
