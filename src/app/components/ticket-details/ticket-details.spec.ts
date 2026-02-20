import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { TicketDetails } from './ticket-details';

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [TicketDetails, TranslateModule.forRoot()],
  providers: [provideHttpClientTesting(), provideRouter([] as any)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
