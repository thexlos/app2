import statCyanBase from "../../assets/card-complete-bases/stat/cyan/complete-blank-base.png";
import statGreenBase from "../../assets/card-complete-bases/stat/green/complete-blank-base.png";
import statPurpleBase from "../../assets/card-complete-bases/stat/purple/complete-blank-base.png";
import statOrangeBase from "../../assets/card-complete-bases/stat/orange/complete-blank-base.png";
import actionCyanBase from "../../assets/card-complete-bases/action/cyan/complete-blank-base.png";
import actionGreenBase from "../../assets/card-complete-bases/action/green/complete-blank-base.png";
import actionPurpleBase from "../../assets/card-complete-bases/action/purple/complete-blank-base.png";
import actionOrangeBase from "../../assets/card-complete-bases/action/orange/complete-blank-base.png";
import actionPinkBase from "../../assets/card-complete-bases/action/pink/complete-blank-base.png";
import actionBlueBase from "../../assets/card-complete-bases/action/blue/complete-blank-base.png";

export type CompleteStatTone = "cyan" | "green" | "purple" | "orange";
export type CompleteActionTone = "cyan" | "green" | "purple" | "orange" | "pink" | "blue";

export const completeStatBases = {
  cyan: statCyanBase,
  green: statGreenBase,
  purple: statPurpleBase,
  orange: statOrangeBase,
} as const;

export const completeActionBases = {
  cyan: actionCyanBase,
  green: actionGreenBase,
  purple: actionPurpleBase,
  orange: actionOrangeBase,
  pink: actionPinkBase,
  blue: actionBlueBase,
} as const;
