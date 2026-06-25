import Layout from '@/Layouts/Layout.js';

import { useState } from 'react';
import { useHome } from '@/Pages/Home/useHome.js';

import { type Answer } from '@/Types/types.js';

import MapComponent from '@/Components/Map/MapComponent.js';
import { Card } from '@/Components/ui/card.js';
import { Button } from '@/Components/ui/button.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/Components/ui/combobox.js';

import { LocateFixed } from 'lucide-react';

import { Map } from 'leaflet';

type HomeProps = {
  initialCoordinates: { latitude: number; longitude: number };
  initialZoom: number;
}

export default function Home({ initialCoordinates, initialZoom }: HomeProps) {
  const [circle, setCircle] = useState<{ center: { latitude: number; longitude: number }; radius: number } | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  const { suggestions, markers, onSearchChange, handleSuggestionClick } = useHome();

  return (
    <Layout title="Where2Buy - Find where to buy your items!">
      <Card className="relative hover:shadow-lg transition-shadow w-full h-full p-0">
        <MapComponent
          initialCoordinates={[initialCoordinates.latitude, initialCoordinates.longitude]}
          initialZoom={initialZoom}
          // circles={circle ? [circle] : []}
          markers={markers}
          onMapInitialized={setMap}
        />
        {/* Floating Components */}
        <div className="absolute top-1 left-0 right-0 md:w-1/4 z-500 shadow-lg rounded-lg">
          <Combobox items={suggestions}>
            <ComboboxInput
              placeholder="Search Items..."
              onChange={onSearchChange}
              showClear
              className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg:background/80" />
            <ComboboxContent>
              <ComboboxList>
                {(suggestion) => (
                  <ComboboxItem key={suggestion.id} value={suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="absolute bottom-10.5 md:bottom-6.5 right-12 z-500 shadow-lg rounded-lg">
          <Button
            className="h-8 w-8 active:bg-gray-200"
            variant="outline"
            disabled={!map}
            onClick={() => {
              map?.setView([initialCoordinates.latitude, initialCoordinates.longitude], initialZoom, { animate: true, duration: 0.5 });
            }}
          >
            <LocateFixed />
          </Button>
        </div>
      </Card>
    </Layout>
  );
}
