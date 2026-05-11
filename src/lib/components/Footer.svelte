<script lang="ts">
	import { base } from '$app/paths';
</script>

<footer
	class="mt-auto border-t border-outline bg-surface-dim dark:border-outline dark:bg-surface-dim"
>
	<div
		class="mx-auto flex w-full max-w-max-width flex-col items-center justify-between gap-6 px-margin-mobile py-8 md:flex-row md:gap-8 md:px-margin-desktop md:py-12"
	>
		<div class="text-headline-sm font-display-md text-on-surface-variant md:text-headline-lg">
			Games
		</div>
		<div
			class="text-body-sm order-last font-body-md text-on-surface-variant italic md:order-none md:text-body-md"
		>
			© 2026 Cimma
		</div>
		<nav class="flex flex-wrap justify-center gap-4 md:gap-6">
			<a
				class="rounded-DEFAULT font-label-sm text-[11px] text-on-surface-variant transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none md:text-label-sm"
				href="{base}/">House Rules</a
			>
			<a
				class="rounded-DEFAULT font-label-sm text-[11px] text-on-surface-variant transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none md:text-label-sm"
				href="{base}/">Privacy Policy</a
			>
			<a
				class="rounded-DEFAULT font-label-sm text-[11px] text-on-surface-variant transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none md:text-label-sm"
				href="{base}/">Terms</a
			>
		</nav>
	</div>
</footer>
