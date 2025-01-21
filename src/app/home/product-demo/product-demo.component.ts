import { Component } from '@angular/core';

@Component({
  selector: 'app-product-demo',
  imports: [],
  templateUrl: './product-demo.component.html',
  styleUrl: './product-demo.component.css'
})
export class ProductDemoComponent {
  sizes: string[] = ['38', '39', '40', '41', '42'];
  selectedSize: string = '40';

  colors = [
    { value: '#FFFFFF', isSelected: true },
    { value: '#1F2937', isSelected: false },
    { value: '#2563EB', isSelected: false }
  ];

  selectColor(selectedColor: { value: string; isSelected: boolean }) {
    this.colors.forEach(color => {
      color.isSelected = color.value === selectedColor.value;
    });
  }
}
