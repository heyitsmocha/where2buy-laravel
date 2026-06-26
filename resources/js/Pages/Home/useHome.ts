import { useState } from 'react';
import useDebounce from 'react-debounced';

import { apiGet } from '@/util.js';
import type { Answer } from '@/Types/types.js';

export function useHome() {
  const suggestionsDebounce = useDebounce(1000);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [markers, setMarkers] = useState<Answer[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFetchingAnswers, setIsFetchingAnswers] = useState<boolean>(false);

  type Suggestion = {
    id: number;
    name: string;
  }

  type ItemSuggestionDto = {
    item_id: number;
    item_name: string;
  }

  const onSearchChange = (value: string, onError?: (error: any) => void) => {
    setIsSearching(true);
    setQuery(value);
    setMarkers([]); // Clear markers when search query changes
    // console.log('Search query:', query);

    if (value.trim() === '') {
      console.log('Query is empty, clearing suggestions and markers.');
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Debounce
    suggestionsDebounce(() => {
      apiGet({
        url: `items/suggestions/?input=${encodeURIComponent(value)}`,
        onData: (data) => {
          // console.log(`Search results for ${query}:`, data);
          setSuggestions(data.map((item: ItemSuggestionDto) => ({
            id: item.item_id,
            name: item.item_name,
          })));
        },
        onError: (error: any) => {
          console.error('Error fetching search results:', error);
          onError?.(error);
        },
        onFinally: () => {
          setIsSearching(false);
        }
      });
    });
  }

  const handleSuggestionClick = (suggestion: Suggestion, onError?: (error: any) => void) => {
    // console.log(`Clicked suggestion: ${suggestion.name} (ID: ${suggestion.id})`);
    setIsFetchingAnswers(true);
    apiGet({
      url: `items/${suggestion.id}/answers`,
      onData: (data: any) => {
        // console.log(`Answers for item ${suggestion.name}:`, data);
        setMarkers(data.map((answer: any) => {
          // console.log('Processing answer:', answer);
          const processedAnswer: Answer = {
            id: answer.id,
            inquiry_id: answer.inquiry_id,
            user_id: answer.user_id,
            latitude: answer.latitude,
            longitude: answer.longitude,
            store_name: answer.store_name,
            store_address: answer.store_address,
          };
          // console.log('Processed answer:', processedAnswer);
          return processedAnswer;
        }));

        setSuggestions([]); // Clear suggestions after selection
      },
      onError: (error: any) => {
        console.error('Error fetching answers:', error);
        onError?.(error);
        setMarkers([]); // Clear markers on error
      },
      onFinally: () => {
        setIsFetchingAnswers(false);
      }
    });
  }

  return {
    suggestions,
    markers,
    query,
    isSearching,
    isFetchingAnswers,
    onSearchChange,
    handleSuggestionClick,
  };
}
