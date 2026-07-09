/** Wrapper for data needed to create an `ImageOverlay`. */
export class ImageDraggableMetadata {
  public imageBase64: string;
  public scaledSize: [number, number];
  public offsetToAncestor: [number, number];
  public draggableTopLeft: [number, number];
  public draggableBottomRight: [number, number];
  public applyToAllPages: boolean;

  constructor(
    imageBase64: string,
    scaledSize: [number, number],
    offsetToAncestor: [number, number],
    draggableTopLeft: [number, number],
    draggableBottomRight: [number, number],
    applyToAllPages: boolean = false
  ) {
    this.imageBase64 = imageBase64;
    this.scaledSize = scaledSize;
    this.offsetToAncestor = offsetToAncestor;
    this.draggableTopLeft = draggableTopLeft;
    this.draggableBottomRight = draggableBottomRight;
    this.applyToAllPages = applyToAllPages;
  }
}
