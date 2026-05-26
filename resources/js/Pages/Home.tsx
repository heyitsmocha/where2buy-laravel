import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout.js';
import MapComponent from '../Components/MapComponent.js';

import { useState } from 'react';
import useDebounce from 'react-debounced';

import { apiGet } from '../util';
import { Button } from '@/Components/ui/button.js';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/Components/ui/combobox.js';

import { Map } from 'leaflet';

type HomeProps = {
  coordinates: [number, number];
  zoom: number;
}

type Suggestion = {
  id: number;
  name: string;
}

type ItemSuggestionDto = {
  item_id: number;
  item_name: string;
}

export default function Home({ coordinates, zoom }: HomeProps) {
  const [circle, setCircle] = useState<{ center: [number, number], radius: number } | null>(null);
  const [markers, setMarkers] = useState<{ id: number, coordinate: [number, number] }[]>([]);
  const [map, setMap] = useState<Map | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const suggestionsDebounce = useDebounce(1000);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    console.log('Search query:', query);

    // Debounce
    suggestionsDebounce(() => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }
      apiGet({
        url: `items/suggestions/?input=${encodeURIComponent(query)}`,
        onData: (data) => {
          console.log(`Search results for ${query}:`, data);
          setSuggestions(data.map((item: ItemSuggestionDto) => ({
            id: item.item_id,
            name: item.item_name,
          })));
        },
        onError: (error: any) => {
          console.error('Error fetching search results:', error);
        }
      });
    });
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    console.log(`Clicked suggestion: ${suggestion.name} (ID: ${suggestion.id})`);

    apiGet({
      url: `items/${suggestion.id}/answers`,
      onData: (data: any) => {
        console.log(`Answers for item ${suggestion.name}:`, data);
        setMarkers(data.map((answer: any) => {
          console.log('Processing answer:', answer);
          return ({
            id: answer.id,
            coordinate: [answer.latitude, answer.longitude],
          });
        }));
      },
      onError: (error: any) => {
        console.error('Error fetching answers:', error);
      }
    });
  }

  return (
    <Layout>
      <Head title="Home" />
      <center>
        <div className="container py-8 px-4 bg-white rounded-lg shadow">
          <h1>Where2Buy</h1>
          <div className="p-4 w-1/4">
            {/* <Combobox className='form-input' type='text' name='search' placeholder='Search Items...' onChange={onSearchChange}></Combobox> */}
            <Combobox items={suggestions}>
              <ComboboxInput placeholder="Search Items..." onChange={onSearchChange} showClear  />
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
          <Button
            className="mb-4"
            variant="outline"
            disabled={!map}
            onClick={() => {
              map?.setView(coordinates, zoom, { animate: true, duration: 0.5 });
            }}
          >
            Center Map
          </Button>
          <MapComponent
            initialCoordinates={coordinates}
            initialZoom={zoom}
            circles={circle ? [circle] : []}
            markers={markers}
            onMapInitialized={setMap}
          />
        </div>
      </center>
    </Layout>
  );
}
