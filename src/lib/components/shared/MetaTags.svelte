<script lang="ts">
	import { page } from '$app/state';

	let {
		title = 'Card Games Tracker',
		description = 'Track your card games, scores, and history effortlessly.',
		image = '/favicon.svg'
	} = $props();

	// In Svelte 5, page state is accessed via `$app/state` or `$app/stores`
	// but mostly `$app/state` is used now: `page.url.href`
	let url = $derived(page.url.href);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
