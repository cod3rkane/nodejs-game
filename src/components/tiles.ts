import * as t from 'io-ts';

import grape from '../resources/grape.png';
import avocado from '../resources/avocado.png';
import apple from '../resources/apple.png';
import soil from '../resources/soil.jpg';
import grass from '../resources/grass.jpg';

export const TileType = t.type({
  id: t.number,
  score: t.number,
});

export type Tile = t.TypeOf<typeof TileType> & {
  image: HTMLImageElement;
};

function getImageFromFile(img: any): HTMLImageElement {
  const image = new Image();
  image.src = img;

  return image;
}

export const tiles: Tile[] = [
  {
    id: 0,
    image: getImageFromFile(grape),
    score: 10,
  },
  {
    id: 1,
    image: getImageFromFile(avocado),
    score: 20,
  },
  {
    id: 2,
    image: getImageFromFile(apple),
    score: 10,
  },
  {
    id: 3,
    image: getImageFromFile(soil),
    score: 0,
  },
  {
    id: 4,
    image: getImageFromFile(grass),
    score: 0,
  },
];

export default tiles;
