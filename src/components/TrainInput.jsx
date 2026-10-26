
import SearchInput from './SearchInput';
import { searchTrains, trainLabel } from '../utils/trains';

function TrainInput(props) {
  const suggestions = searchTrains(props.value).map(train => ({
    key: train.number,
    primary: train.name,
    secondary: train.number,
    value: trainLabel(train)
  }));

  return (
    <SearchInput
      icon="🚆"
      placeholder="Train number or name"
      emptyText="No matching trains"
      suggestions={suggestions}
      {...props}
    />
  );
}

export default TrainInput;
