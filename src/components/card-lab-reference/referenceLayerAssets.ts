import statCyanBorder from "../../assets/card-reference-layers/stat/cyan/border-overlay.png";
import statCyanTexture from "../../assets/card-reference-layers/stat/cyan/texture-overlay.png";
import statCyanIcon from "../../assets/card-reference-layers/stat/cyan/icon-cluster.png";
import statGreenBorder from "../../assets/card-reference-layers/stat/green/border-overlay.png";
import statGreenTexture from "../../assets/card-reference-layers/stat/green/texture-overlay.png";
import statGreenIcon from "../../assets/card-reference-layers/stat/green/icon-cluster.png";
import statPurpleBorder from "../../assets/card-reference-layers/stat/purple/border-overlay.png";
import statPurpleTexture from "../../assets/card-reference-layers/stat/purple/texture-overlay.png";
import statPurpleIcon from "../../assets/card-reference-layers/stat/purple/icon-cluster.png";
import statOrangeBorder from "../../assets/card-reference-layers/stat/orange/border-overlay.png";
import statOrangeTexture from "../../assets/card-reference-layers/stat/orange/texture-overlay.png";
import statOrangeIcon from "../../assets/card-reference-layers/stat/orange/icon-cluster.png";

import actionCyanBorder from "../../assets/card-reference-layers/action/cyan/border-overlay.png";
import actionCyanTexture from "../../assets/card-reference-layers/action/cyan/texture-overlay.png";
import actionCyanIcon from "../../assets/card-reference-layers/action/cyan/icon-cluster.png";
import actionGreenBorder from "../../assets/card-reference-layers/action/green/border-overlay.png";
import actionGreenTexture from "../../assets/card-reference-layers/action/green/texture-overlay.png";
import actionGreenIcon from "../../assets/card-reference-layers/action/green/icon-cluster.png";
import actionPurpleBorder from "../../assets/card-reference-layers/action/purple/border-overlay.png";
import actionPurpleTexture from "../../assets/card-reference-layers/action/purple/texture-overlay.png";
import actionPurpleIcon from "../../assets/card-reference-layers/action/purple/icon-cluster.png";
import actionOrangeBorder from "../../assets/card-reference-layers/action/orange/border-overlay.png";
import actionOrangeTexture from "../../assets/card-reference-layers/action/orange/texture-overlay.png";
import actionOrangeIcon from "../../assets/card-reference-layers/action/orange/icon-cluster.png";
import actionPinkBorder from "../../assets/card-reference-layers/action/pink/border-overlay.png";
import actionPinkTexture from "../../assets/card-reference-layers/action/pink/texture-overlay.png";
import actionPinkIcon from "../../assets/card-reference-layers/action/pink/icon-cluster.png";
import actionBlueBorder from "../../assets/card-reference-layers/action/blue/border-overlay.png";
import actionBlueTexture from "../../assets/card-reference-layers/action/blue/texture-overlay.png";
import actionBlueIcon from "../../assets/card-reference-layers/action/blue/icon-cluster.png";

export type ReferenceStatTone = "cyan" | "green" | "purple" | "orange";
export type ReferenceActionTone =
  | "cyan"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "blue";

export const statLayerAssets = {
  cyan: { border: statCyanBorder, texture: statCyanTexture, icon: statCyanIcon },
  green: { border: statGreenBorder, texture: statGreenTexture, icon: statGreenIcon },
  purple: { border: statPurpleBorder, texture: statPurpleTexture, icon: statPurpleIcon },
  orange: { border: statOrangeBorder, texture: statOrangeTexture, icon: statOrangeIcon },
} as const;

export const actionLayerAssets = {
  cyan: { border: actionCyanBorder, texture: actionCyanTexture, icon: actionCyanIcon },
  green: { border: actionGreenBorder, texture: actionGreenTexture, icon: actionGreenIcon },
  purple: { border: actionPurpleBorder, texture: actionPurpleTexture, icon: actionPurpleIcon },
  orange: { border: actionOrangeBorder, texture: actionOrangeTexture, icon: actionOrangeIcon },
  pink: { border: actionPinkBorder, texture: actionPinkTexture, icon: actionPinkIcon },
  blue: { border: actionBlueBorder, texture: actionBlueTexture, icon: actionBlueIcon },
} as const;
