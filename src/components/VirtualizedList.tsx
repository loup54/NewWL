
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Keyword } from '@/types';
import { LineItem } from './VirtualizedLineItem';

interface VirtualizedListProps {
  lines: string[];
  keywords: Keyword[];
  highlightEnabled: boolean;
  caseSensitive: boolean;
  searchQuery: string;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  lines,
  keywords,
  highlightEnabled,
  caseSensitive,
  searchQuery
}) => {
  return (
    <div className="flex-1">
      <List
        height={600}
        width="100%"
        itemCount={lines.length}
        itemSize={32}
        itemData={{
          lines,
          keywords,
          highlightEnabled,
          caseSensitive,
          searchQuery
        }}
      >
        {LineItem}
      </List>
    </div>
  );
};
