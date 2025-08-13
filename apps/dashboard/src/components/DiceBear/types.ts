export enum DiceBearVariant {
  AVATAAARS_NEUTRAL = 'avataaars-neutral',
  BOTTTS = 'bottts',
  BOTTTS_NEAUTRAL = 'bottts-neutral',
  BIG_EARS = 'big-ears',
  DYLAN = 'dylan',
  ICONS = 'icons',
  IDENTICON = 'identicon',
  PIXEL_ART = 'pixel-art',
  THUMBS = 'thumbs',
}
export type DiceBearProps = {
  seed: string;
  variant?: DiceBearVariant;
};
