import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environment/environment';

// Función para cargar el script de Google Maps de manera asíncrona
function loadGoogleMapsApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verifica si la API de Google Maps ya está cargada usando encadenamiento opcional
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
  });
}

// Cargar la API y luego iniciar la aplicación
loadGoogleMapsApi()
  .then(() => bootstrapApplication(AppComponent))
  .catch((err) => console.error('Error loading Google Maps API', err));
