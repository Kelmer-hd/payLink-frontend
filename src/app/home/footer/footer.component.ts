import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  footerSections = [
    {
      title: 'Producto',
      links: [
        { text: 'Características', href: '#features' },
        { text: 'Precios', href: '#pricing' },
        { text: 'Guías', href: '#' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { text: 'Ayuda', href: '#' },
        { text: 'Contacto', href: '#' },
        { text: 'Estado', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { text: 'Términos', href: '#' },
        { text: 'Privacidad', href: '#' }
      ]
    }
  ];

  socialLinks = [
    { text: 'Twitter', href: '#' },
    { text: 'Instagram', href: '#' },
    { text: 'LinkedIn', href: '#' }
  ];

  handleClick(event: Event, link: { href: string }): void {
    if (link.href.startsWith('#')) {
      event.preventDefault();
      const id = link.href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
