import { Box, ListItem, UnorderedList, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import * as api from 'strateegia-api';
import MapList from '../components/MapList';
import ProjectList from '../components/ProjectList';

export default function Main() {
  const initialTextForCreate =
    'Questão 1: Opção 1.1; Opção 2.2;\nQuestão 2: Opção 2.1; Opção 2.2; Opção 2.3';

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [convergencePoints, setConvergencePoints] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [textForCreate, setTextForCreate] = useState(initialTextForCreate);

  const handleInputChange = e => {
    let inputValue = e.target.value;
    setTextForCreate(inputValue);
  };

  const handleSelectChange = e => {
    setSelectedProject(e.target.value);
  };

  const handleMapSelectChange = e => {
    setSelectedMap(e.target.value);
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
    async function fetchConvergencePoints() {
      try {
        setIsLoading(true);
        const response = await api.getMapById(accessToken, selectedMap);
        // console.log(response);
        const convergencePointsFromApi = response.points.filter(
          content => content.point_type === 'CONVERGENCE'
        );
        // console.log(convergencePointsFromApi);
        const allApiCalls = [];
        convergencePointsFromApi.forEach(element => {
          allApiCalls.push(
            api.getConvergencePointById(accessToken, element.id)
          );
        });
        Promise.all(allApiCalls).then(values => {
          // console.log("values");
          // console.log(values);
          setConvergencePoints(convPoints => [...values]);
          console.log('convPoints');
          console.log(convergencePoints);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchConvergencePoints();
  }, [selectedMap]);

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  return (
    <Box padding={10}>
      <Heading as="h3" size="md" mb={3}>
        listas de convergências
      </Heading>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <ConvergencePointList convergencePoints={convergencePoints} />
    </Box>
  );
}

function ConvergencePointList({ convergencePoints }) {
  return (
    <Box>
      {convergencePoints.length > 0 ? (
        convergencePoints.map(convergencePoint =>
          convergencePoint.questions.map(question => (
            <Box margin={10}>
              <strong key={question.id}>{question.text}</strong>
              <UnorderedList margin={5}>
                {question.options.map(option => (
                  <ListItem key={option.id}>
                    {option.text}: {(option.average * 100).toFixed(2)}%
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          ))
        )
      ) : (
        <p>sem pontos de convergência</p>
      )}
    </Box>
  );
}
