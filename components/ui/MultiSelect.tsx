import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options',
  className,
  disabled = false,
  maxHeight = '200px',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === filteredOptions.length) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map(opt => opt.value);
      onChange(value.filter(v => !filteredValues.includes(v)));
    } else {
      // Select all filtered options
      const allValues = [...new Set([...value, ...filteredOptions.map(opt => opt.value)])];
      onChange(allValues);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedCount = value.length;
  const allFilteredSelected = filteredOptions.length > 0 && filteredOptions.every(opt => value.includes(opt.value));

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-left border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-ring/50 hover:shadow-sm',
            isOpen ? 'border-ring shadow-md' : 'border-input'
          )}
        >
          <span className="block truncate">
            {selectedCount === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                  {selectedCount} selected
                </span>
                {selectedCount <= 3 && (
                  <span className="text-sm text-muted-foreground truncate">
                    {value.slice(0, 3).map(v => options.find(opt => opt.value === v)?.label).join(', ')}
                  </span>
                )}
              </span>
            )}
          </span>
          
          <svg
            className={cn(
              'w-4 h-4 transition-transform text-muted-foreground',
              isOpen && 'transform rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-outline rounded-lg shadow-lg backdrop-blur-sm">
            {/* Search */}
            <div className="p-3 border-b border-outline">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
              />
            </div>

            {/* Select All / Clear All */}
            <div className="flex items-center justify-between p-3 border-b border-outline">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {allFilteredSelected ? 'Deselect All' : 'Select All'}
              </button>
              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Options */}
            <div 
              className="overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 hover:bg-accent/50 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => handleToggleOption(option.value)}
                      className="mr-3 h-4 w-4 text-primary border-input rounded focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                    />
                    <span className="text-sm text-foreground flex-1 group-hover:text-accent-foreground transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}