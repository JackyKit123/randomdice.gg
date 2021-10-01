import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import useRootStateSelector from '@redux';
import { Deck, Die } from 'types/database';

interface FilterContext {
  legendaryOwned: Die['id'][];
  profile: keyof Deck['rating'];
  customSearch: Die['id'];
  deckType: '?' | 'pvp' | 'co-op' | 'crew';
  setLegendaryOwned: Dispatch<SetStateAction<FilterContext['legendaryOwned']>>;
  setProfile: Dispatch<SetStateAction<FilterContext['profile']>>;
  setCustomSearch: Dispatch<SetStateAction<FilterContext['customSearch']>>;
  setDeckType: Dispatch<SetStateAction<FilterContext['deckType']>>;
}

export const FilterContext = createContext<FilterContext>({
  legendaryOwned: [],
  profile: 'default',
  customSearch: -1,
  deckType: 'pvp',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLegendaryOwned: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setProfile: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCustomSearch: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDeckType: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps): JSX.Element {
  const { dice } = useRootStateSelector('fetchFirebaseReducer');

  const [legendaryOwned, setLegendaryOwned] = useState<
    FilterContext['legendaryOwned']
  >([]);
  const [profile, setProfile] = useState<FilterContext['profile']>('default');
  const [customSearch, setCustomSearch] = useState<
    FilterContext['customSearch']
  >(-1);
  const [deckType, setDeckType] = useState<FilterContext['deckType']>('pvp');

  useEffect(() => {
    if (legendaryOwned.length === 0) {
      setLegendaryOwned(
        dice.filter(die => die.rarity === 'Legendary').map(die => die.id)
      );
    }
  }, [dice]);

  return (
    <FilterContext.Provider
      value={{
        legendaryOwned,
        setLegendaryOwned,
        profile,
        setProfile,
        customSearch,
        setCustomSearch,
        deckType,
        setDeckType,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
