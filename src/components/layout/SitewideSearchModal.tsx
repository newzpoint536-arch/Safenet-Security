import React from 'react';
import { SiteSearch, SiteSearchProps } from './SiteSearch';

export type { SearchCategoryFilter, SearchResultItem } from './SiteSearch';

export interface SitewideSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SitewideSearchModal: React.FC<SitewideSearchModalProps> = ({ isOpen, onClose }) => {
  return (
    <SiteSearch 
      variant="modal-only" 
      isOpen={isOpen} 
      onClose={onClose} 
    />
  );
};

export default SitewideSearchModal;
