import Layout from '../Layouts/Layout.js';

import { useState } from 'react';
import { useHome } from '@/hooks/useHome.js';

import { type Answer, type LatLng } from '@/Types/types.js';

import MapComponent from '../Components/Map/MapComponent.js';
import { Card } from '@/Components/ui/card.js';
import { Button } from '@/Components/ui/button.js';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/Components/ui/combobox.js';

import { Map } from 'leaflet';

type HomeProps = {
  initialCoordinates: LatLng;
  initialZoom: number;
}

export default function Home({ initialCoordinates, initialZoom }: HomeProps) {
  const [circle, setCircle] = useState<{ center: LatLng, radius: number } | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  const { suggestions, markers, onSearchChange, handleSuggestionClick } = useHome();

  return (
    <Layout title="Where2Buy - Find where to buy your items!">
      <center>
        <Card className="mt-10 p-6 hover:shadow-lg transition-shadow sm:w-full lg:w-3/4 xl:w-11/12 items-center">
          <div className="p-4 lg:w-1/4">
            {/* <Combobox className='form-input' type='text' name='search' placeholder='Search Items...' onChange={onSearchChange}></Combobox> */}
            <Combobox items={suggestions}>
              <ComboboxInput placeholder="Search Items..." onChange={onSearchChange} showClear />
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
          <MapComponent
            initialCoordinates={initialCoordinates}
            initialZoom={initialZoom}
            circles={circle ? [circle] : []}
            markers={markers}
            onMapInitialized={setMap}
          />
          <Button
            className="mt-4"
            variant="outline"
            disabled={!map}
            onClick={() => {
              map?.setView(initialCoordinates, initialZoom, { animate: true, duration: 0.5 });
            }}
          >
            Reset Camera
          </Button>
        </Card>
      </center>
    </Layout>
  );
}
