import activity1 from "./img/card/square/activity1.png";
import activity2 from "./img/card/square/activity2.png";
import activity3 from "./img/card/square/activity3.png";
import food1 from "./img/card/square/food1.png";
import food2 from "./img/card/square/food2.png";
import food3 from "./img/card/square/food3.png";
import etc1 from "./img/card/square/etc1.png";
import etc2 from "./img/card/square/etc2.png";
import etc3 from "./img/card/square/etc3.png";
import healing1 from "./img/card/square/healing1.png";
import healing2 from "./img/card/square/healing2.png";
import healing3 from "./img/card/square/healing3.png";

export const CARD_COVERS = [
  activity1, // 1
  activity2, // 2
  activity3, // 3
  food1, // 4
  food2, // 5
  food3, // 6
  etc1, // 7
  etc2, // 8
  etc3, // 9
  healing1, // 10
  healing2, // 11
  healing3, // 12
];

export function getCardCoverById(cardId) {
  if (!Number.isInteger(cardId) || cardId < 1 || cardId > CARD_COVERS.length)
    return undefined;
  return CARD_COVERS[cardId - 1];
}
