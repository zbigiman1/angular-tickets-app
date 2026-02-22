import { ErrorMessage } from '@/app/components/error-message/error-message';
import { Loader } from '@/app/components/loader/loader';
import { TicketsStore } from '@/app/stores/tickets.store';
import { Status } from '@/app/types';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  filter = signal<Status | 'all'>('all');

  filteredTickets = computed(() => {
    const status = this.filter();
    if (status === 'all') {
      return this.store.tickets();
    }
    return this.store.filterTicketsByStatus(status);
  });

  handleFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;
    this.filter.set(status as Status | 'all');    
  }

  handleRowClick(ticketId: string) {
    this.router.navigate(['/ticket', ticketId]);
  }

  async ngOnInit(): Promise<void> {
    await this.store.loadTickets();
  }
}
