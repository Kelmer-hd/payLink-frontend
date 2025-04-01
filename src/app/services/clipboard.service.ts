import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  async copyToClipboard(text: string): Promise<void> {
    try {
      // Intentar usar la API moderna del portapapeles
      await navigator.clipboard.writeText(text);
    } catch (clipboardError) {
      // Fallback al método antiguo
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Evitar scroll al elemento
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (error) {
        throw new Error('No se pudo copiar al portapapeles');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }
} 