import { getTicketById as apiGetTickedById, getTickets as apiGetTickets, updateTicketStatus as apiUpdateTicketStatus } from '@/app/api';
import type { Status, Ticket } from '@/app/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface TicketsState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    loading: boolean;
    error: string | null;
}

export const TicketsStore = signalStore({ providedIn: 'root' },
    withState<TicketsState>({
        tickets: [],
        currentTicket: null,
        loading: false,
        error: null,
    }),
    withMethods((store) => ({
        async loadTickets() {
            patchState(store, { loading: true, error: null });
            try {
                const tickets = await apiGetTickets();
                patchState(store, { tickets });
            } catch (error) {
                patchState(store, { error: 'Failed to load tickets' });
            } finally {
                patchState(store, { loading: false });
            }
        },
        async getTicketById(id: string) {
            if (store.currentTicket()?.id === id) return;
            patchState(store, { loading: true, error: null, currentTicket: null });
            try {
                const ticket = await apiGetTickedById(id);
                patchState(store, { currentTicket: ticket });
            } catch (error) {
                patchState(store, { error: 'Failed to load ticket details' });
            } finally {
                patchState(store, { loading: false });
            }
        },
        async updateTicketStatus(id: string, status: Status) {
            patchState(store, { loading: true, error: null });
            try {
                const updatedTicket = await apiUpdateTicketStatus(id, status);
                if (updatedTicket) {
                    patchState(store, { tickets: store.tickets().map(t => t.id === id ? updatedTicket : t), currentTicket: updatedTicket });
                }
                } catch (error) {
                patchState(store, { error: 'Failed to update ticket status' });
                } finally {
                patchState(store, { loading: false });
            }
        },
        filterTicketsByStatus(status: Status | 'all') {
            if (status === 'all') {
                return store.tickets();
            }
            return store.tickets().filter(ticket => ticket.status === status);
        }
    }))
);
