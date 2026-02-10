import { atom } from 'jotai';
import { Tokens } from '../lib/fetch-tokens';

export const globalTokensAtom = atom<Tokens>([]);
