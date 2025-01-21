import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDemoComponent } from './product-demo.component';

describe('ProductDemoComponent', () => {
  let component: ProductDemoComponent;
  let fixture: ComponentFixture<ProductDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
