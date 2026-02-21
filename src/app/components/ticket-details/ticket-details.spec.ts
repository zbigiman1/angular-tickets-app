import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageService } from '@/app/services/language.service';
import { TicketsStore } from '@/app/stores/tickets.store';
import { TicketDetails } from './ticket-details';

class MockTicketsStore {
  private _ticket = { id: '1', customerName: 'C1', subject: 'S1', description: 'D1', priority: 'low', status: 'new', createdAt: new Date().toISOString() } as any;
  tickets() { return [this._ticket]; }
  async getTicketById(id: string) { /* noop */ }
  currentTicket() { return this._ticket; }
  loading() { return false; }
  error() { return null; }
  async updateTicketStatus(id: string, status: string) { this._ticket.status = status; }
}

class MockLanguageService {
  private lang = 'en';
  getCurrentLang() { return this.lang; }
  currentLangChanges() { return { subscribe: (fn: any) => ({ unsubscribe() { } }) } as any; }
}

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;
  let mockStore: MockTicketsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetails, TranslateModule.forRoot()],
      providers: [provideHttpClientTesting(), provideRouter([] as any), { provide: TicketsStore, useClass: MockTicketsStore }, { provide: LanguageService, useClass: MockLanguageService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TicketDetails);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(TicketsStore) as unknown as MockTicketsStore;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets status on init from store.currentTicket', async () => {
    await component.ngOnInit();
    expect(component.status()).toBe('new');
  });

  it('formatDate uses en-US for en locale', () => {
    const formatted = component.formatDate('2020-01-01T12:00:00Z');
    expect(formatted).toContain('2020');
  });

  it('handleStatusChange updates status signal', () => {
    const ev = { target: { value: 'closed' } } as unknown as Event;
    component.handleStatusChange(ev);
    expect(component.status()).toBe('closed');
  });

  it('handleUpdateTicketStatus calls store.updateTicketStatus when appropriate', async () => {
    component.id = '1';
    (component as any).status.set('closed');
    const calls: any[] = [];
    (mockStore as any).updateTicketStatus = (id: string, status: string) => { calls.push([id, status]); return Promise.resolve(); };
    await component.handleUpdateTicketStatus();
    expect(calls).toEqual([['1', 'closed']]);
  });
});
