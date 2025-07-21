import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvoCatComponent } from './nvo.cat.component';

describe('NvoCatComponent', () => {
  let component: NvoCatComponent;
  let fixture: ComponentFixture<NvoCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NvoCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NvoCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
