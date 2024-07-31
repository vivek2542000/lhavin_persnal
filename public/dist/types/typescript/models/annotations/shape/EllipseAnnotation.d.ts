import ShapeAnnotation from '../ShapeAnnotation';
import { Inset } from '../../geometry';
import { AnnotationCtorProps } from '../Annotation';
declare type EllipseCtorProps = AnnotationCtorProps & {
    cloudyBorderIntensity?: number;
    cloudyBorderInset?: Inset;
    strokeWidth?: number;
};
declare class EllipseAnnotation extends ShapeAnnotation {
    cloudyBorderIntensity: number;
    cloudyBorderInset: Inset | null | undefined;
    static defaultValues: any;
    static readableName: string;
    constructor(args?: EllipseCtorProps);
}
export default EllipseAnnotation;
