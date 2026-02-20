import { ErrorMessage } from '@/app/components/error-message/error-message';
import { Loader } from '@/app/components/loader/loader';
import { LanguageService } from '@/app/services/language.service';
import { TicketsStore } from '@/app/stores/tickets.store';
import { Status } from '@/app/types/Ticket';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, TranslateModule, Loader, ErrorMessage, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  id: string | null = null;
  currentLang = 'en';
  private langSub?: Subscription;
  store = inject(TicketsStore);
  status = signal<Status | null>(null);

  constructor(@Inject(LanguageService) private languageService: LanguageService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.currentLang = this.languageService.getCurrentLang() || 'en';
    this.langSub = this.languageService.currentLangChanges().subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  formatDate(dateString: string | undefined): string {
    const locale = this.currentLang
    let dateFormat = 'pl-PL'
    if (locale === 'en') {
      dateFormat = 'en-US'
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString as string).toLocaleDateString(dateFormat, options)
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
