<script lang="ts">
	let { isOpen = $bindable(false), title, rules: RulesComponent } = $props();

	function close() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
			onclick={close}
		></div>

		<!-- Modal Content -->
		<div
			class="animate-in fade-in zoom-in relative flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-outline bg-surface shadow-2xl duration-200 md:max-h-[90vh]"
		>
			<!-- Header -->
			<div
				class="flex items-center justify-between border-b border-outline bg-surface-container/30 p-4 md:p-6"
			>
				<div class="flex items-center gap-2 md:gap-3">
					<span class="material-symbols-outlined text-[20px] text-primary md:text-[24px]"
						>description</span
					>
					<h3
						class="font-display-sm text-headline-sm text-primary md:font-display-md md:text-headline-lg"
					>
						{title} Rules
					</h3>
				</div>
				<button
					onclick={close}
					class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant md:h-10 md:w-10"
					aria-label="Close"
				>
					<span class="material-symbols-outlined text-[20px] md:text-[24px]">close</span>
				</button>
			</div>

			<!-- Body -->
			<div class="grow overflow-y-auto p-4 md:p-10">
				<article
					class="prose-primary prose prose-sm max-w-none
					prose-invert md:prose-base
					prose-headings:font-display-md prose-headings:text-primary-light
					prose-p:text-on-surface prose-strong:text-primary
					prose-li:text-on-surface prose-table:border
					prose-table:border-outline/20 prose-th:bg-surface-container prose-th:p-2
					prose-th:text-primary prose-td:border-t prose-td:border-outline/10
					prose-td:p-2 prose-hr:border-outline/30"
				>
					{#if RulesComponent}
						<RulesComponent />
					{:else}
						<p class="text-on-surface-variant italic">No rules available for this game yet.</p>
					{/if}
				</article>
			</div>

			<!-- Footer -->
			<div class="flex justify-end border-t border-outline bg-surface-container/30 p-4 md:p-6">
				<button
					onclick={close}
					class="font-label-md w-full rounded-DEFAULT bg-primary px-8 py-3 text-sm text-surface transition-all duration-300 hover:bg-primary-light md:w-auto md:py-3 md:font-label-lg md:text-label-lg"
				>
					Got it
				</button>
			</div>
		</div>
	</div>
{/if}
