<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { fade, fly } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const lang = writable<'en' | 'hi'>('en');

	const translations = {
		en: {
			title: 'Welcome to BizKhaata',
			subtitle: 'Track your stock, manage inventory, and view shop insights — all in one place.',
			tagline: 'Track Your Biz. The Indian Way.',
			why: 'Why BizKhaata?',
			whyDesc: 'Manage products, monitor stock performance, and grow your business — smarter and faster.',
			start: '🚀 Start Managing Your Stock',
			startLink: 'Start Tracking →',
		},
		hi: {
			title: 'बिज़खाता में आपका स्वागत है',
			subtitle: 'अपने स्टॉक को ट्रैक करें, इन्वेंट्री प्रबंधित करें और शॉप की जानकारी एक ही स्थान पर देखें।',
			tagline: 'ट्रैक करें अपना बिज़नेस, भारतीय अंदाज़ में।',
			why: 'क्यों चुनें बिज़खाता?',
			whyDesc: 'उत्पादों को प्रबंधित करें, स्टॉक प्रदर्शन की निगरानी करें और अपने व्यवसाय को स्मार्ट और तेज़ बनाएं।',
			start: '🚀 अपना स्टॉक प्रबंधित करना शुरू करें',
			startLink: 'ट्रैकिंग शुरू करें →',
		}
	};

	onMount(() => {
		const storedLang = localStorage.getItem('lang');
		if (storedLang === 'hi' || storedLang === 'en') {
			lang.set(storedLang);
		} else {
			const browserLang = navigator.language.startsWith('hi') ? 'hi' : 'en';
			lang.set(browserLang);
			localStorage.setItem('lang', browserLang);
		}
	});

	lang.subscribe(value => localStorage.setItem('lang', value));
</script>

<svelte:head>
	<title>Home | BizKhaata</title>
	<meta name="description" content="BizKhaata - Track Your Biz. The Indian Way." />
</svelte:head>

<section class="hero-section">
	<div class="lang-toggle">
		<button on:click={() => lang.set('en')}>English</button>
		<button on:click={() => lang.set('hi')}>हिन्दी</button>
	</div>

	<div class="welcome-wrapper" transition:fade>
		<picture>
			<source srcset={welcome} type="image/webp" />
			<img src={welcomeFallback} alt="Welcome to BizKhaata" />
		</picture>
	</div>

	{#await lang}
		<p>Loading...</p>
	{:then $lang}
		<h1 class="hero-title" transition:fly={{ y: 20, duration: 500 }}>
			{translations[$lang].title}
		</h1>

		<p class="tagline">✨ {translations[$lang].tagline}</p>

		<p class="hero-subtitle" transition:fly={{ y: 30, delay: 200 }}>
			{translations[$lang].subtitle}
		</p>

		<div class="card material-card">
			<div class="card-image">
				<img
					src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
					alt="BizKhaata Inventory Visual"
				/>
			</div>
			<div class="card-content">
				<h3>{translations[$lang].why}</h3>
				<p>{translations[$lang].whyDesc}</p>
				<a href="/stock" class="btn-link">{translations[$lang].startLink}</a>
			</div>
		</div>

		<Counter />

		<a
			href="/stock"
			class="btn-cta"
			style="margin-top: 2rem;"
			transition:fade
		>
			{translations[$lang].start}
		</a>
	{/await}
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

	.lang-toggle {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.lang-toggle button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 8px;
		background-color: #fb8c00;
		color: white;
		cursor: pointer;
		font-weight: bold;
	}

	.lang-toggle button:hover {
		background-color: #ef6c00;
	}

	@media (max-width: 480px) {
		.lang-toggle {
			flex-direction: column;
			width: 100%;
			align-items: center;
		}
		.lang-toggle button {
			width: 90%;
		}
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

	.tagline {
		font-size: 1.1rem;
		color: #fb8c00;
		font-weight: 600;
		margin-top: 0.5rem;
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
