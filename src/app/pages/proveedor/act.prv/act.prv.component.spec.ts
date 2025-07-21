import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActPrvComponent } from './act.prv.component';

describe('ActPrvComponent', () => {
  let component: ActPrvComponent;
  let fixture: ComponentFixture<ActPrvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActPrvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActPrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
