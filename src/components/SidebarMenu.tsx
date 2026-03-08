import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  submenu?: MenuItemConfig[];
  onClick?: () => void;
}

interface SidebarMenuProps {
  items: MenuItemConfig[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  className?: string;
}

export function SidebarMenu({ items, activeItem, onItemClick, className = '' }: SidebarMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleItemClick = (item: MenuItemConfig) => {
    if (item.submenu) {
      toggleExpand(item.id, new MouseEvent('click') as any);
    } else {
      onItemClick(item.id);
      if (item.onClick) item.onClick();
    }
  };

  const renderMenuItem = (item: MenuItemConfig, depth: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
            ${isActive 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }
            ${'ml-' + depth * 4}
          `}
        >
          <Icon size={20} />
          <span className="flex-1 text-left">{item.label}</span>
          {hasSubmenu && (
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {hasSubmenu && isExpanded && (
          <div className="space-y-1 mt-1">
            {item.submenu!.map((subitem) => renderMenuItem(subitem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => renderMenuItem(item))}
    </nav>
  );
}
