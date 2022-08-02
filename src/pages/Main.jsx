import { Box, Link, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { i18n } from "../translate/i18n";
import * as api from 'strateegia-api';
import MapList from '../components/MapList';
import ProjectList from '../components/ProjectList';
import ConvergencePointList from '../components/ConvergencePointList';
import { ExportsButtons } from "../components/ExportsButtons";
import { generateDocument } from "../components/FileContent";
import { fetchConvergencePoints } from "../utils/exportFunctions"

export default function Main() {
  const initialTextForCreate =
    'Questão 1: Opção 1.1; Opção 2.2;\nQuestão 2: Opção 2.1; Opção 2.2; Opção 2.3';

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [convergencePoints, setConvergencePoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  
  const [accessToken, setAccessToken] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [textForCreate, setTextForCreate] = useState(initialTextForCreate);

  const handleInputChange = e => {
    let inputValue = e.target.value;
    setTextForCreate(inputValue);
  };

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
    setIsLoading(true);
    async function fetchProjectData() {
      try {
        const project = await api.getProjectById(accessToken, e.target.value);
        setProjectData(project);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProjectData();
    // gatherData(accessToken, e.target.value);
  };

  const handleMapSelectChange = (value) => {
    setSelectedMap(value);
  };

  function listOrCreate(e) {
    if (e.target.checked) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
    }
  }

  useEffect(() => {
    setConvergencePoints([]);
  }, [selectedProject]);

  useEffect(() => {
    setConvergencePoints([]);
    async function fetchConvPoints() {
      try {
        setIsLoading(true);
        const allApiCalls =  await fetchConvergencePoints(accessToken, selectedMap);
        
        Promise.all(allApiCalls).then(values => {
          setConvergencePoints(convPoints => [...values]);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchConvPoints();
  }, [selectedMap]);

  
  useEffect(() => {
    
  }, [convergencePoints]);

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  return (
    <Box padding={10}>
      <Box display='flex' >
        <ProjectList handleSelectChange={handleSelectChange} />
        <Link 
          pointerEvents={selectedProject ? '' : 'none'}
          _disabled={selectedProject ? false : true}
          href={selectedProject?.length > 0 ? `https://app.strateegia.digital/journey/${selectedProject}/map/${projectData?.maps[0].id}` : '' }
          target='_blank'
          bg='#E9ECEF'
          borderRadius={' 0 6px 6px 0 '}
          fontSize={16}
          w={200} h='40px'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {i18n.t('main.link')}
        </Link>
      </Box>
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <ExportsButtons data={convergencePoints || ''} saveFile={() => generateDocument(convergencePoints)} project={convergencePoints}/>
      <Heading as="h3" size="md" mb={3}>
        {i18n.t('main.heading')}
      </Heading>
      <ConvergencePointList convergencePoints={convergencePoints} />
    </Box>
  );
}
