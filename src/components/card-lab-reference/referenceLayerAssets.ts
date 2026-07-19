import statCyanSurface from "../../assets/card-reference-layers/stat/cyan/surface-clean.png";
import statCyanTexture from "../../assets/card-reference-layers/stat/cyan/texture-overlay.png";
import statCyanBorder from "../../assets/card-reference-layers/stat/cyan/border-highlight-layer.png";
import statCyanWell from "../../assets/card-reference-layers/stat/cyan/icon-well-glow-layer.png";
import statCyanGlyph from "../../assets/card-reference-layers/stat/cyan/icon-glyph-layer.png";
import statGreenSurface from "../../assets/card-reference-layers/stat/green/surface-clean.png";
import statGreenTexture from "../../assets/card-reference-layers/stat/green/texture-overlay.png";
import statGreenBorder from "../../assets/card-reference-layers/stat/green/border-highlight-layer.png";
import statGreenWell from "../../assets/card-reference-layers/stat/green/icon-well-glow-layer.png";
import statGreenGlyph from "../../assets/card-reference-layers/stat/green/icon-glyph-layer.png";
import statPurpleSurface from "../../assets/card-reference-layers/stat/purple/surface-clean.png";
import statPurpleTexture from "../../assets/card-reference-layers/stat/purple/texture-overlay.png";
import statPurpleBorder from "../../assets/card-reference-layers/stat/purple/border-highlight-layer.png";
import statPurpleWell from "../../assets/card-reference-layers/stat/purple/icon-well-glow-layer.png";
import statPurpleGlyph from "../../assets/card-reference-layers/stat/purple/icon-glyph-layer.png";
import statOrangeSurface from "../../assets/card-reference-layers/stat/orange/surface-clean.png";
import statOrangeTexture from "../../assets/card-reference-layers/stat/orange/texture-overlay.png";
import statOrangeBorder from "../../assets/card-reference-layers/stat/orange/border-highlight-layer.png";
import statOrangeWell from "../../assets/card-reference-layers/stat/orange/icon-well-glow-layer.png";
import statOrangeGlyph from "../../assets/card-reference-layers/stat/orange/icon-glyph-layer.png";

import actionCyanSurface from "../../assets/card-reference-layers/action/cyan/surface-clean.png";
import actionCyanTexture from "../../assets/card-reference-layers/action/cyan/texture-overlay.png";
import actionCyanBorder from "../../assets/card-reference-layers/action/cyan/border-highlight-layer.png";
import actionCyanWell from "../../assets/card-reference-layers/action/cyan/icon-well-glow-layer.png";
import actionCyanGlyph from "../../assets/card-reference-layers/action/cyan/icon-glyph-layer.png";
import actionGreenSurface from "../../assets/card-reference-layers/action/green/surface-clean.png";
import actionGreenTexture from "../../assets/card-reference-layers/action/green/texture-overlay.png";
import actionGreenBorder from "../../assets/card-reference-layers/action/green/border-highlight-layer.png";
import actionGreenWell from "../../assets/card-reference-layers/action/green/icon-well-glow-layer.png";
import actionGreenGlyph from "../../assets/card-reference-layers/action/green/icon-glyph-layer.png";
import actionPurpleSurface from "../../assets/card-reference-layers/action/purple/surface-clean.png";
import actionPurpleTexture from "../../assets/card-reference-layers/action/purple/texture-overlay.png";
import actionPurpleBorder from "../../assets/card-reference-layers/action/purple/border-highlight-layer.png";
import actionPurpleWell from "../../assets/card-reference-layers/action/purple/icon-well-glow-layer.png";
import actionPurpleGlyph from "../../assets/card-reference-layers/action/purple/icon-glyph-layer.png";
import actionOrangeSurface from "../../assets/card-reference-layers/action/orange/surface-clean.png";
import actionOrangeTexture from "../../assets/card-reference-layers/action/orange/texture-overlay.png";
import actionOrangeBorder from "../../assets/card-reference-layers/action/orange/border-highlight-layer.png";
import actionOrangeWell from "../../assets/card-reference-layers/action/orange/icon-well-glow-layer.png";
import actionOrangeGlyph from "../../assets/card-reference-layers/action/orange/icon-glyph-layer.png";
import actionPinkSurface from "../../assets/card-reference-layers/action/pink/surface-clean.png";
import actionPinkTexture from "../../assets/card-reference-layers/action/pink/texture-overlay.png";
import actionPinkBorder from "../../assets/card-reference-layers/action/pink/border-highlight-layer.png";
import actionPinkWell from "../../assets/card-reference-layers/action/pink/icon-well-glow-layer.png";
import actionPinkGlyph from "../../assets/card-reference-layers/action/pink/icon-glyph-layer.png";
import actionBlueSurface from "../../assets/card-reference-layers/action/blue/surface-clean.png";
import actionBlueTexture from "../../assets/card-reference-layers/action/blue/texture-overlay.png";
import actionBlueBorder from "../../assets/card-reference-layers/action/blue/border-highlight-layer.png";
import actionBlueWell from "../../assets/card-reference-layers/action/blue/icon-well-glow-layer.png";
import actionBlueGlyph from "../../assets/card-reference-layers/action/blue/icon-glyph-layer.png";

export type ReferenceStatTone = "cyan" | "green" | "purple" | "orange";
export type ReferenceActionTone =
  | "cyan"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "blue";

export const statLayerAssets = {
  cyan: {
    surface: statCyanSurface,
    texture: statCyanTexture,
    border: statCyanBorder,
    well: statCyanWell,
    glyph: statCyanGlyph,
  },
  green: {
    surface: statGreenSurface,
    texture: statGreenTexture,
    border: statGreenBorder,
    well: statGreenWell,
    glyph: statGreenGlyph,
  },
  purple: {
    surface: statPurpleSurface,
    texture: statPurpleTexture,
    border: statPurpleBorder,
    well: statPurpleWell,
    glyph: statPurpleGlyph,
  },
  orange: {
    surface: statOrangeSurface,
    texture: statOrangeTexture,
    border: statOrangeBorder,
    well: statOrangeWell,
    glyph: statOrangeGlyph,
  }
} as const;

export const actionLayerAssets = {
  cyan: {
    surface: actionCyanSurface,
    texture: actionCyanTexture,
    border: actionCyanBorder,
    well: actionCyanWell,
    glyph: actionCyanGlyph,
  },
  green: {
    surface: actionGreenSurface,
    texture: actionGreenTexture,
    border: actionGreenBorder,
    well: actionGreenWell,
    glyph: actionGreenGlyph,
  },
  purple: {
    surface: actionPurpleSurface,
    texture: actionPurpleTexture,
    border: actionPurpleBorder,
    well: actionPurpleWell,
    glyph: actionPurpleGlyph,
  },
  orange: {
    surface: actionOrangeSurface,
    texture: actionOrangeTexture,
    border: actionOrangeBorder,
    well: actionOrangeWell,
    glyph: actionOrangeGlyph,
  },
  pink: {
    surface: actionPinkSurface,
    texture: actionPinkTexture,
    border: actionPinkBorder,
    well: actionPinkWell,
    glyph: actionPinkGlyph,
  },
  blue: {
    surface: actionBlueSurface,
    texture: actionBlueTexture,
    border: actionBlueBorder,
    well: actionBlueWell,
    glyph: actionBlueGlyph,
  }
} as const;
