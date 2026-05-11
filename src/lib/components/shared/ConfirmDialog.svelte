<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let {
		isOpen = $bindable(true),
		title = 'Are you sure?',
		text,
		confirmButtonText = 'Confirm',
		cancelButtonText = 'Cancel',
		onConfirm,
		onCancel,
		destroy
	} = $props<{
		isOpen?: boolean;
		title?: string;
		text: string;
		confirmButtonText?: string;
		cancelButtonText?: string;
		onConfirm: () => void;
		onCancel: () => void;
		destroy: () => void;
	}>();

	function handleOpenChange(open: boolean) {
		if (!open) {
			onCancel();
			setTimeout(() => destroy(), 300); // Wait for animation before destroying
		}
	}

	function handleConfirm() {
		isOpen = false;
		onConfirm();
		setTimeout(() => destroy(), 300);
	}

	function handleCancel() {
		isOpen = false;
		onCancel();
		setTimeout(() => destroy(), 300);
	}
</script>

<AlertDialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
	<AlertDialog.Content class="border-border bg-card">
		<AlertDialog.Header>
			<AlertDialog.Title class="text-foreground">{title}</AlertDialog.Title>
			<AlertDialog.Description class="text-muted-foreground">
				{text}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel} class="text-foreground hover:bg-muted"
				>{cancelButtonText}</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={handleConfirm}
				class="bg-primary text-primary-foreground hover:bg-primary/90"
				>{confirmButtonText}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
