export function getObjectBounds(object: {
  getGlobalPosition: () => { x: number; y: number };
  width: number;
  height: number;
  isDisabled?: boolean;
}) {
  const position = object.getGlobalPosition();

  return {
    x: position.x,
    y: position.y,
    width: object.width,
    height: object.height,
    isDisabled: object.isDisabled,
  };
}
