interface CellProps {
    value: CellValue;
    isSelected: boolean;
    isHighlighted: boolean;
    onClick: () => void;
    onValueChange: (value: CellValue) => void;
    isLocked: boolean;
    isIncorrect: boolean; // new prop
  }
  
type CellValue = number | null;
  
  function Cell({ value, isSelected, isHighlighted, onClick, onValueChange }: CellProps) {
      const isLocked = value !== null; // Determine if the cell should be locked based on its value
    
      return (
        <div
          style={{
            border: '1px solid black',
            width: '40px',
            height: '40px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isSelected ? 'lightblue' : isHighlighted ? 'lightgray' : 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onClick={onClick}
          onMouseEnter={(event) => {
            if (!isSelected) {
              event.currentTarget.style.backgroundColor = 'lightyellow';
            }
          }}
          onMouseLeave={(event) => {
            if (!isSelected) {
              event.currentTarget.style.backgroundColor = isHighlighted ? 'lightgray' : 'white';
            }
          }}
        >
          <input
            type="number"
            min="1"
            max="9"
            value={value || ''}
            onChange={(event) => {
              if (!isLocked) { // Only allow editing if the cell is not locked
                onValueChange(event.target.value ? parseInt(event.target.value, 10) : null);
              }
            }}
            readOnly={isLocked} // Set input to read-only if the cell is locked
            style={{
              width: '80%',
              height: '80%',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '24px',
              fontWeight: 'bold',
              pointerEvents: isLocked ? 'none' : 'auto', // Allow or prevent user interaction based on isLocked
            }}
          />
        </div>
      );
    }

export default Cell;
    