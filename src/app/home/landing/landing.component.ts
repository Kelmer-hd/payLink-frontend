import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { PricingComponent } from '../pricing/pricing.component';
import { FooterComponent } from '../footer/footer.component';
import { FeatureComponent } from '../feature/feature.component';
import { ProductDemoComponent } from '../product-demo/product-demo.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, HowItWorksComponent, TestimonialsComponent,PricingComponent, FooterComponent,FeatureComponent, ProductDemoComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  isAuthModalOpen = signal(false);
  
    scrollToSection(id: string): void {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 64; // altura del navbar en píxeles
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
}
