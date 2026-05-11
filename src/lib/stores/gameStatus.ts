import { writable } from 'svelte/store';

export const isGameInProgress = writable(false);

export interface HeaderAction {
	icon: string;
	label: string;
	onclick: () => void;
}

export interface HeaderState {
	title?: string;
	actions?: HeaderAction[];
	showSearch?: boolean;
}

export const headerState = writable<HeaderState>({
	showSearch: true
});
