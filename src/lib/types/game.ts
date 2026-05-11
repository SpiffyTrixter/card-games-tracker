export interface Players {
	min: number;
	max: number;
}

export interface EquipmentItem {
	name: string;
	count?: number;
	description?: string;
}

export interface GameProps {
	deck?: EquipmentItem;
	dice?: EquipmentItem;
	board?: EquipmentItem;
	extras?: EquipmentItem[];
}

export interface Game {
	title: string;
	description: string;
	category: string;
	players: Players;
	icon?: string;
	props?: GameProps;
	rules?: string;
}