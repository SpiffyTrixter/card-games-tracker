<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	// Expose `children` so the trigger can render custom content (icon/label)
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: DropdownMenuPrimitive.TriggerProps & { children?: import('svelte').Snippet } = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Trigger>
