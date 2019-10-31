// Type definitions for react-beautiful-dnd 12.0
// Project: https://github.com/atlassian/react-beautiful-dnd
// Definitions by: varHarrie <https://github.com/varHarrie>
//                 Bradley Ayers <https://github.com/bradleyayers>
//                 Austin Turner <https://github.com/paustint>
//                 Mark Nelissen <https://github.com/marknelissen>
//                 Enrico Boccadifuoco <https://github.com/enricoboccadifuoco>
//                 Taeheon Kim <https://github.com/lonyele>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
//                 Christopher Manouvrier <https://github.com/cmanou>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import * as React from 'react';
import { BoxModel, Rect, Position } from 'css-box-model';

// Components

export type Responders = {
    onBeforeDragStart?: OnBeforeDragStartResponder;
    onDragStart?: OnDragStartResponder;
    onDragUpdate?: OnDragUpdateResponder;
    // always required
    onDragEnd: OnDragEndResponder;
};
export type DragDropContextProps = Responders & {
    // We do not technically need any children for this component
    children: React.ReactElement<HTMLElement> | null;
    // Read out by screen readers when focusing on a drag handle
    liftInstruction?: string;
    // Used for strict content security policies
    // See our [content security policy guide](/docs/guides/content-security-policy.md)
    nonce?: string;
    // See our [sensor api](/docs/sensors/sensor-api.md)
    sensors?: Sensor[];
    enableDefaultSensors?: boolean | null | undefined;
};

export class DragDropContext extends React.Component<DragDropContextProps> {}

export type Placeholder = {
    client: BoxModel;
    tagName: string;
    display: string;
};

export type UseClone = {
    dragging: DraggableRubric;
    render: DraggableChildrenFn;
};

export type UpdateViewportMaxScrollArgs = {
    maxScroll: Position;
};

type UpdateViewportMaxScrollAction = {
    type: 'UPDATE_VIEWPORT_MAX_SCROLL';
    payload: UpdateViewportMaxScrollArgs;
};

export type UpdateViewportMaxScrollFn = (args: UpdateViewportMaxScrollArgs) => UpdateViewportMaxScrollAction;

export type DroppableProps = {
    droppableId: DroppableId;

    placeholder?: Placeholder | null | undefined;
    shouldAnimatePlaceholder?: boolean;
    snapshot?: DroppableStateSnapshot;
    useClone?: UseClone | null | undefined;
    mode?: DroppableMode;
    type?: TypeId;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: Direction;
    ignoreContainerClipping?: boolean;
    getContainerForClone?: () => HTMLElement;
    updateViewportMaxScroll?: UpdateViewportMaxScrollFn;
    renderClone?: DraggableChildrenFn | null | undefined;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement<HTMLElement>;
};

export class Droppable extends React.Component<DroppableProps> {}

export type DraggableProps = {
    draggableId: DraggableId;
    index: number;
    children: DraggableChildrenFn;

    // optional own props
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
};
export class Draggable extends React.Component<DraggableProps> {}

// Utils

export function resetServerContext(): void;

// Public types
export type Id = string;
export type ContextId = Id;
export type DraggableId = Id;
export type DroppableId = Id;
export type DropReason = 'DROP' | 'CANCEL';
export type Direction = 'horizontal' | 'vertical';
export type MovementMode = 'FLUID' | 'SNAP';
export type DroppableMode = 'standard' | 'virtual';
export type TypeId = Id;
export type ElementId = Id;

export type DraggableRubric = {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
};

export type DragStart = DraggableRubric & {
    mode: MovementMode;
};

export type DragUpdate = DragStart & {
    // may not have any destination (drag to nowhere)
    destination: DraggableLocation | null | undefined;
    // populated when a draggable is dragging over another in combine mode
    combine: Combine | null | undefined;
};

export type Combine = {
    draggableId: DraggableId;
    droppableId: DroppableId;
};

export type DropResult = DragUpdate & {
    reason: DropReason;
};

export type ResponderProvided = {
    announce: Announce;
};

export type Announce = (message: string) => void;

export type DraggableLocation = {
    droppableId: DroppableId;
    index: number;
};

export type OnBeforeDragStartResponder = (start: DragStart) => unknown;
export type OnDragStartResponder = (start: DragStart, provided: ResponderProvided) => unknown;
export type OnDragUpdateResponder = (update: DragUpdate, provided: ResponderProvided) => unknown;
export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => unknown;

export type TryGetLockOptions = {
    sourceEvent?: Event;
};

export type TryGetLock = (
    draggableId: DraggableId,
    forceStop?: () => void,
    options?: TryGetLockOptions,
) => PreDragActions | null | undefined;

export type PreDragActions = {
    // discover if the lock is still active
    isActive: () => boolean;
    // whether it has been indicated if force press should be respected
    shouldRespectForcePress: () => boolean;
    // lift the current item
    fluidLift: (clientSelection: Position) => FluidDragActions;
    snapLift: () => SnapDragActions;
    // cancel the pre drag without starting a drag. Releases the lock
    abort: () => void;
};

export type SensorAPI = {
    tryGetLock: TryGetLock;
    canGetLock: (id: DraggableId) => boolean;
    isLockClaimed: () => boolean;
    tryReleaseLock: () => void;
    findClosestDraggableId: (event: Event) => DraggableId | null | undefined;
    findOptionsForDraggable: (id: DraggableId) => DraggableOptions | null | undefined;
};

export type Sensor = (api: SensorAPI) => void;

export type StopDragOptions = {
    shouldBlockNextClick: boolean;
};

type DragActions = {
    drop: (args?: StopDragOptions) => void;
    cancel: (args?: StopDragOptions) => void;
    isActive: () => boolean;
    shouldRespectForcePress: () => boolean;
};

export type FluidDragActions = DragActions & {
    move: (clientSelection: Position) => void;
};

export type DraggableOptions = {
    canDragInteractiveElements: boolean;
    shouldRespectForcePress: boolean;
    isEnabled: boolean;
};

export type SnapDragActions = DragActions & {
    moveUp: () => void;
    moveDown: () => void;
    moveRight: () => void;
    moveLeft: () => void;
};

// Droppable types
export type DroppableProvidedProps = {
    // used for shared global styles
    'data-rbd-droppable-context-id': ContextId;
    // Used to lookup. Currently not used for drag and drop lifecycle
    'data-rbd-droppable-id': DroppableId;
};

export type DroppableProvided = {
    innerRef: (ref: HTMLElement | null | undefined) => void;
    placeholder: React.ReactElement<HTMLElement> | null | undefined;
    droppableProps: DroppableProvidedProps;
};

export type DroppableStateSnapshot = {
    // Is the Droppable being dragged over?
    isDraggingOver: boolean;
    // What is the id of the draggable that is dragging over the Droppable?
    draggingOverWith: DraggableId | null | undefined;
    // What is the id of the draggable that is dragging from this list?
    // Useful for styling the home list when not being dragged over
    draggingFromThisWith: DraggableId | null | undefined;
    // Whether or not the placeholder is actively being used.
    // This is useful information when working with virtual lists
    isUsingPlaceholder: boolean;
};

// Draggable types
export type DraggableProvided = {
    draggableProps: DraggableProvidedProps;
    // will be null if the draggable is disabled
    dragHandleProps: DragHandleProps | null | undefined;
    // The following props will be removed once we move to react 16
    innerRef: (ref: HTMLElement | null | undefined) => void;
};

export type DraggableStateSnapshot = {
    isDragging: boolean;
    isDropAnimating: boolean;
    isClone: boolean;
    dropAnimation: DropAnimation | null | undefined;
    draggingOver: DroppableId | null | undefined;
    combineWith: DraggableId | null | undefined;
    combineTargetFor: DraggableId | null | undefined;
    mode: MovementMode | null | undefined;
};

export type DragHandleProps = {
    // what draggable the handle belongs to
    'data-rbd-drag-handle-draggable-id': DraggableId;

    // What DragDropContext the drag handle is in
    'data-rbd-drag-handle-context-id': ContextId;

    // id of drag handle aria description for screen readers
    'aria-labelledby': ElementId;

    // Allow tabbing to this element
    tabIndex: number;

    // Stop html5 drag and drop
    draggable: boolean;
    onDragStart: (event: DragEvent<HTMLDivElement>) => void;
};

export type DropAnimation = {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity: number | null | undefined;
    scale: number | null | undefined;
};

export type DraggableProvidedProps = {
    // inline style
    style: DraggableStyle | null | undefined;
    // used for shared global styles
    'data-rbd-draggable-context-id': ContextId;
    // used for lookups
    'data-rbd-draggable-id': DraggableId;
    // used to know when a transition ends
    onTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
};

export type DraggingStyle = {
    position: 'fixed';
    top: number;
    left: number;
    boxSizing: 'border-box';
    width: number;
    height: number;
    transition: string;
    transform: string | null | undefined;
    zIndex: number;

    // for combining
    opacity: number | null | undefined;

    // Avoiding any processing of mouse events.
    // This is already applied by the shared styles during a drag.
    // During a drop it prevents a draggable from being dragged.
    // canStartDrag() will prevent drags in some cases for non primary draggable.
    // It is also a minor performance optimisation
    pointerEvents: 'none';
};

export type NotDraggingStyle = {
    transform: string | null | undefined;
    // null: use the global animation style
    // none: skip animation (used in certain displacement situations)
    transition: null | 'none';
};

export type DraggableStyle = DraggingStyle | NotDraggingStyle;

export type DraggableChildrenFn = (
    provided: DraggableProvided,
    stateSnapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
) => React.ReactElement<HTMLElement> | null;
