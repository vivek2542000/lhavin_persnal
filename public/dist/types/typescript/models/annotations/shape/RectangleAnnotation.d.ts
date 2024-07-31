import ShapeAnnotation from '../ShapeAnnotation';
import { Inset } from '../../geometry';
import { AnnotationCtorProps } from '../Annotation';
declare type RectangleCtorProps = AnnotationCtorProps & {
    cloudyBorderIntensity?: number;
    cloudyBorderInset?: Inset;
    strokeWidth?: number;
};
declare class RectangleAnnotation extends ShapeAnnotation {
    cloudyBorderIntensity: number;
    cloudyBorderInset: Inset | null | undefined;
    static defaultValues: any;
    static readableName: string;
    constructor(args?: RectangleCtorProps);
}
export default RectangleAnnotation;
