interface CongratulationsMessageProps {
  isVisible: boolean;
}

function CongratulationsMessage({ isVisible }: CongratulationsMessageProps) {
  return isVisible && (
    <div className='text-black'>
      Congratulations, you solved the puzzle!
    </div>
  );
}

export default CongratulationsMessage;
