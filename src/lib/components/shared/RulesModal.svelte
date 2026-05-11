<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { isOpen = $bindable(false), title, rules: RulesComponent } = $props();

	function close() {
		isOpen = false;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content
		class="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden p-0 sm:max-w-[90vw] md:max-w-4xl"
	>
		<Dialog.Header class="border-b border-border bg-muted/30 px-6 py-4">
			<Dialog.Title
				class="text-headline-sm font-display-md flex items-center gap-2 text-primary md:text-headline-lg"
			>
				<span class="material-symbols-outlined text-[24px]">description</span>
				{title} Rules
			</Dialog.Title>
		</Dialog.Header>

		<div class="grow overflow-y-auto px-6 py-4 md:px-10 md:py-8">
			<article
				class="prose-primary prose-headings:font-display-md prose-headings:text-primary-light prose
				prose-sm max-w-none
				prose-invert md:prose-base
				prose-p:text-foreground prose-strong:text-primary
				prose-li:text-foreground prose-table:border
				prose-table:border-border/20 prose-th:bg-muted prose-th:p-2
				prose-th:text-primary prose-td:border-t prose-td:border-border/10
				prose-td:p-2 prose-hr:border-border/30"
			>
				{#if RulesComponent}
					<RulesComponent />
				{:else}
					<p class="text-muted-foreground italic">No rules available for this game yet.</p>
				{/if}
			</article>
		</div>

		<Dialog.Footer class="border-t border-border bg-muted/30 px-6 py-4">
			<Button onclick={close} size="lg" class="font-label-lg w-full md:w-auto">Got it</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
