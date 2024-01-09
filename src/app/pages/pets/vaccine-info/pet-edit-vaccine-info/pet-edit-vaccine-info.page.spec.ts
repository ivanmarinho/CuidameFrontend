import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PetEditVaccineInfoPage } from './pet-edit-vaccine-info.page';

describe('PetEditVaccineInfoPage', () => {
  let component: PetEditVaccineInfoPage;
  let fixture: ComponentFixture<PetEditVaccineInfoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PetEditVaccineInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PetEditVaccineInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
