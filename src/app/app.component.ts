import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [GoogleMapsModule, FormsModule]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  center: google.maps.LatLngLiteral = {
    lat: 36.70454050502399, 
    lng: -4.462976671450127,
  };
  zoom = 17;
  options: google.maps.MapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    mapId: "f3266f7ce5971ba",
  };

  markers: google.maps.marker.AdvancedMarkerElement[] = [];
  allMarkersData: any[] = [];
  searchTerm: string = '';

  ngAfterViewInit(): void {
    const map = this.googleMap.googleMap;

    if (map) {
      this.loadMarkers().then(markers => {
        this.allMarkersData = markers;
        this.filterMarkers(); // Inicializa los marcadores en el mapa
      }).catch(error => {
        console.error('Error loading markers:', error);
      });
    }
  }

  private async loadMarkers(): Promise<any[]> {
    try {
      const response = await fetch('assets/booths.json');

      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Markers loaded successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to load markers:', error);
      return [];
    }
  }

  filterMarkers(): void {
    console.log(`Filtering markers with searchTerm: ${this.searchTerm}`);
    
    // Eliminar todos los marcadores del mapa
    this.markers.forEach(marker => {
      marker.map = null;  // Esto elimina el marcador del mapa
    });
    this.markers = [];  // Limpia el array de marcadores actuales

    // Filtrar los datos de los marcadores basados en el término de búsqueda
    const filteredMarkers = this.allMarkersData.filter(markerData =>
      markerData.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    console.log(`Filtered markers:`, filteredMarkers);

    // Crear y añadir los marcadores filtrados al mapa
    this.markers = filteredMarkers.map(markerData => {
      const contentElement = document.createElement('div');
      contentElement.style.backgroundColor = 'white';  // Fondo blanco
      contentElement.style.color = 'black';  // Color de texto negro
      contentElement.style.padding = '4px';  // Espaciado interior
      contentElement.style.border = '2px solid red';  // Borde rojo
      contentElement.innerHTML = `<div>${markerData.title}</div>`;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.googleMap.googleMap,
        content: contentElement,
        title: markerData.title,
      });

      marker.addListener('click', () => {
        const latLng = `${markerData.lat.toFixed(6)}, ${markerData.lng.toFixed(6)}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${latLng}`;

        // Copiar al portapapeles
        navigator.clipboard.writeText(googleMapsUrl)
          .then(() => {
            // Redirigir a la URL en una nueva pestaña
            window.open(googleMapsUrl, '_blank');
          })
          .catch((error) => {
            console.error('Failed to copy coordinates to clipboard', error);
            alert('Failed to copy coordinates to clipboard');
          });
      });

      return marker;
    });
  }
}
