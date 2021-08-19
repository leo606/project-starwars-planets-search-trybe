import React, { useState, useEffect } from 'react';
import { arrayOf, node } from 'prop-types';
import StarContext from '../context/StarContext';
import usePlanets from '../hooks/usePlanets';
// import fetchPlanets from '../services/planetsAPI';

function StarProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [data, loading] = usePlanets();

  const [filters, setFilters] = useState({
    filterByName: { name: '' },
    filterByNumericValues: [
      {
        column: 'population',
        comparison: 'maior que',
        value: '0',
      },
    ],
  });

  useEffect(() => {
    function getPlanets() {
      setPlanets(data);
    }
    getPlanets();
  }, [data]);

  function filterPlanetsByName() {
    const { filterByName } = filters;
    if (!filterByName.name.length) return setPlanets(data);
    const filtered = planets.filter(
      (e) => e.name.toLowerCase().includes(filterByName.name.toLowerCase()),
    );
    setPlanets(filtered);
  }

  function filterPlanetsByNumeric() {
    const { filterByNumericValues: { column, comparison, value } } = filters;
    switch (comparison) {
    case 'maior que':
      setPlanets(
        planets.filter((p) => parseInt(p[column], 10) > parseInt(value, 10)),
      );
      break;
    case 'menor que':
      setPlanets(
        planets.filter((p) => parseInt(p[column], 10) < parseInt(value, 10)),
      );
      break;
    case 'igual a':
      setPlanets(
        planets.filter((p) => p[column] === value),
      );
      break;
    default:
      break;
    }
  }

  useEffect(filterPlanetsByName, [filters]);
  useEffect(filterPlanetsByNumeric, [filters.filterByNumericValues]);

  const contextValue = {
    planets,
    loading,
    filters,
    setFilters,
  };

  return (
    <StarContext.Provider value={ contextValue }>
      {children}
    </StarContext.Provider>
  );
}

export default StarProvider;

StarProvider.propTypes = {
  children: arrayOf(node).isRequired,
};
