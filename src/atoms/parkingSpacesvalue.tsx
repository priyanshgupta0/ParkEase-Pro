import {atom} from 'recoil';

export const parkingSpace = atom<number>({
  key: 'parkingSpace',
  default: 0,
});
