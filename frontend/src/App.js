import React, { useState, useEffect } from 'react';

import * as api from './services/apiServices.js';
import Spinner from './components/Spinner.js';
import GradesControl from './components/GradesControl.js';

export default function App() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();
      setTimeout(() => {
        setAllGrades(grades);
      }, 2000);
    }

    getGrades();    
  }, []);

  const handleDelete = () => {

  }

  const handlePersist = () => {

  }

  return (
    <div>
      <h1 className="center">Cadastro de notas</h1>

      {allGrades.length === 0 && <Spinner />}
      {allGrades.length > 0 && <GradesControl grades={allGrades} onDelete={handleDelete} onPersist={handlePersist} />}
    </div>
  );
}
