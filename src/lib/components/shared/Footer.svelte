<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer class="mt-auto border-t border-border bg-muted">
	<div
		class="mx-auto flex w-full max-w-max-width flex-col items-center justify-between gap-6 px-margin-mobile py-8 md:flex-row md:gap-8 md:px-margin-desktop md:py-12"
	>
		<div class="text-headline-sm font-display-md text-muted-foreground md:text-headline-lg">
			Games
		</div>
		<div
			class="text-body-sm font-body-md order-last text-muted-foreground italic md:order-0 md:text-body-md"
		>
			© 2026 Cimma
		</div>
		<nav class="flex flex-wrap justify-center gap-4 md:gap-6">
			<a
				class="font-label-sm md:text-label-sm rounded-DEFAULT text-[11px] text-muted-foreground transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none"
				href={resolve('/')}>House Rules</a
			>
			<a
				class="font-label-sm md:text-label-sm rounded-DEFAULT text-[11px] text-muted-foreground transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none"
				href={resolve('/')}>Privacy Policy</a
			>
			<a
				class="font-label-sm md:text-label-sm rounded-DEFAULT text-[11px] text-muted-foreground transition-colors hover:text-primary focus:ring-1 focus:ring-primary focus:outline-none"
				href={resolve('/')}>Terms</a
			>
		</nav>
	</div>
</footer>
