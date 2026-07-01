import Layout from '@/Layouts/Layout.js';

import { useState, useRef } from 'react';
import { useHomeMap, useHomeSearch } from '@/Pages/Home/useHome.js';
import { useHome } from '@/Pages/Home/useHome.js';

import MapComponent from '@/Components/Map/MapComponent.js';
import { Card } from '@/Components/ui/card.js';
import { Autocomplete } from '@base-ui/react/autocomplete';
import { toast } from 'sonner';

import { Search, X } from 'lucide-react';

type HomeProps = {
  initialCoordinates: { latitude: number; longitude: number };
  initialZoom: number;
}

export default function Home({ initialCoordinates, initialZoom }: HomeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { circle, handleMapInitialized, handleMoveEnd } = useHomeMap();
  const { suggestions, markers, query, isSearching, answerStatus, onSearchChange, handleSuggestionClick } = useHomeSearch();


  return (
    <Layout title="Where2Buy - Find where to buy your items!">
      <Card className="relative hover:shadow-lg transition-shadow w-full h-full p-0">
        <MapComponent
          initialCoordinates={[initialCoordinates.latitude, initialCoordinates.longitude]}
          initialZoom={initialZoom}
          // circles={circle ? [circle] : []}
          markers={markers}
          onMapInitialized={handleMapInitialized}
          onMoveEnd={() => {
            handleMoveEnd();
          }}
        />
        {/* Floating Components */}
        {/* Search bar */}
        <div className="absolute top-1 left-1 right-0 md:w-1/4 z-500 shadow-lg rounded-lg">
          {/* https://base-ui.com/react/components/autocomplete */}
          <Autocomplete.Root
            items={suggestions}
            itemToStringValue={(suggestion) => suggestion.name}
            value={query}
            onValueChange={(value) => onSearchChange(value, (error) => {
              console.log('Error fetching search results:', error);
              toast.error('Error fetching search results. Please try again later.');
            })}
          >
            <Card className="py-3">
              <label className="flex">
                <Autocomplete.Input placeholder='e.g. Bread' className="flex-1 ms-1 px-2 " ref={inputRef} />
                {query
                  ?
                  <button onClick={() => onSearchChange('')}>
                    <X className="mx-2 cursor-pointer hover:bg-gray-100 rounded-lg" />
                  </button>
                  : <Search className="mx-2" />}

              </label>
            </Card>
            <Autocomplete.Portal className="w-full">
              <Autocomplete.Positioner sideOffset={4} align="start">
                <Autocomplete.Popup className="bg-white shadow-lg rounded-lg w-full max-h-60 overflow-y-auto">
                  <Autocomplete.Status className="text-sm text-gray-500 px-2 mt-3">
                    {query.trim() === '' ? 'Start typing to search' : isSearching ? 'Searching...' : `${suggestions.length} items found.`}
                  </Autocomplete.Status>
                  <div className="">
                    <Autocomplete.List className="mt-2">
                      {
                        (suggestion) => (
                          <div className="hover:bg-gray-200 cursor-pointer">
                            <Autocomplete.Item key={suggestion.id} value={suggestion} className="p-3" onClick={() => {
                              handleSuggestionClick(suggestion, error => {
                                console.log('Error fetching answers:', error);
                                toast.error('Error fetching answers. Please try again later.');
                              });

                              inputRef.current?.blur(); // Remove focus from the input after selecting a suggestion to dismiss the keyboard on mobile devices
                            }}
                            >
                              <span>{suggestion.name}</span>
                            </Autocomplete.Item>
                          </div>
                        )
                      }
                    </Autocomplete.List>
                  </div>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </div>
        {/* Answer count */}
        {answerStatus !== 'idle' && (
          <div className="absolute w-max bottom-1/5 left-1/2 -translate-x-1/2 right-auto md:top-15 md:left-1 md:translate-x-0 z-500 shadow-lg rounded-lg text-center">
            <Card className="py-3 px-4">
              <span className="text-sm text-gray-500">
                {answerStatus === 'fetching'
                  ? 'Fetching answers...'
                  : answerStatus === 'selected'
                    ? `${markers.length} ${markers.length === 1 ? 'answer' : 'answers'} found`
                    : 'Error fetching answers'}
              </span>
            </Card>
          </div>
        )}
      </Card>
    </Layout>
  );
}
