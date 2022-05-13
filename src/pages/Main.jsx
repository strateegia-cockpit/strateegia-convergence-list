import { Box, List, ListItem, ListIcon, UnorderedList } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import * as api from 'strateegia-api';
import MapList from '../components/MapList';
import ProjectList from '../components/ProjectList';

export default function Main() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [convergencePoints, setConvergencePoints] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  const handleSelectChange = e => {
    setSelectedProject(e.target.value);
  };

  const handleMapSelectChange = e => {
    setSelectedMap(e.target.value);
  };

  useEffect(() => {
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
  }, [selectedMap, selectedProject]);

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  return (
    <Box padding={10}>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <Box>
        {convergencePoints ? (
          convergencePoints.map(convergencePoint =>
            convergencePoint.questions.map(question => (
              <Box margin={10}>
                <p key={question.id}>{question.text}</p>
                <UnorderedList margin={5}>
                  {question.options.map(option => (
                    <ListItem key={option.id}>{option.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            ))
          )
        ) : (
          <p>No convergence points</p>
        )}
      </Box>
    </Box>
  );
}
