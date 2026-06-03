import Layout from '../Layouts/Layout.js';

import { useState } from 'react';
import useDebounce from 'react-debounced';

import { apiGet } from '../util.js';
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

type Suggestion = {
  id: number;
  name: string;
}

type ItemSuggestionDto = {
  item_id: number;
  item_name: string;
}

export default function Home({ initialCoordinates, initialZoom }: HomeProps) {
  const [circle, setCircle] = useState<{ center: LatLng, radius: number } | null>(null);
  const [markers, setMarkers] = useState<Answer[]>([]);
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
          const processedAnswer: Answer = {
            id: answer.id,
            inquiry_id: answer.inquiry_id,
            user_id: answer.user_id,
            location: [answer.latitude, answer.longitude] as LatLng,
            store_name: answer.store_name,
            store_address: answer.store_address,
          };
          console.log('Processed answer:', processedAnswer);
          return processedAnswer;
        }));

        setSuggestions([]); // Clear suggestions after selection
      },
      onError: (error: any) => {
        console.error('Error fetching answers:', error);
      }
    });
  }

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
