import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabaseClient';

export default function useSearchOptions() {
  const [lines, setLines] = useState([]);
  const [wages, setWages] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      // Lineテーブル取得
      const { data: lineData, error: lineError } = await supabase
        .from('Line')
        .select('id, linename, RailwayCompany(id, name)');
      if (!lineError && lineData) {
        setLines(lineData);
      }
      // Wageテーブル取得
      const { data: wageData, error: wageError } = await supabase
        .from('wages')
        .select('id, label, value');
      if (!wageError && wageData) {
        setWages(wageData);
      }
      // Occupationテーブル取得
      const { data: occData, error: occError } = await supabase
        .from('Occupation')
        .select('id, occupationname');
      if (!occError && occData) {
        setOccupations(occData);
      }
      setLoading(false);
    }
    fetchOptions();
  }, []);

  return { lines, wages, occupations, loading };
}
