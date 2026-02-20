export interface cardClientDatas {
	id: string;
	name: string;
	surname: string;
	email: string;
	phone: string | null;
	address: string | null;
	notes: string | null;
	createdAt: Date;
	trips?: {
		id: string;
		reference: string;
		destination: string;
		status: 'in_progress' | 'completed' | 'active' | 'finished' | 'cancelled';
	}[];
	unreadChats?: number;
}

