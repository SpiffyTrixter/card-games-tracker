<script lang="ts">
	import LibraryGrid from '$components/home/LibraryGrid.svelte';
	import Footer from '$components/shared/Footer.svelte';
	import Header from '$components/shared/Header.svelte';
</script>

<Header />

<!-- Main Content Canvas -->
<main
	class="mx-auto flex w-full max-w-max-width grow flex-col gap-8 px-margin-mobile py-8 md:gap-16 md:px-margin-desktop md:py-12"
>
	<LibraryGrid />
</main>

<Footer />
