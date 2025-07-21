import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvoPrvComponent } from './nvo.prv.component';

describe('NvoPrvComponent', () => {
  let component: NvoPrvComponent;
  let fixture: ComponentFixture<NvoPrvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NvoPrvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NvoPrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
