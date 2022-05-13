import { useEffect, useState } from 'react';
import * as api from 'strateegia-api';
import MapList from '../components/MapList';
import ProjectList from '../components/ProjectList';

export default function Main() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMap, setSelectedMap] = useState('');

  const handleSelectChange = e => {
    setSelectedProject(e.target.value);
  };

  const handleMapSelectChange = e => {
    setSelectedMap(e.target.value);
  };

  return (
    <>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <p>{selectedProject}</p>
      <p>{selectedMap}</p>
    </>
  );
}
