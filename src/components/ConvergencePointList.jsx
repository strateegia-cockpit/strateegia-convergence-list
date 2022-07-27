import { useEffect, useState } from 'react';
import { Box, Text, UnorderedList, Heading, Button } from '@chakra-ui/react';

export default function ConvergencePointList({ convergencePoints }) {
    // console.log('convergencePoints', convergencePoints)
    const [csv, setCsv] = useState([]);
  
    useEffect(() => {
      setCsv([])
      convergencePoints.map(point => point.questions.map(({text, options}) => {
        setCsv(csv => [...csv, {text: text, option: options.map(({text}) => text), results: options.map(({average}) => (average * 100).toFixed(2) + '%')} ]);
      }));
      
    }, [convergencePoints])
  

    return (
      <Box>
        {convergencePoints.length > 0 ? (
          <>
            {convergencePoints.map(convergencePoint =>
              convergencePoint.questions.map(question => (
                <Box margin={10}>
                  <Heading w={700} fontSize={18} mb={5} key={question.id}>{question.text}</Heading>
                    {question.options.map(option => (
                      <Text w={700} mb={2} >{option.text} <strong>{(option.average * 100).toFixed(2)}%</strong></Text>
                    ))}
                </Box>
              ))
            )}
  
          </>
        ) : (
          <p>sem pontos de convergência</p>
        )}
      </Box>
    );
  }
  