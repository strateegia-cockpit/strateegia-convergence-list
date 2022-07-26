import { useEffect, useState } from 'react';
import { Box, Text, UnorderedList, Heading, Button } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { exportJSONData } from '../utils/exportFunctions'

export default function ConvergencePointList({ convergencePoints }) {
    // console.log('convergencePoints', convergencePoints)
    const [csv, setCsv] = useState([]);
  
    useEffect(() => {
      setCsv([])
      convergencePoints.map(point => point.questions.map(({text, options}) => {
        setCsv(csv => [...csv, {text: text, option: options.map(({text}) => text), results: options.map(({average}) => (average * 100).toFixed(2) + '%')} ]);
      }));
      
    }, [convergencePoints])
  
    // useEffect(() => {
    //   console.log('csv' ,csv)
    // }, [csv]);
    // console.log('cgPoint', cgPoint)
    return (
      <Box>
        {convergencePoints.length > 0 ? (
          <>
            {/* <Box display='flex' justifyContent='flex-end'>
              <CSVLink data={csv} filename='strateegia_convergence_points_report-csv.csv'>
                <Button
                  size='xs'
                  fontSize='14px'
                  fontWeight='400'
                  bg='#6c757d' 
                  color='#fff'
                  borderRadius='3px'
                  _hover={{bg: '#5C636A'}}
                  paddingBottom={'4px'}
                >
                  csv
                </Button>
              <Button
                m='2px'
                size='xs'
                fontSize='14px'
                fontWeight='400'
                bg='#6c757d' 
                color='#fff'
                borderRadius='3px'
                _hover={{bg: '#5C636A'}}
                paddingBottom={'4px'}
                onClick={() => exportJSONData(csv)}
              >
                json
              </Button>
              </CSVLink>
            </Box> */}
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
  