import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtoPlayModalComponent } from './howto-play-modal.component';

describe('HowtoPlayModalComponent', () => {
  let component: HowtoPlayModalComponent;
  let fixture: ComponentFixture<HowtoPlayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowtoPlayModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowtoPlayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
