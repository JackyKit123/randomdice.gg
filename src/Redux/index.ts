import { useSelector } from 'react-redux';
import { RootState } from './store';

type Selector<T extends keyof RootState> = keyof { [R in T]: RootState[R] };

export default function useRootStateSelector<T extends keyof RootState>(
    reducer: Selector<T>
): RootState[Selector<T>] {
    return useSelector((state: RootState) => state[reducer]);
}
