import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DragStart,
    DragUpdate,
    ResponderProvided,
    DroppableStateSnapshot,
    resetServerContext,
} from 'react-beautiful-dnd';

interface Item {
    id: string;
    content: string;
}

const getItems = (count: number): Item[] => {
    return Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));
};

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle,
});

const getListStyle = (snapshot: DroppableStateSnapshot) => ({
    background: snapshot.draggingFromThisWith ? 'lightpink' : snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
    width: 250,
});

interface AppState {
    items: Item[];
}

class App extends React.Component<{}, AppState> {
    state = {
        items: getItems(10),
    };
    constructor(props: any) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onBeforeDragStart(dragStart: DragStart) {
        //
    }

    onDragStart(dragStart: DragStart, provided: ResponderProvided) {
        //
    }

    onDragUpdate(dragUpdate: DragUpdate, provided: ResponderProvided) {
        //
    }

    onDragEnd(result: DropResult, provided: ResponderProvided) {
        if (result.combine) {
            // super simple: just removing the dragging item
            const items: Item[] = [...this.state.items];
            items.splice(result.source.index, 1);
            this.setState({ items });
            return;
        }

        if (!result.destination) {
            return;
        }

        const items = reorder(this.state.items, result.source.index, result.destination.index);

        this.setState({ items });
    }

    render() {
        return (
            <DragDropContext
                onBeforeDragStart={this.onBeforeDragStart}
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
            >
                <Droppable droppableId="droppable" ignoreContainerClipping={false} isCombineEnabled>
                    {(droppableProvided, droppableSnapshot) => (
                        <div ref={droppableProvided.innerRef} style={getListStyle(droppableSnapshot)}>
                            {this.state.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index} shouldRespectForcePress>
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                            style={getItemStyle(
                                                draggableSnapshot.isDragging,
                                                draggableProvided.draggableProps.style,
                                            )}
                                        >
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

resetServerContext();
