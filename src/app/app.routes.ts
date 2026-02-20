import { TicketDetails } from '@/app/components/ticket-details/ticket-details';
import { TicketsList } from '@/app/components/tickets-list/tickets-list';
import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', component: TicketsList },
	{ path: 'ticket/:id', component: TicketDetails },
];
