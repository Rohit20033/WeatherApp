import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Input,
  useColorMode,
  IconButton,
  InputGroup,
  InputRightElement,
  Tooltip,
  Button, // Add Button from Chakra UI
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const apiKey = '860544db51b4368b66b90ebe782777c6'; // Replace with your API key

const Weather = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const handleSearch = () => {
    setLoading(true);
    setShowResults(false); // Hide previous results while loading new data
    fetchData();
  };

  const handleBack = () => {
    setSearchTerm('');
    setShowResults(false); // Hide the weather result and show the search input again
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setLoading(false);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (Object.keys(weatherData).length === 0 && searchTerm && showResults) {
      // If no weather data and search term is provided and showResults is true, fetch the weather data
      setLoading(true);
      fetchData();
    }
  }, [searchTerm, showResults]);

  const { name, main, weather } = weatherData;
  const temp = Math.round(main?.temp - 273.15) || ''; // Fixed the variable name to 'temp'
  const description = weather?.[0]?.description || '';
  const iconCode = weather?.[0]?.icon || '';
  const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  // Get weather condition to dynamically set the background image
  const weatherCondition = weather?.[0]?.main?.toLowerCase() || '';
  const weatherImages = {
    clear: 'https://wallpapers.com/images/hd/sunny-weather-with-cherry-blossom-fr2tn0f21evp0viw.jpg',
    clouds: 'https://getwallpapers.com/wallpaper/full/a/7/7/566396.jpg',
    rain: 'https://e1.pxfuel.com/desktop-wallpaper/47/519/desktop-wallpaper-high-resolution-rainy-day-widescreen-for-rainy-season.jpg',
    default: 'https://wallpapers.com/images/hd/beautiful-weather-with-gradient-sky-r6nxyjof50r7renl.jpg',
  };

  const getBackgroundImageUrl = (condition) => {
    return weatherImages[condition] || weatherImages.default;
  };

  return (
    <Box
      height="100vh"
      bgImage={"https://images.hdqwalls.com/wallpapers/clouds-summer-weather-5k-1b.jpg"}
      bgSize="cover"
      bgPosition="center"
      color={isDark ? 'white' : 'black'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Link to="/daily">
      <Text  marginT>
        DailyForecast
      </Text>
      </Link>
      <Heading as="h1" fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} mb={4}>
        Weather App
      </Heading>
      {loading ? (
        <Flex
          align="center"
          justify="center"
          bg={isDark ? 'gray.800' : 'white'}
          borderRadius="md"
          p={4}
          boxShadow="md"
          textAlign="center"
          color={isDark ? 'white' : 'black'}
          bgImage={`url(${getBackgroundImageUrl(weatherCondition)})`}
          bgSize="cover"
          bgPosition="center"
          w={{ base: '90%', sm: '80%', md: '60%', lg: '50%' }}
          maxWidth="500px"
        >
          <Spinner size="lg" />
        </Flex>
      ) : showResults ? (
        <Box
          bg={isDark ? 'gray.800' : 'white'}
          borderRadius="md"
          p={4}
          boxShadow="md"
          textAlign="center"
          color={isDark ? 'white' : 'black'}
          bgImage={`url(${getBackgroundImageUrl(weatherCondition)})`}
          bgSize="cover"
          bgPosition="center"
          w={{ base: '90%', sm: '80%', md: '60%', lg: '50%' }}
          maxWidth="500px"
        >
          <Text fontSize="2xl" fontWeight="bold">
            {name}
          </Text>
          <img src={weatherIconUrl} alt="Weather Icon" />
          <Text fontSize="xl" mt={4}>
            {temp ? `${temp}°C` : 'No data'}
          </Text>
          <Text fontSize="lg">{description || 'No data'}</Text>
          <Button mt={4} onClick={handleBack}>
            Search Another City
          </Button>
        </Box>
      ) : (
        <InputGroup mt={4} w={{ base: '90%', sm: '80%', md: '60%', lg: '50%' }} maxWidth="500px">
          <Input
            placeholder="Search city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outline"
            onKeyPress={handleKeyPress}
          />
          <InputRightElement>
            <Tooltip label="Search" placement="left">
              <IconButton
                aria-label="Search"
                icon={<i className="fa fa-search" />}
                onClick={handleSearch}
                bg="blue.400"
                color="white"
                _hover={{
                  bg: 'blue.500',
                }}
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      )}
    </Box>
  );
};

export default Weather;
