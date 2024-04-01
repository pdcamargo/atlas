import React, { useCallback, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import useControlledValue from "../hooks/useControlledValue";
import { cn } from "@/utils";
import { DynamicContextMenu, DynamicContextMenuItem } from "./context-menu";
import { SerializedProperty } from "@atlas/editor";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

export interface TreeNode<T = any> {
  id: string;
  label:
    | string
    | React.ReactNode
    | SerializedProperty
    | {
        text: string | React.ReactNode | SerializedProperty;
        icon?: React.ReactNode;
      };
  data?: T;
  children?: TreeNode[];
}

type TreeViewContextType<T = any> = {
  selectedIds: Set<string>;
  onSelectIdsChange:
    | ((selectedIds: Set<string>) => void)
    | ((prev: Set<string>) => Set<string>);
  expandedIds: Set<string>;
  onExpandesIdsChange:
    | ((expandedIds: Set<string>) => void)
    | ((prev: Set<string>) => Set<string>);

  collapse: (id: string) => void;
  expand: (id: string) => void;
  deselect: (id: string) => void;
  select: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;

  getContextMenu?: (node: TreeNode<T>) => DynamicContextMenuItem[] | null;
};

type OmitFromContext =
  | "collapse"
  | "expand"
  | "deselect"
  | "select"
  | "collapseAll"
  | "expandAll";

type TreeViewProps<T = any> = {
  nodes: TreeNode<T>[];
  level?: number;
  defaultExpandedIds?: Set<string>;
  defaultSelectedIds?: Set<string>;
  className?: string;
} & Omit<Partial<TreeViewContextType<T>>, OmitFromContext>;

const TreeViewContext = React.createContext<TreeViewContextType>({} as any);

function TreeViewComponent<T = any>({
  nodes,
  level = 0,
  expandedIds: controlledExpandedIds,
  selectedIds: controlledSelectedIds,
  defaultExpandedIds,
  defaultSelectedIds,
  onExpandesIdsChange,
  onSelectIdsChange,
  getContextMenu,
  className,
}: TreeViewProps<T>) {
  const [expandedIds, setExpandedIds] = useControlledValue<Set<string>>({
    controlledValue: controlledExpandedIds,
    defaultValue: defaultExpandedIds || new Set(),
    onChange: onExpandesIdsChange,
  });
  const [selectedIds, setSelectedIds] = useControlledValue<Set<string>>({
    controlledValue: controlledSelectedIds,
    defaultValue: defaultSelectedIds || new Set(),
    onChange: onSelectIdsChange,
  });

  const contextValue: TreeViewContextType<T> = useMemo(
    () => ({
      expandedIds: expandedIds || new Set(),
      onExpandesIdsChange: setExpandedIds,
      onSelectIdsChange: setSelectedIds,
      selectedIds,
      collapse: (id: string) =>
        setExpandedIds((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        }),
      collapseAll: () => setExpandedIds(new Set()),
      deselect: (id: string) =>
        setSelectedIds((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        }),
      expand: (id: string) => setExpandedIds((prev) => new Set(prev).add(id)),
      expandAll: () => setExpandedIds(new Set(nodes.map((node) => node.id))),
      select: (id: string) => setSelectedIds(new Set([id])),
      getContextMenu,
    }),
    [expandedIds, selectedIds, setExpandedIds, setSelectedIds, getContextMenu]
  );

  return (
    <TreeViewContext.Provider value={contextValue}>
      <div className={cn("tree-view h-full overflow-auto", className)}>
        {nodes.map((node) => (
          <TreeNode key={node.id} node={node} level={level} />
        ))}
      </div>
    </TreeViewContext.Provider>
  );
}

const TreeView = observer(TreeViewComponent);

const TreeNode = observer(
  ({ node, level }: { node: TreeNode; level: number }) => {
    const context = React.useContext(TreeViewContext);
    const isExpanded = context.expandedIds.has(node.id);
    const isSelected = context.selectedIds.has(node.id);
    const contextMenuItems = context.getContextMenu?.(node);
    const hasContextMenu = !!contextMenuItems && contextMenuItems.length > 0;

    const handleSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (
        e.target === e.currentTarget || // or contains
        (e.target instanceof HTMLElement &&
          e.target.closest(".tree-view-node-title-container"))
      ) {
        context.select(node.id);
      }
    };

    const handleExpand = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (!(e.target === e.currentTarget)) {
        return;
      }

      if (isExpanded) {
        context.collapse(node.id);
      } else {
        context.expand(node.id);
      }
    };

    const title = useMemo(() => {
      if (typeof node.label === "string") {
        return node.label;
      }

      if (node.label instanceof SerializedProperty) {
        return node.label.stringValue;
      }

      if (
        node.label &&
        typeof node.label === "object" &&
        "text" in node.label
      ) {
        return (
          <>
            {node.label.icon && (
              <span className="tree-view-node-icon">{node.label.icon}</span>
            )}
            <span>
              {node.label.text instanceof SerializedProperty
                ? node.label.text.stringValue
                : node.label.text}
            </span>
          </>
        );
      }

      return node.label;
    }, [node.label]);

    const Wrapper = useCallback(
      observer(({ children }: { children: React.ReactNode }) => {
        if (hasContextMenu) {
          return (
            <DynamicContextMenu menuItems={contextMenuItems!}>
              {children}
            </DynamicContextMenu>
          );
        }

        return <>{children}</>;
      }),
      [contextMenuItems, hasContextMenu]
    );

    return (
      <div
        className={cn("tree-view-node", {
          "has-children": node.children && node.children.length > 0,
        })}
        data-selected={isSelected}
        data-expanded={isExpanded}
        data-level={level}
        style={
          {
            "--level": level,
          } as React.CSSProperties
        }
      >
        <Wrapper>
          <div
            className="tree-view-node-title-container"
            data-expanded={isExpanded}
            data-selected={isSelected}
            onClick={handleSelect}
          >
            {node.children && node.children.length > 0 ? (
              <ChevronRight
                onClick={handleExpand}
                className="tree-view-node-chevron"
                data-expanded={isExpanded}
              />
            ) : (
              <div className="tree-view-node-chevron" />
            )}

            <span className="tree-view-node-title">{title}</span>
          </div>
        </Wrapper>

        {node.children && isExpanded && (
          <div className="tree-view-node-children">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

export { TreeView };
