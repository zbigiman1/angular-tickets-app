import { ErrorMessage } from '@/app/components/error-message/error-message';
import { Loader } from '@/app/components/loader/loader';
import { DateService } from '@/app/services/date.service';
import { TicketsStore } from '@/app/stores/tickets.store';
import { Status } from '@/app/types/Ticket';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, TranslateModule, Loader, ErrorMessage, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
  private route = inject(ActivatedRoute);
  id: string | null = null;
  store = inject(TicketsStore);
  status = signal<Status | null>(null);

  constructor(private dateService: DateService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
  }

  formatDate(dateString: string | undefined): string {
    return this.dateService.format(dateString);
  }

  handleStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as Status;
    this.status.set(newStatus);
  }

  async handleUpdateTicketStatus() {
    const newStatus = this.status();
    if (!newStatus || !this.id || this.store.currentTicket()?.status === newStatus) return;
    await this.store.updateTicketStatus(this.id as string, newStatus);
    this.status.set(newStatus);
  }

  async ngOnInit(): Promise<void> {
    await this.store.getTicketById(this.id!);
    this.status.set(this.store.currentTicket()?.status || null);
  }
}
