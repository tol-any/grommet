import * as React from 'react';
import { BasicSelectProps } from '../Select';

export interface SelectMultipleProps extends BasicSelectProps {
  defaultValue?: (string | number | object)[];
  help?: string | React.ReactNode;
  limit?: number;
  value?: (string | number | object)[];
  showSelectedInline?: boolean;
  sortSelectedOnClose?: boolean;
  messages?: {
    clearAll?: string;
    clearAllA11y?: string;
    onMore?: string;
    open?: string;
    optionNotSelected?: string;
    optionSelected?: string;
    search?: string;
    selectAll?: string;
    selectAllA11y?: string;
    selectDropDown?: string;
    selected?: string;
    selectedOfTotal?: string;
    selectedOptions?: string;
    summarizedValue?: string;
  };
}

// Try without Omit<> to see where we define our own attributes for overrides
// value, name, id, onChange, placeholder
export interface SelectMultipleExtendedProps
  extends SelectMultipleProps,
    Omit<JSX.IntrinsicElements['input'], keyof SelectMultipleProps> {}

declare const SelectMultiple: React.FC<SelectMultipleExtendedProps>;

export { SelectMultiple };
