import { useState } from 'react';
import useDebounce from 'react-debounced';

import { apiGet } from '@/util.js';
import type { Answer } from '@/Types/types.js';

import {
  Map,
  type LatLng,
} from 'leaflet';

export function useHomeMap() {
  const [circle, setCircle] = useState<{ center: LatLng; radius: number } | null>(null);
  const mapRef = useRef<Map | null>(null);

  const computeCircle = (m: Map): { center: LatLng; radius: number } => {
    const center = m.getCenter();
    const radius = center.distanceTo(m.getBounds().getNorthEast());
    return { center, radius };
  };

  const handleMapInitialized = useCallback((m: Map) => {
    mapRef.current = m;
    setCircle(computeCircle(m));
  }, []);

  const handleMoveEnd = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    setCircle(computeCircle(m));
  }, []);
  return {
    circle,
    handleMapInitialized,
    handleMoveEnd,
  };
}

export function useHomeSearch() {
  const suggestionsDebounce = useDebounce(1000);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [markers, setMarkers] = useState<Answer[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'selected' | 'fetching' | 'error'>('idle');

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

    // If the search query has changed, clear suggestions and markers
    if (value.trim() !== query.trim()) {
      setMarkers([]); // Clear markers when search query changes

      if (answerStatus !== 'idle') {
        setAnswerStatus('idle'); // Reset answer status when search query changes
      }
    }
    setQuery(value);
    setMarkers([]); // Clear markers when search query changes
    // console.log('Search query:', query);

    if (value.trim() === '') {
      console.log('Query is empty, clearing suggestions and markers.');
      setAnswerStatus('idle'); // Reset answer status when a new search is initiated
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
    setAnswerStatus('fetching');
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
        setAnswerStatus('selected');
        setSuggestions([]); // Clear suggestions after selection
      },
      onError: (error: any) => {
        console.error('Error fetching answers:', error);
        onError?.(error);
        setMarkers([]); // Clear markers on error
        setAnswerStatus('error');
      }
    });
  }

  return {
    suggestions,
    markers,
    query,
    isSearching,
    answerStatus,
    onSearchChange,
    handleSuggestionClick,
  };
}
