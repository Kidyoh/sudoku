interface CellProps {
  value: number | null;
  solutionValue: number | null; 
  isSelected: boolean;
  isHighlighted: boolean;
  isLocked: boolean; // Add this
  initiallyGenerated: boolean; 
  onClick: () => void;
  onChange: (value: number | null) => void; 
  initiallyGeneratedCells: [number, number][];
  isIncorrect: boolean;
}

function Cell(props: CellProps) {

  const {
    value,
    solutionValue,
    isSelected,
    isHighlighted, 
    initiallyGenerated,
    onClick,
    onChange
  } = props;

  const isLocked = initiallyGenerated;

  const isIncorrect = value !== solutionValue;

  return (
    <div  className={` inline-flex
    border border-black w-10 h-10 flex justify-center items-center
    cursor-pointer transition duration-200 ease-in-out
  `}
      style={{
        backgroundColor: isSelected ? 'lightblue' : isHighlighted ? 'lightgray' : 'white',
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
          if (!isLocked) { 
            onChange(event.target.value ? parseInt(event.target.value, 10) : null);
          }
        }}
        readOnly={isLocked} 
        className={`
        w-4/5 h-4/5 border-none bg-transparent text-2xl font-bold
        ${isLocked ? 'pointer-events-none' : 'pointer-events-auto'}
      `}
      />
    </div>
  );
}

export default Cell;