<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>Home | BizTrack</title>
	<meta name="description" content="BizTrack - Your smart business companion." />
</svelte:head>

<section>
	<div class="welcome-wrapper" transition:fade>
		<picture>
			<source srcset={welcome} type="image/webp" />
			<img src={welcomeFallback} alt="Welcome" />
		</picture>
	</div>

	<h1 transition:fly={{ y: 20, duration: 500 }}>
		Welcome to <span class="brand">BizTrack</span>
	</h1>

	<h2 transition:fly={{ y: 30, delay: 200 }}>
		Manage your <strong>stocks</strong> & <strong>shop maps</strong> with ease
	</h2>
  <div class="card">
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
    </div>
    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">BizTrack<i class="material-icons right">more_vert</i></span>
      <p><a href="/stock">get started </a></p>
    </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">BizTrack<i class="material-icons right">close</i></span>
      <p>In this app you create acounts with live profit and loss . with this app you can give boom to your business . WE pray to god that Your business became no1 in the world </p>
    </div>
  </div>
	<Counter />

	<a href="/stock" class="btn-large waves-effect waves-light amber darken-2" style="margin-top: 2rem;" transition:fade>
		Get Started
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
</style>
