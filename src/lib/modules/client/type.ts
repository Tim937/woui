export interface ClientCardData {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	address: string | null;
	notes: string | null;
	createdAt: Date;
	trips?: {
		id: string;
		reference: string;
		destination: string;
		status: 'active' | 'completed' | 'cancelled';
	}[];
	unreadChats?: number;
}
