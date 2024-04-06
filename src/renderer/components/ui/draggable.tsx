import React from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";

type FunctionChildren<T> = (args: T) => React.ReactNode;

export type DraggableProps<T = unknown> = {
  type: string;
  children: React.ReactNode | FunctionChildren<{ isDragging: boolean }>;
  canDrag?: boolean | ((monitor: DragSourceMonitor) => boolean);
  asChild?: boolean;
  data?: T;
};

export enum DraggableTypes {
  ASSET = "asset",
}

function Draggable<T = unknown>({
  type,
  canDrag = true,
  asChild = false,
  children,
  data,
}: DraggableProps<T>) {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type,
    canDrag,
    item: { type, data },
    end(draggedItem, monitor) {
      console.log({
        didDrop: monitor.didDrop(),
        dropResult: monitor.getDropResult(),
      });
      if (monitor.didDrop()) {
        alert("Dropped on target!");
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  });

  const theChildren =
    typeof children === "function" ? children({ isDragging }) : children;

  if (asChild) {
    return React.cloneElement(theChildren as React.ReactElement, {
      ref: dragRef,
      ...((children as React.ReactElement)?.props ?? {}),
    });
  }

  return <div ref={dragRef}>{theChildren}</div>;
}

Draggable.displayName = "Draggable";

export { Draggable };
