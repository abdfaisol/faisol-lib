"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Shield,
  Search,
  X,
} from "lucide-react";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  name: string;
  label: string;
}

interface Menu {
  id: string;
  name: string;
  label: string;
  parent_id: string | null;
  permissions?: Permission[];
  children?: Menu[];
}

interface PermissionTreeProps {
  data: any[];
  selectedPermissions: string[];
  onChange: (selected: string[]) => void;
}

export const PermissionTree: React.FC<PermissionTreeProps> = ({
  data,
  selectedPermissions,
  onChange,
}) => {
  const [treeData, setTreeData] = useState<Menu[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  // Build tree from flat data if necessary
  useEffect(() => {
    const buildTree = (
      nodes: any[],
      parentId: string | null = null
    ): Menu[] => {
      return nodes
        .filter((node) => node.parent_id === parentId)
        .map((node) => ({
          ...node,
          children: buildTree(nodes, node.id),
        }));
    };

    const hasChildren = data.some((d) => d.children && d.children.length > 0);
    const built = hasChildren ? data : buildTree(data);

    setTreeData(built);

    // Default expand all
    const initialExpanded: Record<string, boolean> = {};
    const traverse = (nodes: Menu[]) => {
      nodes.forEach((node) => {
        initialExpanded[node.id] = true;
        if (node.children) traverse(node.children);
      });
    };
    traverse(built);
    setExpandedNodes(initialExpanded);
  }, [data]);

  // Filtering logic for search
  const filteredData = useMemo(() => {
    if (!searchTerm) return treeData;

    const filterNodes = (nodes: Menu[]): Menu[] => {
      return nodes.flatMap((node) => {
        const matchedPermissions = (node.permissions || []).filter(
          (p) =>
            p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filteredChildren = filterNodes(node.children || []);

        const isMatch =
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matchedPermissions.length > 0 ||
          filteredChildren.length > 0;

        if (isMatch) {
          return [
            {
              ...node,
              children: filteredChildren,
              permissions: node.permissions, // Keep all permissions of matched menu for context
            },
          ];
        }
        return [];
      });
    };

    return filterNodes(treeData);
  }, [treeData, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAllPermissionIds = (node: Menu): string[] => {
    let ids = node.permissions?.map((p) => p.id) || [];
    node.children?.forEach((child) => {
      ids = [...ids, ...getAllPermissionIds(child)];
    });
    return ids;
  };

  const handleToggleMenu = (node: Menu, checked: boolean) => {
    const allIds = getAllPermissionIds(node);
    let newSelected = [...selectedPermissions];

    if (checked) {
      // Add all missing ones
      allIds.forEach((id) => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
    } else {
      // Remove all
      newSelected = newSelected.filter((id) => !allIds.includes(id));
    }
    onChange(newSelected);
  };

  const handleTogglePermission = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, id]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== id));
    }
  };

  const isMenuChecked = (node: Menu): boolean | "indeterminate" => {
    const allIds = getAllPermissionIds(node);
    if (allIds.length === 0) return false;

    const count = allIds.filter((id) =>
      selectedPermissions.includes(id)
    ).length;
    if (count === 0) return false;
    if (count === allIds.length) return true;
    return "indeterminate";
  };

  const renderNode = (node: Menu, level: number = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren =
      (node.children && node.children.length > 0) ||
      (node.permissions && node.permissions.length > 0);
    const menuCheckStatus = isMenuChecked(node);

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={cn(
            "flex items-center py-2 px-3 hover:bg-gray-50 rounded-md transition-colors border-b border-gray-100 last:border-0",
            level === 0 ? "bg-gray-50/50 mb-1" : ""
          )}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          <div className="flex items-center flex-grow gap-3">
            <div
              onClick={() => toggleExpand(node.id)}
              className="cursor-pointer text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center shrink-0"
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )
              ) : null}
            </div>

            <div className="flex items-center h-5">
              <Checkbox
                id={`menu-${node.id}`}
                checked={menuCheckStatus === true}
                // @ts-ignore
                indeterminate={menuCheckStatus === "indeterminate"}
                onCheckedChange={(checked) => handleToggleMenu(node, !!checked)}
              />
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => toggleExpand(node.id)}
            >
              <Folder size={18} className="text-blue-500 fill-blue-50" />
              <span
                className={cn(
                  "text-sm",
                  level === 0
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-700"
                )}
              >
                {node.label || node.name}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-col">
            {/* Render Permissions */}
            {node.permissions && node.permissions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-3 px-4 bg-white border-x border-b border-gray-50 rounded-b-md mb-2 ml-[2.5rem]">
                {node.permissions.map((perm) => {
                  const isVisible =
                    !searchTerm ||
                    perm.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    perm.name.toLowerCase().includes(searchTerm.toLowerCase());

                  if (!isVisible && searchTerm) return null;

                  return (
                    <div
                      key={perm.id}
                      className="flex items-start gap-3 p-2 rounded hover:bg-blue-50 transition-colors "
                    >
                      <div className="flex items-center h-5">
                        <Checkbox
                          id={perm.id}
                          checked={selectedPermissions.includes(perm.id)}
                          onCheckedChange={(checked) =>
                            handleTogglePermission(perm.id, !!checked)
                          }
                        />
                      </div>
                      <label
                        htmlFor={perm.id}
                        className="text-xs font-medium text-gray-600 group-hover:text-blue-700 cursor-pointer flex items-center gap-1.5 min-h-[1.25rem]"
                      >
                        <Shield
                          size={14}
                          className="text-gray-400 group-hover:text-blue-400 shrink-0"
                        />
                        <span className="leading-tight">
                          {perm.label || perm.name}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Render Children */}
            {node.children &&
              node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Assign Permissions
          </h3>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {selectedPermissions.length} Permissions Selected
          </span>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search menu or permission..."
            className="w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow bg-gray-50/20 overflow-y-auto">
        {filteredData.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {filteredData.map((node) => renderNode(node, 0))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full">
              <Search size={32} className="opacity-20" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">No results found</p>
              <p className="text-sm">
                We couldn't find any menu or permission matching "{searchTerm}"
              </p>
            </div>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-primary text-sm font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
