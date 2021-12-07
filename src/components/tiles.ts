import grape from '../resources/grapes.svg';
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
    image: getImageFromFile(grape),
  },
  {
    id: 1,
    image: getImageFromFile(avocado),
  },
  {
    id: 2,
    image: getImageFromFile(watermelon),
  },
  {
    id: 3,
    image: getImageFromFile(soil),
  },
  {
    id: 4,
    image: getImageFromFile(grass),
  },
] as const;

export default tiles;
