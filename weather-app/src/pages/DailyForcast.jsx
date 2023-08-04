import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  useColorMode,
  Image,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const apiKey = '860544db51b4368b66b90ebe782777c6'; // Replace with your API key

const DailyForecast = () => {
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const handleSearch = async (city) => {
    if (!city) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      const { coord } = response.data;
      const { lat, lon } = coord;

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,alerts,minutely&appid=${apiKey}`
      );
      setForecastData(forecastResponse.data.daily);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setForecastData([]);
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      bgImage={
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5lA-vac3Q0J6JcET3rKwCmeenqb9VabS1iQ&usqp=CAU'
      }
      bgSize="cover"
      bgPosition="center"
      color={isDark ? 'white' : 'black'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      fontSize="xl" // Adjust the default font size
      px={4} // Add some horizontal padding to improve responsiveness
    >
      <Link to="/">
        <ChevronLeftIcon boxSize={6} mb={2} />
      </Link>
      <Heading as="h1" fontSize="4xl" mb={4}>
        Daily Forecast
      </Heading>
      <Input
        type="text"
        placeholder="Enter city name"
        onChange={(e) => handleSearch(e.target.value)}
        mb={4}
        size="sm" // Set the search input size to "sm" (small)
        variant="filled"
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
        }}
        maxWidth="400px" // Set the maximum width of the search input
        w={['100%', '80%', '70%', '60%']} // Adjust width on different screen sizes
      />
      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <Flex
          direction="row"
          flexWrap="wrap" // Allow items to wrap to a new line
          justifyContent="center"
          mt={4}
          width="100%" // Set the width of the result box to 100%
          mx="auto"
          overflowX="auto" // Enable horizontal scrolling if needed
        >
          {forecastData.map((day, index) => (
            <Box
              key={index}
              bg={isDark ? 'gray.700' : 'gray.100'}
              p={4}
              borderRadius="md"
              mt={2}
              mx={1}
              textAlign="center"
              flexGrow={1}
              minW="150px" // Set the minimum width of each result box
              maxW="200px" // Set the maximum width of each result box
              opacity={0.9}
            >
              <Box fontSize="lg" fontWeight="bold" mb={2}>
                {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                })}
              </Box>
              <Box position="relative" mb={4}>
                <Image
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  boxSize="64px"
                  mx="auto"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p={1} // Reduce padding to fit temperature inside the box
                  bg="rgba(0, 0, 0, 0.7)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm" // Reduce font size to fit temperature inside the box
                >
                  {day.temp.day} °C
                </Box>
              </Box>
              <Box fontSize="sm">{day.weather[0].description}</Box>
            </Box>
          ))}
        </Flex>
      )}
      <Button
        variant="solid"
        mt={4}
        colorScheme="blue"
        onClick={() => setForecastData([])}
      >
        Clear
      </Button>
    </Box>
  );
};

export default DailyForecast;
