
interface CellProps {
  value: number | null;
  solutionValue: number | null; 
  isSelected: boolean;
  isHighlighted: boolean;
  isLocked: boolean;
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
    <div
      className={`inline-flex border border-black w-10 h-10 justify-center items-center cursor-pointer transition duration-200 ease-in-out ${isSelected ? "bg-blue-200" : isHighlighted ? "bg-gray-200" : "bg-white"} ${isIncorrect ? "bg-red-200" : ""} ${isLocked ? "bg-gray-200 text-gray-500" : ""}`}
      onClick={onClick}
      onMouseEnter={(event) => {
        if (!isSelected) {
          event.currentTarget.classList.add("bg-yellow-200");
        }
      }}
      onMouseLeave={(event) => {
        if (!isSelected) {
          event.currentTarget.classList.remove("bg-yellow-200");
        }
      }}
    >
      <input
        type="number"
        min="1"
        max="9"
        value={value || ""}
        onChange={(event) => {
          if (!isLocked) { 
            onChange(event.target.value ? parseInt(event.target.value, 10) : null);
          }
        }}
        readOnly={isLocked}
        className={`w-4/5 h-4/5 border-none bg-transparent text-2xl font-bold ${isLocked ? 'pointer-events-none text-gray-500' : 'pointer-events-auto'}`}
      />
    </div>
  );
}

export default Cell;