<script lang="ts">
	import { fade } from 'svelte/transition';

	const sections = [
		`<strong>BizTrack</strong> is a comprehensive business management platform designed to streamline operations, improve efficiency, and provide real-time insights.`,
		`This application is crafted with a lightweight architecture — ensuring fast load times and optimal performance without sacrificing functionality.`,
		`Our <a href="/stock">Inventory Management</a> module offers live updates, product tracking, and seamless stock control at your fingertips.`,
		`With the <a href="/map">Store Location Map</a>, you can easily visualize and manage the geographical distribution of your assets and outlets.`
	];
</script>

<svelte:head>
	<title>About BizTrack</title>
	<meta name="description" content="Learn more about BizTrack, a powerful platform for managing your business operations efficiently." />
</svelte:head>

<div class="about-container">
	<h1 transition:fade={{ duration: 500 }}>About BizTrack</h1>

	{#each sections as section, i}
		<div class="about-section" transition:fade={{ duration: 500, delay: i * 150 }}>
			<p>{@html section}</p>
		</div>
	{/each}
</div>

<style>
	.about-container {
		max-width: 900px;
		margin: 3rem auto;
		padding: 2rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		color: #2c3e50;
	}

	h1 {
		text-align: center;
		color: #1a252f;
		font-size: 2.8rem;
		margin-bottom: 2.5rem;
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	.about-section {
		background: #ffffff;
		padding: 1.5rem 1.8rem;
		margin-bottom: 1.5rem;
		border-left: 5px solid #26a69a;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.about-section:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
	}

	p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0;
	}

	p a {
		color: #26a69a;
		font-weight: 500;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	p a:hover {
		border-color: #26a69a;
	}
</style>
