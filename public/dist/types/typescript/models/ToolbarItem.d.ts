import { $Diff } from "../../utility-types/dist/index";
import { ToolItemType, ToolItem } from './ToolItem';
import { AnnotationPresetID } from './AnnotationPreset';
export declare type DefaultToolbarItemType = 'pager' | 'layout-config' | 'pan' | 'zoom-out' | 'zoom-in' | 'zoom-mode' | 'marquee-zoom' | 'spacer' | 'text' | 'annotate' | 'responsive-group' | 'ink' | 'image' | 'line' | 'arrow' | 'rectangle' | 'ellipse' | 'polygon' | 'polyline' | 'note' | 'print' | 'search' | 'debug' | 'sidebar-thumbnails' | 'ink-signature' | 'comment' | 'sidebar-document-outline' | 'sidebar-annotations' | 'sidebar-bookmarks' | 'highlighter' | 'text-highlighter' | 'ink-eraser' | 'stamp' | 'document-editor';
export declare type BuiltInToolbarItemType = DefaultToolbarItemType | 'layout-config' | 'marquee-zoom' | 'comment' | 'redact-text-highlighter' | 'redact-rectangle';
declare type ToolbarItemType = ToolItemType | BuiltInToolbarItemType;
export declare type ToolbarItem = $Diff<ToolItem, {
    type: ToolItemType;
}> & {
    type: ToolbarItemType;
    mediaQueries?: string[];
    responsiveGroup?: string;
    dropdownGroup?: string;
    preset?: AnnotationPresetID;
};
export declare const validate: (item: ToolbarItem) => void;
export {};
