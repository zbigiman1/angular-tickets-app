import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { TicketsStore } from '@/app/stores/tickets.store';
import { Ticket } from '@/app/types/Ticket';
import { Router } from '@angular/router';
import { TicketsList } from './tickets-list';

class MockTicketsStore {
  private _tickets: Ticket[] = [
    {
      id: '1',
      customerName: 'C1',
      subject: 'T1',
      description: 'd1',
      priority: 'low',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      customerName: 'C2',
      subject: 'T2',
      description: 'd2',
      priority: 'high',
      status: 'closed',
      createdAt: new Date().toISOString(),
    },
  ];
  tickets() {
    return this._tickets;
  }
  loading() {
    return false;
  }
  error() {
    return null;
  }
  async loadTickets() {
    /* pretend to fetch */
  }
  filterTicketsByStatus(status: string) {
    if (status === 'all') return this._tickets;
    return this._tickets.filter((t) => t.status === status);
  }
  currentTicket() {
    return null;
  }
  async getTicketById() {
    /* noop */
  }
  async updateTicketStatus() {
    /* noop */
  }
}

describe('TicketsList', () => {
  let component: TicketsList;
  let fixture: ComponentFixture<TicketsList>;
  let mockStore: MockTicketsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsList, TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        { provide: TicketsStore, useClass: MockTicketsStore },
        provideRouter([] as any),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsList);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(TicketsStore) as unknown as MockTicketsStore;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load tickets on init', async () => {
    expect(component).toBeTruthy();
    expect(component.filteredTickets().length).toBe(mockStore.tickets().length);
  });

  it('should filter tickets when filter changes', () => {
    const event = { target: { value: 'closed' } } as unknown as Event;
    component.handleFilterChange(event);
    expect(component.filter()).toBe('closed');
    expect(component.filteredTickets().every((t) => t.status === 'closed')).toBe(true);
  });

  it('navigates to ticket details on row click', () => {
    const router = TestBed.inject(Router);
    let navigated: any[] | null = null;
    (router.navigate as any) = (args: any[]) => {
      navigated = args;
      return Promise.resolve(true);
    };
    component.handleRowClick('1');
    expect(navigated).toEqual(['/ticket', '1']);
  });
});
