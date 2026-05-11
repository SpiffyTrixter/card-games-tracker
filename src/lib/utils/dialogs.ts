import { mount, unmount } from 'svelte';

import ConfirmDialog from '$lib/components/shared/ConfirmDialog.svelte';

export const confirmDialog = async (options: {
	title?: string;
	text: string;
	icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
	confirmButtonText?: string;
	cancelButtonText?: string;
}): Promise<boolean> => {
	return new Promise((resolve) => {
		const target = document.body;

		const destroy = () => {
			if (component) unmount(component);
		};

		const component = mount(ConfirmDialog, {
			target,
			props: {
				isOpen: true,
				title: options.title || 'Are you sure?',
				text: options.text,
				confirmButtonText: options.confirmButtonText || 'Confirm',
				cancelButtonText: options.cancelButtonText || 'Cancel',
				onConfirm: () => resolve(true),
				onCancel: () => resolve(false),
				destroy
			}
		});
	});
};
