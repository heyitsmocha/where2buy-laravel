import { useState } from 'react';
import useDebounce from 'react-debounced';

import { apiGet } from '../util.js';
import type { Answer, LatLng } from '@/Types/types.js';

export function useHome() {
  const suggestionsDebounce = useDebounce(1000);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [markers, setMarkers] = useState<Answer[]>([]);

  type Suggestion = {
    id: number;
    name: string;
  }

  type ItemSuggestionDto = {
    item_id: number;
    item_name: string;
  }

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

  return {
    suggestions,
    markers,
    onSearchChange,
    handleSuggestionClick,
  };
}
