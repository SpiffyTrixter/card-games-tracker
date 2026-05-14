<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { unwrap } from '$lib/utils/i18n';

	let { isOpen = $bindable(false), title, rules } = $props();

	const unwrappedTitle = $derived(unwrap(title));
	const currentLocale = $derived(getLocale());

	const RulesComponent = $derived.by(() => {
		if (!rules) return null;

		if (typeof rules === 'string' || typeof rules === 'function') {
			return rules;
		}

		return rules[currentLocale] || rules['en'] || Object.values(rules)[0] || null;
	});

	function close() {
		isOpen = false;
	}
</script>

<Dialog bind:open={isOpen}>
	<DialogContent
		class="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden p-0 sm:max-w-[90vw] md:max-w-4xl"
	>
		<DialogHeader class="border-b border-border bg-muted/30 px-6 py-4">
			<DialogTitle
				class="text-headline-sm font-display-md flex items-center gap-2 text-primary md:text-headline-lg"
			>
				<span class="material-symbols-outlined text-[24px]">description</span>
				{m.rules_title({ title: unwrappedTitle })}
			</DialogTitle>
		</DialogHeader>

		<div class="grow overflow-y-auto px-6 py-4 md:px-10 md:py-8">
			<article
				class="prose-primary prose-headings:font-display-md prose prose-sm
				max-w-none prose-invert
				md:prose-base prose-headings:text-primary
				prose-p:text-foreground prose-strong:text-primary
				prose-li:text-foreground prose-table:border
				prose-table:border-border/20 prose-th:bg-muted prose-th:p-2
				prose-th:text-primary prose-td:border-t prose-td:border-border/10
				prose-td:p-2 prose-hr:border-border/30"
			>
				{#if RulesComponent}
					{#if typeof RulesComponent === 'string'}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html RulesComponent}
					{:else}
						<RulesComponent />
					{/if}
				{:else}
					<p class="text-muted-foreground italic">{m.no_rules_available()}</p>
				{/if}
			</article>
		</div>

		<DialogFooter class="border-t border-border bg-muted/30 px-6 py-4">
			<Button onclick={close} size="lg" class="font-label-lg w-full md:w-auto">{m.got_it()}</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
