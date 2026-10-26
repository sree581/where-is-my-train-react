
import SearchInput from './SearchInput';
import { searchStations, stationLabel } from '../utils/stations';

function StationInput(props) {
  const suggestions = searchStations(props.value).map(station => ({
    key: station.code,
    primary: station.name,
    secondary: station.code,
    value: stationLabel(station)
  }));

  return (
    <SearchInput
      icon="📍"
      placeholder="Station name or code"
      emptyText="No matching stations"
      suggestions={suggestions}
      {...props}
    />
  );
}

export default StationInput;
