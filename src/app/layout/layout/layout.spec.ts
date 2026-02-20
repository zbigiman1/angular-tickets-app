import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Layout } from './layout';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [Layout, TranslateModule.forRoot()],
  providers: [provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
