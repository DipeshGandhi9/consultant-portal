import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingDetailsComponent } from './consulting-details.component';

describe('ConsultingDetailsComponent', () => {
  let component: ConsultingDetailsComponent;
  let fixture: ComponentFixture<ConsultingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
