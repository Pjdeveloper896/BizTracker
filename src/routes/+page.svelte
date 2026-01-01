<script lang="ts">
	let lang = 'en';

	// Check if we're in the browser before using localStorage
	if (typeof window !== 'undefined') {
		const savedLang = localStorage.getItem('lang');
		if (savedLang) lang = savedLang;
	}

	const translations = {
		en: {
			tagline: "Track Your Biz. The Indian Way.",
			title: "Welcome to BizKhaata",
			subtitle: "Track your stock, manage inventory, and view shop insights — all in one place.",
			why: "Why BizKhaata?",
			whyDesc: "Manage products, monitor stock performance, and grow your business — smarter and faster.",
			start: "🚀 Start Managing Your Stock",
			startLink: "Start Tracking →"
		},
		hi: {
			tagline: "अपने बिज़नेस को ट्रैक करें, भारतीय अंदाज़ में।",
			title: "बिज़खाता में आपका स्वागत है",
			subtitle: "अपने स्टॉक को ट्रैक करें, इन्वेंट्री प्रबंधित करें और शॉप की जानकारी एक ही स्थान पर देखें।",
			why: "क्यों चुनें बिज़खाता?",
			whyDesc: "उत्पाद प्रबंधित करें, स्टॉक प्रदर्शन देखें, और स्मार्ट तरीके से अपना व्यवसाय बढ़ाएं।",
			start: "🚀 स्टॉक प्रबंधन शुरू करें",
			startLink: "ट्रैकिंग शुरू करें →"
		}
	};

	function switchLang() {
		lang = lang === 'en' ? 'hi' : 'en';
		if (typeof window !== 'undefined') {
			localStorage.setItem('lang', lang);
		}
	}
</script>

<style>
	body {
		margin: 0;
		font-family: system-ui, sans-serif;
		background-color: #0f172a;
		color: white;
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #facc15;
	}

	p {
		max-width: 600px;
		font-size: 1.1rem;
		margin-bottom: 2rem;
	}

	button {
		background-color: #22c55e;
		color: black;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.3s;
		margin: 0.5rem;
	}

	button:hover {
		background-color: #16a34a;
	}

	.lang-toggle {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background-color: #334155;
		color: white;
		padding: 0.4rem 0.8rem;
		font-size: 0.9rem;
		border: none;
		border-radius: 0.3rem;
		cursor: pointer;
	}
</style>

<main>
	<button class="lang-toggle" on:click={switchLang}>
		{lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
	</button>

	<h2>{translations[lang].tagline}</h2>
	<h1>{translations[lang].title}</h1>
	<p>{translations[lang].subtitle}</p>

	<h2>{translations[lang].why}</h2>
	<p>{translations[lang].whyDesc}</p>

	<a href="https://biz-tracker-vert.vercel.app/">
		<button>{translations[lang].start}</button>
	</a>
	<a href="/stock">Get Started </a>
</main>
