import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailViewComponent } from './client-detail-view.component';

describe('ClientDetailViewComponent', () => {
  let component: ClientDetailViewComponent;
  let fixture: ComponentFixture<ClientDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
