
import { useState } from 'react';

// Autocomplete input shared by station and train searches.
// `suggestions` is a list of { key, primary, secondary, value }.
function SearchInput({
  id,
  label,
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  icon = '⌕',
  inputMode,
  emptyText = 'No matches found'
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  function choose(item) {
    onChange(item.value);
    onSelect?.(item);
    setOpen(false);
    setHighlight(-1);
  }

  function handleKeyDown(event) {
    if (!open || !suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight(index => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight(index => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && highlight >= 0) {
      event.preventDefault();
      choose(suggestions[highlight]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="station-field">
      {label && <label htmlFor={id}>{label}</label>}

      <div className="station-input-wrap">
        <span className="station-pin" aria-hidden="true">
          {icon}
        </span>

        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          inputMode={inputMode}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          onChange={event => {
            onChange(event.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
        />

        {value && (
          <button
            type="button"
            className="clear-btn"
            aria-label={`Clear ${label || 'search'}`}
            onClick={() => {
              onChange('');
              setOpen(true);
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && value.trim() && (
        <div className="station-suggestions" id={`${id}-list`} role="listbox">
          {suggestions.length ? (
            suggestions.map((item, index) => (
              <button
                type="button"
                role="option"
                aria-selected={index === highlight}
                className={`suggestion-option ${index === highlight ? 'highlighted' : ''}`}
                key={item.key}
                onMouseDown={event => event.preventDefault()}
                onClick={() => choose(item)}
              >
                <span>{item.primary}</span>
                <strong>{item.secondary}</strong>
              </button>
            ))
          ) : (
            <div className="no-suggestions">{emptyText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
