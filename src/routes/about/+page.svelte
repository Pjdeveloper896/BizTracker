<script lang="ts">
	import { fade } from 'svelte/transition';

	const sections = [
		`This is a <a href="#">BizTrack</a> powered app to manage your business operations.`,
		`This page is static and lightweight, meaning no JavaScript is required for basic viewing.`,
		`The <a href="/stock">Stocks</a> section is dynamic and supports live interaction.`,
		`Explore the <a href="/map">Shop Map</a> feature to visualize your physical inventory locations.`
	];
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="about-container">
	<h1>
		<span transition:fade={{ duration: 500 }}>About BizTrack</span>
	</h1>

	{#each sections as section, i}
		<div class="about-section">
			<p transition:fade={{ duration: 500, delay: i * 200 }}>
				{@html section}
			</p>
		</div>
	{/each}
</div>

<style>
	.about-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 1rem;
	}
	h1 {
		text-align: center;
		color: #2e3c48;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}
	.about-section {
		background: #f8f9fa;
		padding: 1.2rem;
		margin-bottom: 1rem;
		border-left: 5px solid #26a69a;
		border-radius: 8px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
	}
	p a {
		color: #26a69a;
		text-decoration: underline;
	}
</style>
