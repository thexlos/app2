import statCyanBorder from "../../assets/card-clean-artwork/stat/cyan/border-reflection.png";
import statCyanTexture from "../../assets/card-clean-artwork/stat/cyan/texture-lighting.png";
import statCyanIcon from "../../assets/card-clean-artwork/stat/cyan/icon-artwork.png";
import statGreenBorder from "../../assets/card-clean-artwork/stat/green/border-reflection.png";
import statGreenTexture from "../../assets/card-clean-artwork/stat/green/texture-lighting.png";
import statGreenIcon from "../../assets/card-clean-artwork/stat/green/icon-artwork.png";
import statPurpleBorder from "../../assets/card-clean-artwork/stat/purple/border-reflection.png";
import statPurpleTexture from "../../assets/card-clean-artwork/stat/purple/texture-lighting.png";
import statPurpleIcon from "../../assets/card-clean-artwork/stat/purple/icon-artwork.png";
import statOrangeBorder from "../../assets/card-clean-artwork/stat/orange/border-reflection.png";
import statOrangeTexture from "../../assets/card-clean-artwork/stat/orange/texture-lighting.png";
import statOrangeIcon from "../../assets/card-clean-artwork/stat/orange/icon-artwork.png";
import actionCyanBorder from "../../assets/card-clean-artwork/action/cyan/border-reflection.png";
import actionCyanTexture from "../../assets/card-clean-artwork/action/cyan/texture-lighting.png";
import actionCyanIcon from "../../assets/card-clean-artwork/action/cyan/icon-artwork.png";
import actionGreenBorder from "../../assets/card-clean-artwork/action/green/border-reflection.png";
import actionGreenTexture from "../../assets/card-clean-artwork/action/green/texture-lighting.png";
import actionGreenIcon from "../../assets/card-clean-artwork/action/green/icon-artwork.png";
import actionPurpleBorder from "../../assets/card-clean-artwork/action/purple/border-reflection.png";
import actionPurpleTexture from "../../assets/card-clean-artwork/action/purple/texture-lighting.png";
import actionPurpleIcon from "../../assets/card-clean-artwork/action/purple/icon-artwork.png";
import actionOrangeBorder from "../../assets/card-clean-artwork/action/orange/border-reflection.png";
import actionOrangeTexture from "../../assets/card-clean-artwork/action/orange/texture-lighting.png";
import actionOrangeIcon from "../../assets/card-clean-artwork/action/orange/icon-artwork.png";
import actionPinkBorder from "../../assets/card-clean-artwork/action/pink/border-reflection.png";
import actionPinkTexture from "../../assets/card-clean-artwork/action/pink/texture-lighting.png";
import actionPinkIcon from "../../assets/card-clean-artwork/action/pink/icon-artwork.png";
import actionBlueBorder from "../../assets/card-clean-artwork/action/blue/border-reflection.png";
import actionBlueTexture from "../../assets/card-clean-artwork/action/blue/texture-lighting.png";
import actionBlueIcon from "../../assets/card-clean-artwork/action/blue/icon-artwork.png";

export type StatTone = "cyan" | "green" | "purple" | "orange";
export type ActionTone = "cyan" | "green" | "purple" | "orange" | "pink" | "blue";

export const cleanStatArtwork = {
  cyan: { border: statCyanBorder, texture: statCyanTexture, icon: statCyanIcon },
  green: { border: statGreenBorder, texture: statGreenTexture, icon: statGreenIcon },
  purple: { border: statPurpleBorder, texture: statPurpleTexture, icon: statPurpleIcon },
  orange: { border: statOrangeBorder, texture: statOrangeTexture, icon: statOrangeIcon },
} as const;

export const cleanActionArtwork = {
  cyan: { border: actionCyanBorder, texture: actionCyanTexture, icon: actionCyanIcon },
  green: { border: actionGreenBorder, texture: actionGreenTexture, icon: actionGreenIcon },
  purple: { border: actionPurpleBorder, texture: actionPurpleTexture, icon: actionPurpleIcon },
  orange: { border: actionOrangeBorder, texture: actionOrangeTexture, icon: actionOrangeIcon },
  pink: { border: actionPinkBorder, texture: actionPinkTexture, icon: actionPinkIcon },
  blue: { border: actionBlueBorder, texture: actionBlueTexture, icon: actionBlueIcon },
} as const;
