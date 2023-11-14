import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import WeatherCardItem from "./../FolderList";
import Button from "@mui/material/Button";
import axios from "axios";

function WeatherCard() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [date, setDate] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [forecastData, setForecastData] = useState([]);

  const getLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      return { latitude, longitude };
    } catch (error) {
      console.error("Erro ao obter localização:", error.message);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const currentPosition = await getLocation();

      if (!currentPosition) {
        console.error("Erro ao obter localização.");
        return;
      }

      const { latitude, longitude } = currentPosition;

      const response = await axios.get(
        `http://localhost:3000/weather/${latitude}/${longitude}`
      );

      if (response.status !== 200) {
        throw new Error(
          `Erro na solicitação: ${response.status} - ${response.statusText}`
        );
      }

      const data = response.data;
      setLocation({ latitude, longitude });
      setWeatherData(data);
    } catch (error) {
      console.error("Erro ao obter informações do clima:", error.message);
    } finally {
      const currentDate = new Date();
      setDate({
        day: currentDate.getDate(),
        month: getMonthName(currentDate.getMonth()),
        year: currentDate.getFullYear(),
      });
    }
  };

  const fetchForecastData = async () => {
    try {
      const currentPosition = await getLocation();

      if (!currentPosition) {
        console.error("Erro ao obter localização para previsão do tempo.");
        return;
      }

      const { latitude, longitude } = currentPosition;

      const response = await axios.get(
        `http://localhost:3000/weather/forecast/${latitude}/${longitude}`
      );

      if (response.status === 200) {
        setForecastData(response.data);
      } else {
        throw new Error(
          `Erro na solicitação: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Erro ao obter previsão do tempo:", error.message);
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
      "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    return monthNames[month];
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="sm"
        style={{
          backgroundColor: "#87CEEB",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => fetchData()}
            style={{ margin: "20px" }}
          >
            Hoje
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              setShowForecast(!showForecast);
              if (showForecast) {
                await fetchForecastData();
              }
            }}
            style={{ margin: "20px" }}
          >
            Previsão 5 Dias
          </Button>
        </div>
        {weatherData && date && (
          <React.Fragment>
            {showForecast && forecastData.length > 0 ? (
              <WeatherCardItem
                data={{
                  currentDate: date,
                  weatherData: weatherData,
                  showForecast: showForecast,
                  forecastData: forecastData,
                }}
              />
            ) : (
              <WeatherCardItem
                data={{
                  currentDate: date,
                  weatherData: weatherData,
                  showForecast: showForecast,
                }}
              />
            )}
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
}

export default WeatherCard;
