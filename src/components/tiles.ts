import grassPNG from '../resources/adventure/Grass/gtile4.png';
import grass2PNG from '../resources/adventure/Grass/gtile2.png';
import grass3PNG from '../resources/adventure/Grass/gtile3.png';
import grass4PNG from '../resources/adventure/Grass/gtile5.png';
import waterPNG from '../resources/adventure/Water/wtile1.png';
import water2PNG from '../resources/adventure/Water/wtile2.png';
import water3PNG from '../resources/adventure/Water/wtile3.png';
import water4PNG from '../resources/adventure/Water/wtile4.png';
import water5PNG from '../resources/adventure/Water/wtile5.png';
import water6PNG from '../resources/adventure/Water/wtile6.png';
import grape from '../resources/grapes.svg';
import background from '../resources/bg.jpg';
import avocado from '../resources/avocado.png';
import watermelon from '../resources/watermelon.svg';
import soil from '../resources/soil.jpg';
import grass from '../resources/grass.jpg';

function getImageFromFile(img: any): HTMLImageElement {
  const image = new Image();
  image.src = img;

  return image;
}

export const tiles = [
  {
    id: 0,
    image: getImageFromFile(grassPNG),
  },
  {
    id: 1,
    image: getImageFromFile(grass2PNG),
  },
  {
    id: 2,
    image: getImageFromFile(grass3PNG),
  },
  {
    id: 3,
    image: getImageFromFile(grass4PNG),
  },
  {
    id: 4,
    image: getImageFromFile(waterPNG),
  },
  {
    id: 5,
    image: getImageFromFile(water2PNG),
  },
  {
    id: 6,
    image: getImageFromFile(water3PNG),
  },
  {
    id: 7,
    image: getImageFromFile(water4PNG),
  },
  {
    id: 8,
    image: getImageFromFile(water5PNG),
  },
  {
    id: 9,
    image: getImageFromFile(water6PNG),
  },
  {
    id: 10,
    image: getImageFromFile(grape),
  },
  {
    id: 11,
    image: getImageFromFile(background),
  },
  {
    id: 12,
    image: getImageFromFile(avocado),
  },
  {
    id: 13,
    image: getImageFromFile(watermelon),
  },
  {
    id: 14,
    image: getImageFromFile(soil),
  },
  {
    id: 15,
    image: getImageFromFile(grass),
  },
] as const;

export default tiles;
