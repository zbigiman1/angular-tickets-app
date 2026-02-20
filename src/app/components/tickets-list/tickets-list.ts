import { ErrorMessage } from '@/app/components/error-message/error-message';
import { Loader } from '@/app/components/loader/loader';
import { TicketsStore } from '@/app/stores/tickets.store';
import { Status, Ticket } from '@/app/types';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tickets-list',
  imports: [CommonModule, TranslateModule, Loader, ErrorMessage],
  templateUrl: './tickets-list.html',
  styleUrl: './tickets-list.scss',
})
export class TicketsList implements OnInit {
  private router = inject(Router);
  store = inject(TicketsStore);
  filteredTickets = signal<Ticket[]>([]);
  filter = signal<Status | 'all'>('all');

  handleFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;
    this.filter.set(status as Status | 'all');
    this.filteredTickets.set(this.store.filterTicketsByStatus(status as any));
  }

  handleRowClick(ticketId: string) {
    this.router.navigate(['/ticket', ticketId]);
  }

  async ngOnInit(): Promise<void> {
    await this.store.loadTickets();
    this.filteredTickets.set(this.store.tickets());
  }
}
