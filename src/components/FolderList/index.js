import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Cidade from './cidade.jpg';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function FolderList({ data }) {
  const { currentDate, weatherData, showForecast , forecastData} = data;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="weather">
            {weatherData.city.substring(0, 1)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`Cidade: ${weatherData.city}`}
        subheader={`Data: ${currentDate.day} ${currentDate.month} ${currentDate.year}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={Cidade}
        alt="Weather condition"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {`Temperatura: ${Math.floor(weatherData.temperature)}°C`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`País: ${weatherData.country}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {showForecast && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
      {showForecast && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {console.log(forecastData)}
            {forecastData &&
              forecastData.map((forecast, index) => (
                <div key={index}>
                  <Typography variant="body2" color="text.secondary">
                  {`Dia ${formatDate(forecast.date)}: ${forecast.temperature}°C`}
                  </Typography>
                  {/* Adicione outras informações de previsão, se disponíveis */}
                </div>
              ))}
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}
