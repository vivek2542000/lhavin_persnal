import { InheritableImmutableRecord } from '../../lib/InheritableImmutableRecord';
import { List } from "../../../immutable/dist/immutable-nonambient";
import Point from './Point';
import Size from './Size';
import TransformationMatrix from './TransformationMatrix';
declare class Rect extends InheritableImmutableRecord {
    left: number;
    top: number;
    width: number;
    height: number;
    static defaultValues: any;
    constructor(args?: {
        left?: number;
        top?: number;
        width?: number;
        height?: number;
    });
    get right(): number;
    get bottom(): number;
    static fromClientRect({ top, left, width, height }: ClientRect): Rect;
    static union(rects: List<Rect>): Rect;
    translate({ x: tx, y: ty }: Point): Rect;
    translateX(tx: number): Rect;
    translateY(ty: number): Rect;
    scale(sx: number, sy?: number): Rect;
    grow(growth: number): Rect;
    getLocation(): Point;
    getSize(): Size;
    getCenter(): Point;
    setLocation(location: Point): Rect;
    roundOverlap(): Rect;
    round(): Rect;
    isPointInside(point: Point): boolean;
    isRectInside(other: Rect): boolean;
    isRectOverlapping(other: Rect): boolean;
    normalize(): Rect;
    apply(matrix: TransformationMatrix): Rect;
}
export default Rect;
