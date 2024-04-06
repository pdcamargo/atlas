import React, { useMemo } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";

type FunctionChildren<T> = (args: T) => React.ReactNode;

export type DroppableProps<T = unknown> = {
  accept: string[] | string;
  children:
    | React.ReactNode
    | FunctionChildren<{ isOver: boolean; canDrop: boolean }>;
  canDrop?: (
    item: {
      type: string;
      data?: any;
    },
    monitor: DropTargetMonitor
  ) => boolean;
  asChild?: boolean;
  data?: T;
  onDrop?: (item: { type: string; data?: any }) => void;
};

function Droppable<T = unknown>({
  accept,
  canDrop,
  asChild = false,
  children,
  data,
  onDrop,
}: DroppableProps<T>) {
  const [{ isOver, canDrop: canDropInternal }, dropRef] = useDrop(
    {
      accept,
      canDrop,
      drop: (item, monitor) => {
        console.log({
          type: "Dropped!",
          didDrop: monitor.didDrop(),
          dropResult: monitor.getDropResult(),
        });

        if (onDrop) {
          onDrop(item);
        }

        return { accept, data };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    },
    []
  );

  const theChildren = useMemo(
    () =>
      typeof children === "function"
        ? children({ isOver, canDrop: canDropInternal })
        : children,
    [children, isOver, canDropInternal]
  );

  if (asChild) {
    return React.cloneElement(theChildren as React.ReactElement, {
      ref: dropRef,
      ...((children as React.ReactElement)?.props ?? {}),
    });
  }

  return <div ref={dropRef}>{theChildren}</div>;
}

Droppable.displayName = "Droppable";

export { Droppable };
